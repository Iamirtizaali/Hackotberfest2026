import { UploadAttachment } from '@/src/types/ai';

export const MAX_FILES = 3;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
// Vercel rejects request bodies over 4.5 MB; leave room for the rest of the request
const MAX_TOTAL_CHARS = 4 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export const ACCEPT =
  '.pdf,.docx,.pptx,.xlsx,.txt,.md,.csv,.json,.yaml,.yml,.xml,.html,.htm,.svg,.rtf,.log,.sql,.js,.jsx,.ts,.tsx,.py,.java,.go,.rb,.php,.cs,.css,image/png,image/jpeg,image/webp,image/gif';

const readAsDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('unreadable image'));
    img.src = src;
  });

const stripPrefix = (dataUrl: string): string => dataUrl.slice(dataUrl.indexOf(',') + 1);

// Large photos are scaled down and re-encoded as JPEG so they fit the request limit
const readImage = async (file: File): Promise<UploadAttachment> => {
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));

  if (scale === 1 && file.size <= 1024 * 1024) {
    return { name: file.name, type: file.type, data: stripPrefix(original), isImage: true };
  }

  const canvas = document.createElement('canvas');

  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d');

  // JPEG has no transparency, so paint a white background first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return {
    name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    type: 'image/jpeg',
    data: stripPrefix(canvas.toDataURL('image/jpeg', 0.85)),
    isImage: true
  };
};

export async function readAttachment(file: File): Promise<UploadAttachment> {
  if (IMAGE_TYPES.includes(file.type)) {
    try {
      return await readImage(file);
    } catch (e) {
      throw new Error(`Couldn't open "${file.name}" as an image.`);
    }
  }

  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    throw new Error(`"${file.name}" isn't supported. Use PNG, JPG, WebP or GIF images.`);
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`"${file.name}" is larger than 3 MB.`);
  }

  return {
    name: file.name,
    type: file.type,
    data: stripPrefix(await readAsDataUrl(file)),
    isImage: false
  };
}

export const totalSize = (files: UploadAttachment[]): number =>
  files.reduce((sum, f) => sum + f.data.length, 0);

export const fitsRequestLimit = (files: UploadAttachment[]): boolean =>
  totalSize(files) <= MAX_TOTAL_CHARS;
