import express from 'express';
import { getCharacters } from '../controllers/characterController';
const router = express.Router();

router.get('/', getCharacters);

export default router;
