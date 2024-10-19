import express from 'express';
import { sendJobEmails } from '../controllers/emailController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/emails/send - Send emails to candidates
router.post('/send', authMiddleware, sendJobEmails);

export default router;
