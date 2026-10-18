import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { compare } from 'bcrypt';
import { serialize } from 'cookie';

import { sign } from 'jsonwebtoken';
import { ensureDemoAccounts, isDemoEmail } from '@/util/demo-accounts';

const KEY = process.env.JWT_SECRET_KEY;

const isUserExists = async (db, email) => {
  const user = await db.collection('users').findOne({ email: email });

  if (user) {
    return user;
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).send({ error: 'Method not allowed' });

    return;
  }

  const { email, password } = req.body || {};

  // Check any field is empty
  if (!email || !password) {
    res.status(400).send({ error: 'email or password is missing' });

    return;
  }

  try {
    if (!KEY) throw new Error('JWT_SECRET_KEY is not set');

    const { db, client } = await connectToDatabase();

    if (!client.isConnected()) {
      res.status(503).send({ error: 'Database is not available. Try again in a moment.' });

      return;
    }

    // Make sure the hardcoded demo accounts exist in this database before checking them
    if (isDemoEmail(email)) await ensureDemoAccounts(db);

    const userDetail = await isUserExists(db, email);
    const isMatched = userDetail ? await compare(password, userDetail.password) : false;

    if (!isMatched) {
      res.status(404).send({ error: 'Invalid username or password' });

      return;
    }

    const claim = { id: userDetail._id, email: userDetail.email };
    const token = sign({ user: claim }, KEY, { expiresIn: '1h' });

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 1000,
        sameSite: 'strict',
        path: '/'
      })
    );

    res.send({ message: 'success', token, id: userDetail._id, status: 200 });
  } catch (err) {
    // Logged for Vercel's runtime logs; the client gets JSON instead of the HTML error page
    console.error('Login failed:', err);
    res.status(500).send({ error: 'Login is unavailable right now. Please try again shortly.' });
  }
}
