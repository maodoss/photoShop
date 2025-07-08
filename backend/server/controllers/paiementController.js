// 5. paiementController.js
import Paiement from '../models/Paiement.js';
import Reservation from '../models/Reservation.js';

// @desc    Create new payment
// @route   POST /api/paiements
// @access  Private (Client)
export const createPaiement = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.body.reservation);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if client owns the reservation
    if (reservation.client.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to make payment for this reservation'
      });
    }

    const paiement = await Paiement.create({
      ...req.body,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    res.status(201).json({
      success: true,
      data: paiement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payments for a reservation
// @route   GET /api/paiements/reservation/:reservationId
// @access  Private (Client, Employee, Admin)
export const getReservationPaiements = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const paiements = await Paiement.find({ reservation: req.params.reservationId })
      .populate('reservation', 'nomReservation montant')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: paiements.length,
      data: paiements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/paiements/:id/status
// @access  Private (Admin)
export const updatePaiementStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!statut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      { 
        statut,
        dateTransaction: statut === 'valide' ? new Date() : undefined
      },
      { new: true, runValidators: true }
    );

    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: `Payment not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: paiement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
