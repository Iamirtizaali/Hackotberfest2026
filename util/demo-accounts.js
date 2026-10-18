// Hardcoded demo accounts for the testing phase.
// ensureDemoAccounts() creates/refreshes these users and the "Demo Project" board in whatever
// database the app is connected to, so a live demo works without running a seed script.
// Set DEMO_ACCOUNTS=off to disable this once the app leaves the testing phase.
const { hash } = require('bcrypt');
const shortId = require('shortid');

const DEMO_BOARD_NAME = 'Demo Project';

// The first account is the project manager and owns the demo board
const DEMO_ACCOUNTS = [
  {
    fullName: 'Paula Planner',
    email: 'demo@trello.test',
    password: 'Demo@12345',
    role: 'Project Manager & Documentation Lead',
    skills: ['Project Management', 'Agile', 'Product', 'Documentation', 'Technical Writing']
  },
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
    skills: ['Node.js', 'MongoDB', 'REST APIs', 'Auth', 'Payments']
  },
  {
    fullName: 'Devon DevOps',
    email: 'devops@trello.test',
    password: 'Devops@12345',
    role: 'DevOps Engineer',
    skills: ['DevOps', 'Docker', 'CI/CD', 'Cloud Deployment', 'Monitoring', 'Testing']
  },
  {
    fullName: 'Sara Designer',
    email: 'designer@trello.test',
    password: 'Designer@12345',
    role: 'Product Designer',
    skills: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping']
  }
];

const isDemoEnabled = () => process.env.DEMO_ACCOUNTS !== 'off';

const isDemoEmail = (email) =>
  typeof email === 'string' && DEMO_ACCOUNTS.some((a) => a.email === email.trim().toLowerCase());

const upsertAccount = async (users, { password, ...profile }) => {
  const passwordHash = await hash(password, 10);
  const existing = await users.findOne({ email: profile.email });

  if (existing) {
    await users.updateOne({ _id: existing._id }, { $set: { ...profile, password: passwordHash } });

    return existing._id;
  }

  const _id = shortId.generate();

  await users.insertOne({ _id, ...profile, password: passwordHash });

  return _id;
};

const provision = async (db) => {
  const users = db.collection('users');
  const boards = db.collection('boards');
  const ids = await Promise.all(DEMO_ACCOUNTS.map((account) => upsertAccount(users, account)));
  const [pmId, ...teamIds] = ids;
  const existingBoard = await boards.findOne({ name: DEMO_BOARD_NAME, createdBy: pmId });

  if (existingBoard) {
    // Membership is exactly the demo team, so the AI only plans onto these five people
    await boards.updateOne({ _id: existingBoard._id }, { $set: { users: teamIds } });

    return { boardId: existingBoard._id, userIds: ids };
  }

  const boardId = shortId.generate();

  await boards.insertOne({
    _id: boardId,
    name: DEMO_BOARD_NAME,
    dateCreated: new Date().toLocaleString(),
    createdBy: pmId,
    backgroundImage: '/boards/board-background.jpg',
    users: teamIds
  });

  return { boardId, userIds: ids };
};

// Runs once per server process; later calls reuse the same promise
const ensureDemoAccounts = (db) => {
  if (!isDemoEnabled()) return Promise.resolve(null);

  if (!global.demoAccountsPromise) {
    global.demoAccountsPromise = provision(db).catch((err) => {
      global.demoAccountsPromise = null;
      throw err;
    });
  }

  return global.demoAccountsPromise;
};

module.exports = { DEMO_ACCOUNTS, DEMO_BOARD_NAME, ensureDemoAccounts, isDemoEmail, provision };
