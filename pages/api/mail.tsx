import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import checkEnvironment from '@/util/check-environment';
import sgMail from '@sendgrid/mail';
import shortId from 'shortid';
import uniqid from 'uniqid';

const sendMail = (email, res, emailData, user) => {
  const url = checkEnvironment();
  const page = 'signup';

  const msg = {
    to: email,
    from: 'dell41ankit@gmail.com',
    subject: "You're invited to a board on Tessera",
    html: `<div style="background:#F2F3EF; padding:40px 16px; font-family:-apple-system, 'Segoe UI', sans-serif; color:#1E2925;">
      <div style="max-width:480px; margin:0 auto; background:#FFFFFF; border:1px solid #E3E5E0; border-radius:10px; padding:32px;">
        <p style="margin:0 0 24px; font-size:18px; font-weight:600; letter-spacing:-0.02em;">Tessera</p>
        <p style="margin:0 0 8px; font-size:20px; font-weight:600;">You've been invited to a board</p>
        <p style="margin:0 0 24px; font-size:15px; line-height:1.5; color:#66706B;">Join the board to see its cards and start working with your team.</p>
        <a href='${url}/${page}?token=${emailData.token}&email=${email}&boardId=${emailData.boardId}' style="display:inline-block; background:#2B44C7; color:#FFFFFF; text-decoration:none; font-weight:500; padding:12px 20px; border-radius:6px;">Join board</a>
      </div>
    </div>`
  };

  sgMail
    .send(msg)
    .then(() => {
      res.send({ message: 'Email sent sucessfully', status: 200 });
    })
    .catch((error) => {
      console.error(error);
      res.send({ message: 'Failed to send' });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { db, client } = await connectToDatabase();

  if (client.isConnected()) {
    const requestType = req.method;

    switch (requestType) {
      case 'POST': {
        const { email, boardId } = req.body;

        const token = uniqid();
        const id = shortId.generate();

        const emailData = {
          id,
          token,
          boardId
        };

        await db
          .collection('token')
          .insertOne({ token, userId: id, status: 'valid', email, boardId });
        const user = await db.collection('users').findOne({ email });

        await sendMail(email, res, emailData, user);

        res.status(200);

        return;
      }

      default:
        res.send({ message: 'DB error' });
        break;
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 });
  }
}
