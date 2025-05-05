import express from 'express';
import Group from '../models/Groups';

const router = express.Router();

// Use ISO week format like "2025-W17"
function getCurrentWeek(): string {
  const now = new Date();
  const year = now.getUTCFullYear();

  const janFirst = new Date(Date.UTC(year, 0, 1));
  const days = Math.floor((now.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + janFirst.getUTCDay() + 1) / 7);

  return `${year}-W${week}`;
}

// GET /api/groups
router.get('/', async (req, res) => {
  const week = getCurrentWeek();
  const groups = await Group.find({ week });

  // Always return 8 groups (empty if missing)
  const fullGroups = Array.from({ length: 8 }, (_, i) => {
    const found = groups.find((g) => g.groupIndex === i);
    return found || {
      week,
      groupIndex: i,
      characters: []
    };
  });

  res.json(fullGroups);
});

// POST /api/groups - Overwrite current week's 8 groups
router.post('/', async (req, res) => {
  const week = getCurrentWeek();
  await Group.deleteMany({ week });

  const incomingGroups = req.body.map((group: any, index: number) => ({
    week,
    groupIndex: index,
    characters: group
  }));

  const saved = await Group.insertMany(incomingGroups);
  res.status(201).json(saved);
});

// DELETE /api/groups - Reset this week's groups
router.delete('/', async (req, res) => {
  const week = getCurrentWeek();
  await Group.deleteMany({ week });
  res.status(204).end();
});

export default router;
