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

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

async function start() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not set. Copy server/.env.example to server/.env and add your MongoDB URI.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
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
