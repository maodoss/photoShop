// 1. creneauController.js
import Creneau from '../models/Creneau.js';

// @desc    Create a new time slot
// @route   POST /api/creneaux
// @access  Private (Employee/Admin)
export const createCreneau = async (req, res) => {
  try {
    // Add photographer from user if employee
    if (req.user.role === 'employee') {
      req.body.photographe = req.user.id;
    }

    const creneau = await Creneau.create(req.body);

    res.status(201).json({
      success: true,
      data: creneau
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Time slot already exists for this date and time'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/creneaux/available
// @access  Public
export const getAvailableCreneaux = async (req, res) => {
  try {
    const { date, typeService } = req.query;
    
    let query = { disponible: true };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (typeService) {
      query.typeService = typeService;
    }

    const creneaux = await Creneau.find(query)
      .populate('photographe', 'name email')
      .sort({ date: 1, heureDebut: 1 });

    res.status(200).json({
      success: true,
      count: creneaux.length,
      data: creneaux
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get photographer's time slots
// @route   GET /api/creneaux/photographer
// @access  Private (Employee)
export const getPhotographerCreneaux = async (req, res) => {
  try {
    const creneaux = await Creneau.find({ photographe: req.user.id })
      .sort({ date: 1, heureDebut: 1 });

    res.status(200).json({
      success: true,
      count: creneaux.length,
      data: creneaux
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update time slot
// @route   PUT /api/creneaux/:id
// @access  Private (Owner/Admin)
export const updateCreneau = async (req, res) => {
  try {
    let creneau = await Creneau.findById(req.params.id);

    if (!creneau) {
      return res.status(404).json({
        success: false,
        message: `Time slot not found with id of ${req.params.id}`
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && creneau.photographe.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this time slot'
      });
    }

    creneau = await Creneau.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: creneau
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete time slot
// @route   DELETE /api/creneaux/:id
// @access  Private (Owner/Admin)
export const deleteCreneau = async (req, res) => {
  try {
    const creneau = await Creneau.findById(req.params.id);

    if (!creneau) {
      return res.status(404).json({
        success: false,
        message: `Time slot not found with id of ${req.params.id}`
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && creneau.photographe.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this time slot'
      });
    }

    await creneau.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};