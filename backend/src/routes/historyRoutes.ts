import express from 'express';
import { getAllHistory } from '../controllers/historyController';

const router = express.Router();

router.get('/', getAllHistory);

export default router;
