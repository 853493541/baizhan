import express from 'express';
import {
  getAllSchedules,
  createSchedule,
  testDirectRead
} from '../controllers/activeSchedulingController';

const router = express.Router();

router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.get('/test-direct', testDirectRead);

export default router;
