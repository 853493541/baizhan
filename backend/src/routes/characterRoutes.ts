import express from 'express';
import { getFullCharacters, getCoreCharacters, getCharacterSummary,updateCharacter } from '../controllers/characterController';
console.log('✅ characterRoutes loaded');
const router = express.Router();

router.get('/', getFullCharacters);        // GET /api/characters
router.get('/core', getCoreCharacters);    // GET /api/characters/core
router.get('/summary', getCharacterSummary);
router.put('/:id', updateCharacter);


export default router;
