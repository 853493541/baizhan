import express from 'express';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  testDirectRead
} from '../controllers/activeSchedulingController';

const router = express.Router();

router.get('/', getAllSchedules);
router.post('/create', createSchedule);
router.get('/test-direct', testDirectRead);
router.post('/:id', updateSchedule); 

export default router;
