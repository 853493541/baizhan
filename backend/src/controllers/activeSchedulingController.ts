// backend/controllers/activeSchedulingController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ActiveScheduling from '../models/ActiveScheduling';

export const getAllSchedules = async (req: Request, res: Response) => {
  console.log('📥 [Route] GET /api/active-scheduling');

  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongoose not connected (readyState=' + mongoose.connection.readyState + ')');
    }

    console.log('🔍 Attempting ActiveScheduling.find()...');
    const schedules = await ActiveScheduling.find();
    console.log('✅ Schedules found:', schedules.length);
    res.json(schedules);
  } catch (err) {
    console.error('❌ [Controller Error] Failed to fetch schedules:', err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  console.log('🆕 [Route] POST /api/active-scheduling/create');
  try {
    const { name } = req.body;
    const newSchedule = await ActiveScheduling.create({
      name,
      groups: [[], [], [], [], [], [], [], []]
    });
    console.log('✅ Created new schedule:', newSchedule.name);
    res.json(newSchedule);
  } catch (err) {
    console.error('❌ Failed to create schedule:', err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const testDirectRead = async (req: Request, res: Response) => {
  console.log('🔌 [Route] GET /api/active-scheduling/test-direct');
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('MongoDB connection not ready (db is undefined)');
    }

    const result = await db.collection('activeScheduling').find({}).toArray();
    console.log('🧪 Raw result count:', result.length);
    res.json(result);
  } catch (err) {
    console.error('❌ Raw MongoDB read failed:', err);
    res.status(500).json({ error: 'Raw read failed' });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  console.log('📝 [Route] POST /api/active-scheduling/:id');

  try {
    const { id } = req.params;
    const { groups } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid schedule ID' });
    }

    const updated = await ActiveScheduling.findByIdAndUpdate(
      id,
      { groups },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    console.log('✅ Schedule updated:', updated._id);
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update schedule:', err);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};
