import express from 'express';
import { getCurrentSchedule } from '../controllers/currentScheduleController';
import { setCurrentSchedule } from '../controllers/currentScheduleController';
import { updateCurrentSchedule } from '../controllers/currentScheduleController';

const router = express.Router();

router.get('/', getCurrentSchedule); // GET /api/current-schedule
router.post('/', setCurrentSchedule);
router.post('/update', updateCurrentSchedule);

export default router;
