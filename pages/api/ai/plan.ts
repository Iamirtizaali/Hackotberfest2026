import type { NextApiRequest, NextApiResponse } from 'next';
import { loadBoardContext } from '@/util/ai-board-context';
import { buildSystemPrompt, normalizePlan } from '@/util/ai-plan';
import { callDeepSeekJSON, ChatMessage, DeepSeekError } from '@/util/deepseek';

const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 8000;

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

  const { boardId, messages, previousPlan } = req.body || {};
  const context = await loadBoardContext(req, boardId);

  if (context.ok === false) {
    res.status(context.status).send({ error: context.error });
    return;
  }

  const conversation = buildConversation(messages, previousPlan);

  if (!conversation.length) {
    res.status(400).send({ error: 'Describe the project first.' });
    return;
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

    res.status(200).send({ plan: normalizePlan(raw, members), members });
  } catch (err) {
    const status = err instanceof DeepSeekError && err.code === 'timeout' ? 504 : 502;

    console.error('AI plan failed:', err?.message || err);
    res
      .status(err instanceof DeepSeekError && err.code === 'missing_key' ? 500 : status)
      .send({ error: err?.message || 'AI planning failed.' });
  }
}
