import Shooting from '../models/Shooting.js';

// @desc    Get employee's assigned shootings
// @route   GET /api/employee/shootings
// @access  Private (Employee)
export const getAssignedShootings = async (req, res) => {
  try {
    const shootings = await Shooting.find({ assignedTo: req.user.id })
      .populate('client', 'name email');

    res.status(200).json({
      success: true,
      count: shootings.length,
      data: shootings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shooting status by employee
// @route   PUT /api/employee/shootings/:id/status
// @access  Private (Employee)
export const updateShootingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    // Employee can only mark as completed
    if (status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Employees can only mark shootings as completed'
      });
    }

    // Find shooting
    let shooting = await Shooting.findById(req.params.id);

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
      });
    }

    // Make sure employee is assigned to this shooting
    if (shooting.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `Not authorized to update this shooting`
      });
    }

    // Update shooting
    shooting = await Shooting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    res.status(200).json({
      success: true,
      data: shooting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};