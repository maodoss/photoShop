import express from 'express';
import { 
  createShooting, 
  getClientShootings, 
  getShooting,
  updateShooting
} from '../controllers/shootingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('client'), createShooting)
  .get(protect, authorize('client'), getClientShootings);

router.route('/:id')
  .get(protect, getShooting)
  .put(protect, updateShooting);

export default router;