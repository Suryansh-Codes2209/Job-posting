import express from 'express';
import { postJob } from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-interview', authMiddleware, postJob);

export default router;
