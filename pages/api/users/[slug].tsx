import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import isValidUser from '@/util/is-valid-user';

const MAX_SKILLS = 20;
const MAX_SKILL_LENGTH = 40;
const MAX_ROLE_LENGTH = 60;

const sanitizeSkills = (skills: unknown): string[] | null => {
  if (!Array.isArray(skills)) return null;

  const seen = new Set<string>();
  const result: string[] = [];

  for (const skill of skills) {
    if (typeof skill !== 'string') continue;

    const trimmed = skill.trim().slice(0, MAX_SKILL_LENGTH);
    const key = trimmed.toLowerCase();

    if (!trimmed || seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);

    if (result.length >= MAX_SKILLS) break;
  }

  return result;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query;

  const { db, client } = await connectToDatabase();

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const user = await db
          .collection('users')
          .findOne({ _id: slug }, { projection: { password: 0 } });

        res.send(user);

        break;
      }

      case 'PATCH': {
        const { isValid, id } = isValidUser({ req });

        if (!isValid) {
          res.status(401).send({ message: 'Unauthorized' });
          break;
        }

        if (id !== slug) {
          res.status(403).send({ message: 'Forbidden' });
          break;
        }

        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
        const update: { skills?: string[]; role?: string } = {};

        if (body.skills !== undefined) {
          const skills = sanitizeSkills(body.skills);

          if (!skills) {
            res.status(400).send({ message: 'skills must be an array of strings' });
            break;
          }

          update.skills = skills;
        }

        if (body.role !== undefined) {
          if (typeof body.role !== 'string') {
            res.status(400).send({ message: 'role must be a string' });
            break;
          }

          update.role = body.role.trim().slice(0, MAX_ROLE_LENGTH);
        }

        if (Object.keys(update).length) {
          await db.collection('users').updateOne({ _id: slug }, { $set: update });
        }

        const user = await db
          .collection('users')
          .findOne({ _id: slug }, { projection: { password: 0 } });

        res.status(200).send(user);

        break;
      }

      case 'DELETE': {
        res.status(405).send({ message: 'Method not allowed' });

        break;
      }

      default:
        res.send({ message: 'DB error' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
