import express from 'express';
import { getActiveGroup, updateActiveGroup } from '../controllers/activeGroupController';

const router = express.Router();

router.get('/:id', getActiveGroup);
router.put('/:id', updateActiveGroup);

export default router;
