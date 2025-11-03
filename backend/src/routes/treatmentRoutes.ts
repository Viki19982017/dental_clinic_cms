import express from 'express';
import {
  getAllTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment
} from '../controllers/treatmentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllTreatments);
router.get('/:id', getTreatmentById);
router.post('/', createTreatment);
router.put('/:id', updateTreatment);
router.delete('/:id', deleteTreatment);

export default router;

