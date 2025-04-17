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

// GET one character
interface CharacterParams {
  name: string;
}
router.get(
  '/:name',
  async (
    req: Request<CharacterParams, {}, {}, {}>, // ✅ all 4 generics specified
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

// PUT /:name
interface AbilityUpdateBody {
  ability: string;
  level: number;
}
router.put(
  '/:name',
  async (
    req: Request<CharacterParams, {}, AbilityUpdateBody, {}>, // ✅ exact Request type
    res: Response
  ) => {
    const { name } = req.params;
    const { ability, level } = req.body;

    try {
      const character = await Character.findOne({ name });
      if (!character)
        return res.status(404).json({ error: 'Character not found' });

      if (character.abilities instanceof Map) {
        character.abilities.set(ability, level);
      } else {
        character.abilities[ability] = level;
      }

      await character.save();
      res.json({ message: 'Ability updated', character });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update ability' });
    }
  }
);

export default router;
