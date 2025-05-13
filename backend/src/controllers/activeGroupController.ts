import { Request, Response } from 'express';
import { getDb } from '../utils/db';

export async function getActiveGroup(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const db = await getDb();
    const group = await db.collection('activeGroup').findOne({ activeGroup: id });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active group' });
  }
}

export async function updateActiveGroup(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { groups } = req.body;

  try {
    const db = await getDb();
    const result = await db.collection('activeGroup').updateOne(
      { activeGroup: id },
      { $set: { groups } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update active group' });
  }
}
