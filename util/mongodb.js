import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

// Env values pasted from a dashboard often carry surrounding quotes or a leftover
// "NAME=" prefix (e.g. "DATABASE_URL=mongodb+srv://..."), which makes the driver crash.
// Strip those and fail with a readable message if what's left still isn't a Mongo URI.
const normalizeMongoUri = (value) => {
  const uri = String(value || '')
    .trim()
    .replace(/^[A-Za-z_][A-Za-z0-9_]*=/, '')
    .replace(/^(['"])(.*)\1$/, '$2')
    .trim();

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    throw new Error('MongoDB URI must start with mongodb:// or mongodb+srv://');
  }

  return uri;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    };

    const mongoURL = normalizeMongoUri(
      process.env.NODE_ENV === 'development' ? process.env.LOCAL_MONGODB : MONGODB_URI
    );

    cached.promise = MongoClient.connect(mongoURL, opts)
      .then((client) => {
        return {
          client,
          db: client.db(MONGODB_DB)
        };
      })
      .catch((err) => {
        // Don't keep a failed connection cached, or every later request fails instantly
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
