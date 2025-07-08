import express from 'express';
import { 
  createCreneau,
  getAvailableCreneaux,
  getPhotographerCreneaux,
  updateCreneau,
  deleteCreneau
} from '../controllers/creneauController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/available', getAvailableCreneaux);

// Protected routes
router.use(protect);

// Routes for employees and admins
router.post('/', authorize('employee', 'admin'), createCreneau);
router.get('/photographer', authorize('employee'), getPhotographerCreneaux);
router.route('/:id')
  .put(authorize('employee', 'admin'), updateCreneau)
  .delete(authorize('employee', 'admin'), deleteCreneau);

export default router;
