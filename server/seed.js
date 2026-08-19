import 'dotenv/config';
import mongoose from 'mongoose';
import { ensureAdminUser, ensureDefaultContent } from './bootstrap.js';

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri.trim().replace(/^['"]|['"]$/g, ''));
  console.log('Connected to MongoDB');

  await ensureAdminUser();
  await ensureDefaultContent();

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
