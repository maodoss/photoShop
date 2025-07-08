// 2. reservationController.js
import Reservation from '../models/Reservation.js';
import Creneau from '../models/Creneau.js';

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private (Client)
export const createReservation = async (req, res) => {
  try {
    // Add client from user
    req.body.client = req.user.id;

    // Check if time slot is available
    const creneau = await Creneau.findById(req.body.creneau);
    
    if (!creneau) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    if (!creneau.disponible) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is not available'
      });
    }

    // Create reservation
    const reservation = await Reservation.create(req.body);

    // Mark time slot as unavailable
    await Creneau.findByIdAndUpdate(req.body.creneau, { disponible: false });

    // Populate the reservation
    await reservation.populate([
      { path: 'client', select: 'name email' },
      { path: 'creneau', populate: { path: 'photographe', select: 'name email' } }
    ]);

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get client's reservations
// @route   GET /api/reservations
// @access  Private (Client)
export const getClientReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.user.id })
      .populate([
        { path: 'creneau', populate: { path: 'photographe', select: 'name email' } },
        { path: 'shooting' }
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private (Client, Employee assigned, Admin)
export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate([
        { path: 'client', select: 'name email' },
        { path: 'creneau', populate: { path: 'photographe', select: 'name email' } },
        { path: 'shooting' }
      ]);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation not found with id of ${req.params.id}`
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      reservation.client._id.toString() !== req.user.id &&
      reservation.creneau.photographe._id.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this reservation'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private (Employee/Admin)
export const updateReservationStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!statut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation not found with id of ${req.params.id}`
      });
    }

    // Update reservation
    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    ).populate([
      { path: 'client', select: 'name email' },
      { path: 'creneau', populate: { path: 'photographe', select: 'name email' } }
    ]);

    // If cancelled, make time slot available again
    if (statut === 'annulee') {
      await Creneau.findByIdAndUpdate(reservation.creneau._id, { disponible: true });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private (Client)
export const cancelReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation not found with id of ${req.params.id}`
      });
    }

    // Check if client owns the reservation
    if (reservation.client.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }

    // Update reservation status
    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut: 'annulee' },
      { new: true, runValidators: true }
    );

    // Make time slot available again
    await Creneau.findByIdAndUpdate(reservation.creneau, { disponible: true });

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};