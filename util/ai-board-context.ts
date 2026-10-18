import type { NextApiRequest } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import isValidUser from '@/util/is-valid-user';
import type { PlanMember } from '@/util/ai-plan';

type BoardContext =
  | { ok: false; status: number; error: string }
  | {
      ok: true;
      db: any;
      userId: string;
      board: any;
      members: PlanMember[];
      columns: any[];
    };

// Authenticates the caller, checks they belong to the board and loads its members + columns
export async function loadBoardContext(
  req: NextApiRequest,
  boardId: unknown
): Promise<BoardContext> {
  const { isValid, id: userId } = isValidUser({ req }) || { isValid: false, id: undefined };

  if (!isValid || !userId) return { ok: false, status: 401, error: 'Please log in again.' };
  if (typeof boardId !== 'string' || !boardId)
    return { ok: false, status: 400, error: 'Pick a board first.' };

  const { db, client } = await connectToDatabase();

  if (!client.isConnected()) return { ok: false, status: 500, error: 'Database connection error.' };

  const board = await db.collection('boards').findOne({ _id: boardId });

  if (!board) return { ok: false, status: 404, error: 'Board not found.' };

  const memberIds: string[] = Array.from(
    new Set([board.createdBy, ...(board.users || [])].filter(Boolean))
  );

  if (!memberIds.includes(userId)) {
    return { ok: false, status: 403, error: 'You are not a member of this board.' };
  }

  const [users, loads, columns] = await Promise.all([
    db
      .collection('users')
      .find({ _id: { $in: memberIds } }, { projection: { password: 0 } })
      .toArray(),
    db
      .collection('cards')
      .aggregate([
        { $match: { assignedTo: { $in: memberIds } } },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
      ])
      .toArray(),
    db.collection('columns').find({ boardId }).sort({ sequence: 1 }).toArray()
  ]);

  const loadById: Record<string, number> = {};

  loads.forEach((l) => (loadById[l._id] = l.count));

  const members: PlanMember[] = users.map((u) => ({
    _id: u._id,
    fullName: u.fullName || u.email,
    email: u.email,
    role: u.role || '',
    skills: Array.isArray(u.skills) ? u.skills : [],
    openTasks: loadById[u._id] || 0
  }));

  return { ok: true, db, userId, board, members, columns };
}
