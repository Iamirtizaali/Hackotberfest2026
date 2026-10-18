import type { NextApiRequest, NextApiResponse } from 'next';
import { loadBoardContext } from '@/util/ai-board-context';
import { buildSystemPrompt, normalizePlan } from '@/util/ai-plan';
import { AttachmentError, processAttachments } from '@/util/ai-attachments';
import { callDeepSeekJSON, ChatMessage, ContentPart, DeepSeekError } from '@/util/deepseek';

// Uploads arrive as base64 JSON; Vercel caps request bodies at 4.5 MB
export const config = { api: { bodyParser: { sizeLimit: '4.5mb' } } };

const MAX_HISTORY = 12;
// Earlier messages can carry the text of documents attached in that turn
const MAX_MESSAGE_CHARS = 130000;
const DEFAULT_FILE_PROMPT =
  'Read the attached file(s), understand the project and generate tickets for it.';

// Keeps the PM's messages and puts the current plan right before the latest request,
// so follow-ups like "split into 2 sprints" edit the same plan
const buildConversation = (messages: unknown, previousPlan: unknown): ChatMessage[] => {
  const userMessages: ChatMessage[] = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && m.role === 'user' && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: 'user', content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (!previousPlan || userMessages.length < 2) return userMessages;

  const latest = userMessages[userMessages.length - 1];

  return [
    ...userMessages.slice(0, -1),
    { role: 'assistant', content: JSON.stringify(previousPlan) },
    latest
  ];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  const { boardId, messages, previousPlan, attachments } = req.body || {};
  const context = await loadBoardContext(req, boardId);

  if (context.ok === false) {
    res.status(context.status).send({ error: context.error });
    return;
  }

  let files;

  try {
    files = await processAttachments(attachments);
  } catch (err) {
    const message =
      err instanceof AttachmentError ? err.message : 'Could not read the attached file.';

    res.status(400).send({ error: message });
    return;
  }

  const hasFiles = Boolean(files.documentText || files.images.length);
  const history = Array.isArray(messages) ? [...messages] : [];
  const last = history[history.length - 1];

  // Sending only files is fine: give the model a default instruction
  if (hasFiles && (!last || last.role !== 'user' || !String(last.content || '').trim())) {
    history.push({ role: 'user', content: DEFAULT_FILE_PROMPT });
  }

  const conversation = buildConversation(history, previousPlan);

  if (!conversation.length) {
    res.status(400).send({ error: 'Describe the project or attach a file first.' });
    return;
  }

  if (hasFiles) {
    const latest = conversation[conversation.length - 1];
    const text = [latest.content as string, files.documentText].filter(Boolean).join('\n\n');

    latest.content = files.images.length
      ? [
          { type: 'text', text },
          ...files.images.map(
            (img): ContentPart => ({ type: 'image_url', image_url: { url: img.dataUrl } })
          )
        ]
      : text;
  }

  const { board, members, columns } = context;

  try {
    const raw = await callDeepSeekJSON({
      system: buildSystemPrompt({
        members,
        existingColumns: columns.map((c) => c.columnName).filter(Boolean),
        boardName: board.name
      }),
      messages: conversation
    });

    res.status(200).send({
      plan: normalizePlan(raw, members),
      members,
      // The client keeps this with the message so follow-up turns still see the documents
      attachmentContext: files.context
    });
  } catch (err) {
    const status = err instanceof DeepSeekError && err.code === 'timeout' ? 504 : 502;

    console.error('AI plan failed:', err?.message || err);
    res
      .status(err instanceof DeepSeekError && err.code === 'missing_key' ? 500 : status)
      .send({ error: err?.message || 'AI planning failed.' });
  }
}
