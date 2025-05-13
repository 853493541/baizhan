import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
let dbInstance: any;

export async function getDb() {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db('baizhan');
  }
  return dbInstance;
}
