import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Assuming you have a reservationController with these methods
import { 
  createReservation,
  getReservation,
  updateReservationStatus as updateReservation,
  cancelReservation as deleteReservation
} from '../controllers/reservationController.js';

// Protect all routes
router.use(protect);

// Client routes
router.route('/')
  .post(authorize('client'), createReservation)
  .get(getReservation);

router.route('/:id')
  .get(getReservation)
  .put(authorize('client', 'admin'), updateReservation)
  .delete(authorize('client', 'admin'), deleteReservation);

export default router;
