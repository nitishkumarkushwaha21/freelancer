import 'dotenv/config';
import mongoose from 'mongoose';
import { ensureAdminUser } from './bootstrap.js';

async function createAdmin() {
  const mongoUri = process.env.MONGO_URI?.trim().replace(/^['"]|['"]$/g, '');
  if (!mongoUri) {
    console.error('MONGO_URI is not set in server/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  await ensureAdminUser();
  await mongoose.disconnect();
  console.log('Done. You can log in at /admin');
}

createAdmin().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
