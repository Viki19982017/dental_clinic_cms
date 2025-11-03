import express from 'express';
import { login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;

