import express from 'express';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getDentists
} from '../controllers/staffController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/dentists', getDentists);
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', authorize('Admin'), createStaff);
router.put('/:id', authorize('Admin'), updateStaff);
router.delete('/:id', authorize('Admin'), deleteStaff);

export default router;

