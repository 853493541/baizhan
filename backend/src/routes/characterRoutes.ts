import express from 'express';
import { getFullCharacters, getCoreCharacters, getCharacterSummary, } from '../controllers/characterController';

const router = express.Router();

router.get('/', getFullCharacters);        // GET /api/characters
router.get('/core', getCoreCharacters);    // GET /api/characters/core
router.get('/summary', getCharacterSummary);

export default router;
