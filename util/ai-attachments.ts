// Turns files uploaded in the AI Planner into model input: documents become text,
// images are passed through as image parts for DeepSeek's vision input.
import JSZip from 'jszip';
import mammoth from 'mammoth';
// Import pdf-parse's inner module: its index.js runs a debug harness when bundled
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
// pdf-parse loads this file with a dynamic require; importing it statically makes sure
// Vercel's file tracing ships it with the function
import 'pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js';

export const MAX_ATTACHMENTS = 3;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MAX_CHARS_PER_FILE = 60000;
const MAX_TOTAL_CHARS = 120000;

const IMAGE_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif'
};

const TEXT_EXTENSIONS = new Set([
  'txt',
  'md',
  'markdown',
  'csv',
  'tsv',
  'json',
  'yaml',
  'yml',
  'xml',
  'html',
  'htm',
  'svg',
  'rtf',
  'log',
  'ini',
  'toml',
  'sql',
  'js',
  'jsx',
  'ts',
  'tsx',
  'py',
  'java',
  'go',
  'rb',
  'php',
  'cs',
  'c',
  'cpp',
  'h',
  'swift',
  'kt',
  'rs',
  'sh',
  'css',
  'scss',
  'vue',
  'env'
]);

export const SUPPORTED_DESCRIPTION =
  'PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), text/markdown/CSV/JSON/code files and images (PNG, JPG, WebP, GIF)';

export class AttachmentError extends Error {}

export type UploadedFile = { name: string; type?: string; data: string };

export type ImagePart = { name: string; dataUrl: string };

export type ProcessedAttachments = {
  // Text block appended to the PM's message (documents only)
  documentText: string;
  images: ImagePart[];
  // Short description for later turns, e.g. "[Image attached: wireframe.png]"
  context: string;
};

const extensionOf = (name: string): string => {
  const match = /\.([a-z0-9]+)$/i.exec(name || '');

  return match ? match[1].toLowerCase() : '';
};

const decodeXmlText = (s: string): string =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const textInTags = (xml: string, tag: string): string[] => {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g');
  const out: string[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(xml))) out.push(decodeXmlText(m[1]));

  return out;
};

const byNumberInName = (a: string, b: string): number =>
  Number((a.match(/(\d+)\.xml$/) || [])[1] || 0) - Number((b.match(/(\d+)\.xml$/) || [])[1] || 0);

const extractPptx = async (buffer: Buffer): Promise<string> => {
  const zip = await JSZip.loadAsync(buffer);
  const slides = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort(byNumberInName);
  const parts: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const xml = await zip.file(slides[i]).async('string');

    parts.push(`Slide ${i + 1}: ${textInTags(xml, 'a:t').join(' ')}`);
  }

  return parts.join('\n');
};

const extractXlsx = async (buffer: Buffer): Promise<string> => {
  const zip = await JSZip.loadAsync(buffer);
  const shared = zip.file('xl/sharedStrings.xml');
  const strings = shared ? textInTags(await shared.async('string'), 't') : [];
  const sheets = Object.keys(zip.files)
    .filter((f) => /^xl\/worksheets\/sheet\d+\.xml$/.test(f))
    .sort(byNumberInName);
  const parts: string[] = [];

  for (let i = 0; i < sheets.length; i++) {
    const xml = await zip.file(sheets[i]).async('string');
    const rows = xml.match(/<row[\s\S]*?<\/row>/g) || [];
    const lines = rows.map((row) =>
      (row.match(/<c[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) || [])
        .map((cell) => {
          const value = (cell.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
          const inline = textInTags(cell, 't').join('');

          if (/t="s"/.test(cell) && value !== undefined) return strings[Number(value)] || '';

          return inline || (value !== undefined ? decodeXmlText(value) : '');
        })
        .join(' | ')
    );

    parts.push(`Sheet ${i + 1}:\n${lines.join('\n')}`);
  }

  return parts.join('\n\n');
};

// Rejects binary data that was given a text-like name
const decodeText = (buffer: Buffer, name: string): string => {
  const text = buffer.toString('utf8');
  const sample = text.slice(0, 5000);
  let suspicious = 0;

  // NUL bytes and U+FFFD replacement characters mean the bytes weren't valid text
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);

    if (code === 0 || code === 0xfffd) suspicious++;
  }

  if (sample.length && suspicious / sample.length > 0.02) {
    throw new AttachmentError(
      `"${name}" doesn't look like a readable file. Supported: ${SUPPORTED_DESCRIPTION}.`
    );
  }

  return text;
};

const extractText = async (buffer: Buffer, name: string, ext: string): Promise<string> => {
  try {
    if (ext === 'pdf') return (await pdfParse(buffer)).text || '';
    if (ext === 'docx') return (await mammoth.extractRawText({ buffer })).value || '';
    if (ext === 'pptx') return await extractPptx(buffer);
    if (ext === 'xlsx') return await extractXlsx(buffer);
  } catch (e) {
    throw new AttachmentError(
      `Couldn't read "${name}". The file may be damaged or password-protected.`
    );
  }

  if (TEXT_EXTENSIONS.has(ext) || !ext) return decodeText(buffer, name);

  // Unknown extension: accept it only if it is actually text
  return decodeText(buffer, name);
};

export async function processAttachments(files: unknown): Promise<ProcessedAttachments> {
  const list = (Array.isArray(files) ? files : []).filter(
    (f) => f && typeof f.name === 'string' && typeof f.data === 'string'
  ) as UploadedFile[];

  if (list.length > MAX_ATTACHMENTS) {
    throw new AttachmentError(`Attach up to ${MAX_ATTACHMENTS} files at a time.`);
  }

  const documents: string[] = [];
  const images: ImagePart[] = [];
  const notes: string[] = [];
  let totalChars = 0;

  for (const file of list) {
    const name = file.name.slice(0, 120);
    const ext = extensionOf(name);
    const base64 = file.data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    if (!buffer.length) throw new AttachmentError(`"${name}" is empty.`);
    if (buffer.length > MAX_FILE_BYTES) {
      throw new AttachmentError(`"${name}" is larger than 3 MB. Try a smaller file.`);
    }

    const imageType =
      IMAGE_TYPES[ext] || (/^image\/(png|jpeg|webp|gif)$/.test(file.type || '') && file.type);

    if (imageType) {
      images.push({ name, dataUrl: `data:${imageType};base64,${base64}` });
      notes.push(`[Image attached earlier: ${name}]`);
      continue;
    }

    if (['doc', 'xls', 'ppt'].includes(ext)) {
      throw new AttachmentError(
        `"${name}" is an old Office format. Save it as .${ext}x or PDF and try again.`
      );
    }

    const text = (await extractText(buffer, name, ext))
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!text) {
      throw new AttachmentError(
        `No text found in "${name}". If it's a scanned document, upload it as an image instead.`
      );
    }

    const room = Math.max(0, Math.min(MAX_CHARS_PER_FILE, MAX_TOTAL_CHARS - totalChars));
    const clipped = text.length > room ? `${text.slice(0, room)}\n[...truncated]` : text;

    totalChars += clipped.length;
    documents.push(`<<<FILE ${name}>>>\n${clipped}\n<<<END FILE ${name}>>>`);
  }

  const documentText = documents.length ? `Attached documents:\n${documents.join('\n\n')}` : '';

  return {
    documentText,
    images,
    context: [documentText, ...notes].filter(Boolean).join('\n\n')
  };
}
