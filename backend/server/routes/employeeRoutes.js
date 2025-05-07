import express from 'express';
import { 
  getAssignedShootings,
  updateShootingStatus
} from '../controllers/employeeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('employee'));

router.get('/shootings', getAssignedShootings);
router.put('/shootings/:id/status', updateShootingStatus);

export default router;