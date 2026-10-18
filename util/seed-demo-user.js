// Seeds a demo account into the local MongoDB so you can log in without signing up.
// Usage: node util/seed-demo-user.js
const { MongoClient } = require('mongodb');
const { hash } = require('bcrypt');
const shortId = require('shortid');

const MONGO_URL = process.env.LOCAL_MONGODB || 'mongodb://127.0.0.1:27017/trello';
const DB_NAME = process.env.MONGODB_DB || 'trello';

const DEMO_USER = {
  fullName: 'Demo User',
  email: 'demo@trello.test',
  password: 'Demo@12345'
};

(async () => {
  const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = client.db(DB_NAME).collection('users');

  // Same shape and salt rounds as pages/api/register
  const password = await hash(DEMO_USER.password, 10);
  const existing = await users.findOne({ email: DEMO_USER.email });

  if (existing) {
    await users.updateOne({ _id: existing._id }, { $set: { password, fullName: DEMO_USER.fullName } });
    console.log(`Updated existing demo user (${existing._id})`);
  } else {
    const _id = shortId.generate();
    await users.insertOne({ _id, email: DEMO_USER.email, password, fullName: DEMO_USER.fullName });
    console.log(`Created demo user (${_id})`);
  }

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
