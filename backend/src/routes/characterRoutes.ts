import express, { Request, Response } from 'express';
import Character from '../models/Character';

const router = express.Router();

// GET all characters
router.get('/', async (_req: Request, res: Response) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// GET one character by name
interface CharacterParams {
  name: string;
}

router.get(
  '/:name',
  async (
    req: Request<CharacterParams, {}, {}, {}>,
    res: Response
  ) => {
    const { name } = req.params;
    try {
      const character = await Character.findOne({ name });
      if (!character)
        return res.status(404).json({ error: 'Character not found' });
      res.json(character);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUT full character update
router.put(
  '/:name',
  async (
    req: Request<CharacterParams>,
    res: Response
  ) => {
    const { name } = req.params;
    const updatedData = req.body;

    try {
      const character = await Character.findOneAndUpdate(
        { name },
        updatedData,
        { new: true, runValidators: true }
      );

      if (!character)
        return res.status(404).json({ error: 'Character not found' });

      res.json({ message: 'Character updated', character });
    } catch (err) {
      console.error('❌ 更新失败:', err);
      res.status(500).json({ error: 'Failed to update character' });
    }
  }
);

export default router;
