// Creates/refreshes the hardcoded demo accounts (util/demo-accounts.js) and the "Demo Project" board.
// The app also does this automatically on the first demo login, so this script is optional.
// Usage: node util/seed-demo-team.js
const { MongoClient } = require('mongodb');
const { DEMO_ACCOUNTS, provision } = require('./demo-accounts');

const MONGO_URL = process.env.LOCAL_MONGODB || 'mongodb://127.0.0.1:27017/trello';
const DB_NAME = process.env.MONGODB_DB || 'trello';

(async () => {
  const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const { boardId, userIds } = await provision(client.db(DB_NAME));

  DEMO_ACCOUNTS.forEach((account, i) => console.log(`${account.role}: ${account.email} (${userIds[i]})`));
  console.log(`Demo Project board id: ${boardId}`);

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
