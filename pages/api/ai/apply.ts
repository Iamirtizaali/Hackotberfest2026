import type { NextApiRequest, NextApiResponse } from 'next';
import shortId from 'shortid';
import { loadBoardContext } from '@/util/ai-board-context';
import { normalizePlan, planToCardDescription } from '@/util/ai-plan';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Method not allowed' });
    return;
  }

  const { boardId, plan: rawPlan, messages } = req.body || {};
  const context = await loadBoardContext(req, boardId);

  if (context.ok === false) {
    res.status(context.status).send({ error: context.error });
    return;
  }

  const { db, userId, board, members, columns: existingColumns } = context;

  // Re-validate against the current members; never trust the client's copy
  const plan = normalizePlan(rawPlan, members);

  if (!plan.tasks.length) {
    res.status(400).send({ error: 'The plan has no tasks to create.' });
    return;
  }

  const dateCreated = new Date().toLocaleString();
  const columnIdByName: Record<string, string> = {};
  const newColumns = [];
  let nextColumnSequence = existingColumns.reduce((max, c) => Math.max(max, Number(c.sequence) || 0), 0) + 1;

  plan.columns.forEach((name) => {
    const existing = existingColumns.find(
      (c) => (c.columnName || '').trim().toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      columnIdByName[name] = existing._id;
      return;
    }

    const column = {
      _id: shortId.generate(),
      boardId,
      boardName: board.name,
      columnName: name,
      dateCreated,
      userId,
      sequence: nextColumnSequence++
    };

    columnIdByName[name] = column._id;
    newColumns.push(column);
  });

  // Continue card sequences after any cards already in reused columns
  const targetColumnIds = Object.values(columnIdByName);
  const lastSequences = await db
    .collection('cards')
    .aggregate([
      { $match: { boardId, columnId: { $in: targetColumnIds } } },
      { $group: { _id: '$columnId', max: { $max: '$sequence' } } }
    ])
    .toArray();
  const nextCardSequence: Record<string, number> = {};

  targetColumnIds.forEach((id) => (nextCardSequence[id] = 1));
  lastSequences.forEach((s) => (nextCardSequence[s._id] = (Number(s.max) || 0) + 1));

  const memberById: Record<string, typeof members[number]> = {};

  members.forEach((m) => (memberById[m._id] = m));

  const cards = plan.tasks.map((task) => {
    const columnId = columnIdByName[task.column] || targetColumnIds[0];

    return {
      _id: shortId.generate(),
      boardId,
      columnId,
      title: task.title,
      type: '',
      description: planToCardDescription(task, memberById[task.assigneeId]),
      dateCreated,
      userId,
      sequence: nextCardSequence[columnId]++,
      assignedTo: task.assigneeId || '',
      // The card's coloured label shows its priority; the task type is in the description
      label: { type: `${task.priority} priority`, bg: plan.priorityColors[task.priority] }
    };
  });

  if (newColumns.length) await db.collection('columns').insertMany(newColumns);
  await db.collection('cards').insertMany(cards);

  // Record the AI response alongside what was created from it
  const planId = shortId.generate();

  await db.collection('aiPlans').insertOne({
    _id: planId,
    boardId,
    createdBy: userId,
    messages: Array.isArray(messages) ? messages.slice(-20) : [],
    plan,
    columnIds: targetColumnIds,
    cardIds: cards.map((c) => c._id),
    createdAt: new Date()
  });

  res.status(200).send({ columnsCreated: newColumns.length, cardsCreated: cards.length, planId });
}
