import express from 'express';
import { 
  createPaiement,
  getReservationPaiements,
  updatePaiementStatus
} from '../controllers/paiementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Client can create payment
router.post('/', authorize('client'), createPaiement);

// Get payments for a reservation
router.get('/reservation/:reservationId', getReservationPaiements);

// Admin can update payment status
router.put('/:id/status', authorize('admin'), updatePaiementStatus);

export default router;
