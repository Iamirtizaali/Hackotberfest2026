// Seeds the demo PM, a 4-person demo team with skills profiles, and a "Demo Project" board.
// Idempotent: users are upserted by email, the board by name + createdBy.
// Usage: node util/seed-demo-team.js
const { MongoClient } = require('mongodb');
const { hash } = require('bcrypt');
const shortId = require('shortid');

const MONGO_URL = process.env.LOCAL_MONGODB || 'mongodb://127.0.0.1:27017/trello';
const DB_NAME = process.env.MONGODB_DB || 'trello';

const BOARD_NAME = 'Demo Project';

// Same password as util/seed-demo-user.js; only used if the demo user doesn't exist yet
const DEMO_PM = {
  fullName: 'Demo User',
  email: 'demo@trello.test',
  password: 'Demo@12345',
  role: 'Project Manager',
  skills: ['Project Management', 'Agile', 'Product']
};

// Test-only passwords for local development
const TEAMMATES = [
  {
    fullName: 'Fiona Frontend',
    email: 'frontend@trello.test',
    password: 'Frontend@12345',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'TypeScript', 'CSS']
  },
  {
    fullName: 'Ben Backend',
    email: 'backend@trello.test',
    password: 'Backend@12345',
    role: 'Backend Developer',
    skills: ['Node.js', 'MongoDB', 'REST APIs', 'Auth']
  },
  {
    fullName: 'Dana Designer',
    email: 'designer@trello.test',
    password: 'Designer@12345',
    role: 'Product Designer',
    skills: ['UI/UX', 'Figma', 'Design Systems']
  },
  {
    fullName: 'Quinn QA',
    email: 'qa@trello.test',
    password: 'Quinn@12345',
    role: 'QA / DevOps Engineer',
    skills: ['QA', 'Testing', 'Cypress', 'DevOps', 'Docker']
  }
];

// Upserts a user by email. Existing users keep their password unless resetPassword is true.
const upsertUser = async (users, { password, ...profile }, { resetPassword } = {}) => {
  const existing = await users.findOne({ email: profile.email });

  if (existing) {
    const $set = { fullName: profile.fullName, role: profile.role, skills: profile.skills };

    if (resetPassword || !existing.password) {
      $set.password = await hash(password, 10);
    }

    await users.updateOne({ _id: existing._id }, { $set });
    console.log(`Updated ${profile.email} (${existing._id})`);

    return existing._id;
  }

  const _id = shortId.generate();
  await users.insertOne({ _id, ...profile, password: await hash(password, 10) });
  console.log(`Created ${profile.email} (${_id})`);

  return _id;
};

(async () => {
  const client = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(DB_NAME);
  const users = db.collection('users');
  const boards = db.collection('boards');

  const pmId = await upsertUser(users, DEMO_PM);
  const teammateIds = [];

  for (const teammate of TEAMMATES) {
    teammateIds.push(await upsertUser(users, teammate, { resetPassword: true }));
  }

  const existingBoard = await boards.findOne({ name: BOARD_NAME, createdBy: pmId });
  let boardId;

  if (existingBoard) {
    boardId = existingBoard._id;
    await boards.updateOne({ _id: boardId }, { $addToSet: { users: { $each: teammateIds } } });
    console.log(`Updated board "${BOARD_NAME}"`);
  } else {
    boardId = shortId.generate();
    await boards.insertOne({
      _id: boardId,
      name: BOARD_NAME,
      dateCreated: new Date().toLocaleString(),
      createdBy: pmId,
      backgroundImage: '/boards/board-background.jpg',
      users: teammateIds
    });
    console.log(`Created board "${BOARD_NAME}"`);
  }

  console.log(`Demo Project board id: ${boardId}`);

  await client.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
