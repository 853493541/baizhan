import { Request, Response } from 'express';
import { getDb } from '../utils/db';

export async function getCharacters(req: Request, res: Response) {
  try {
    const db = await getDb();
    const characters = await db.collection('characters').find().toArray();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
}
