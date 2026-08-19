import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import leadsRouter from './routes/leads.js';
import authRouter from './routes/auth.js';
import reviewsRouter from './routes/reviews.js';
import contentRouter from './routes/content.js';
import adminContentRouter from './routes/admin/content.js';
import adminUsersRouter from './routes/admin/users.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://freelancer-xi-nine.vercel.app',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use('/api/auth', authRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/content', contentRouter);
app.use('/api/admin', adminContentRouter);
app.use('/api/admin/users', adminUsersRouter);

function sanitizeMongoUri(raw) {
  return raw.trim().replace(/^['"]|['"]$/g, '');
}

async function start() {
  const mongoUri = process.env.MONGO_URI ? sanitizeMongoUri(process.env.MONGO_URI) : '';

  if (!mongoUri) {
    console.error('MONGO_URI is not set. Add it in Render Environment, or copy server/.env.example to server/.env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    if (/bad auth|authentication failed/i.test(err.message)) {
      console.error(
        'Check MONGO_URI on Render: use the Atlas database user (not your Atlas login), URL-encode special characters in the password, and do not wrap the value in quotes.'
      );
    }
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other server or set PORT in server/.env`);
      process.exit(1);
    }
    throw err;
  });
}

start();
