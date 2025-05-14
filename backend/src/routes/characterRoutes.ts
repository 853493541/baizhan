import express from 'express';
import { getFullCharacters, getCoreCharacters } from '../controllers/characterController';

const router = express.Router();

router.get('/', getFullCharacters);        // GET /api/characters
router.get('/core', getCoreCharacters);    // GET /api/characters/core

export default router;
