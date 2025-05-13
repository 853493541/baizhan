import { Request, Response } from 'express';
import { getDb } from '../utils/db';

export async function getAllHistory(req: Request, res: Response) {
  try {
    const db = await getDb();
    const history = await db.collection('history').find().sort({ savedAt: -1 }).toArray();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}
