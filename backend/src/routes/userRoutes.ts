import express from 'express';
import { getUsers } from '../handlers/userHandlers';

const router = express.Router();

router.get('/', getUsers);

export default router;
