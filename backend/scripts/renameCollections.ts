// scripts/renameLineups.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || '';
const dbName = 'baizhan';

async function renameLineups() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  console.log('🔁 Renaming lineups → activeGrouping...');
  await db.collection('lineups').aggregate([{ $out: 'activeGrouping' }]).toArray();
  await db.collection('lineups').drop();

  console.log('✅ Renamed successfully.');
  await client.close();
}

renameLineups().catch(console.error);
