import { Request, Response } from 'express';
import CurrentSchedule from '../models/currentScheduleModel';

export const getCurrentSchedule = async (req: Request, res: Response) => {
  try {
    const current = await CurrentSchedule.findOne(); // Removed .sort({ createdAt: -1 })
    if (!current) {
      return res.status(404).json({ message: 'No schedule found' });
    }
    res.json(current);
  } catch (err) {
    console.error('❌ Failed to fetch current schedule:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const setCurrentSchedule = async (req: Request, res: Response) => {
  try {
    const { schedule } = req.body;
    if (
      !Array.isArray(schedule) ||
      schedule.length !== 8 ||
      !schedule.every(g => typeof g.groupIndex === 'number' && Array.isArray(g.characters))
    ) {
      return res.status(400).send('Invalid schedule format');
    }

    const groups = schedule.map(g => ({
      groupIndex: g.groupIndex,
      characters: g.characters,
      completed: false,
      note: ""
    }));

    await CurrentSchedule.deleteMany({});
    await CurrentSchedule.create({ groups }); // ⬅️ Removed weekTag and createdAt

    res.send('✅ Schedule saved');
  } catch (err) {
    console.error('❌ Failed to save current schedule:', err);
    res.status(500).send('Error saving current schedule');
  }
};

export const updateCurrentSchedule = async (req: Request, res: Response) => {
  try {
    const { _id, groups } = req.body;

    if (!_id || !Array.isArray(groups)) {
      return res.status(400).send('Missing schedule ID or groups array');
    }

    await CurrentSchedule.findByIdAndUpdate(_id, { groups });

    res.send('✅ Schedule updated');
  } catch (err) {
    console.error('❌ Failed to update current schedule:', err);
    res.status(500).send('Server error');
  }
};
