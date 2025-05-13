// scripts/seedConfig.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || '';
const dbName = 'baizhan';

async function seedConfig() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection('config').deleteMany({}); // wipe old config (optional)

  const result = await db.collection('config').insertOne({
    configName: 'default',
    coreAbilityLevelAbove: 8,
  });

  console.log("✅ Seeded config:", result.insertedId);
  await client.close();
}

seedConfig().catch(console.error);
