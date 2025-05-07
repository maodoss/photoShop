import express from 'express';
import { 
  createEmployee,
  getEmployees,
  getAllShootings,
  assignShooting,
  updateShootingStatus
} from '../controllers/adminController.js';
import { deleteShooting } from '../controllers/shootingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Employee routes
router.route('/employees')
  .post(createEmployee)
  .get(getEmployees);

// Shooting routes
router.get('/shootings', getAllShootings);
router.put('/shootings/:id/assign', assignShooting);
router.put('/shootings/:id/status', updateShootingStatus);
router.delete('/shootings/:id', deleteShooting);

export default router;