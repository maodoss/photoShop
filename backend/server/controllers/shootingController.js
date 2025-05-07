import Shooting from '../models/Shooting.js';

// @desc    Create new shooting request
// @route   POST /api/shootings
// @access  Private (Client)
export const createShooting = async (req, res) => {
  try {
    // Add client from user
    req.body.client = req.user.id;

    const shooting = await Shooting.create(req.body);

    res.status(201).json({
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

// @desc    Get client's shootings
// @route   GET /api/shootings
// @access  Private (Client)
export const getClientShootings = async (req, res) => {
  try {
    const shootings = await Shooting.find({ client: req.user.id });

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

// @desc    Get single shooting
// @route   GET /api/shootings/:id
// @access  Private (Client, Employee assigned, Admin)
export const getShooting = async (req, res) => {
  try {
    const shooting = await Shooting.findById(req.params.id)
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
      });
    }

    // Make sure client owns the shooting or is admin or is the assigned employee
    if (
      req.user.role !== 'admin' &&
      shooting.client._id.toString() !== req.user.id &&
      (!shooting.assignedTo || shooting.assignedTo._id.toString() !== req.user.id)
    ) {
      return res.status(401).json({
        success: false,
        message: `Not authorized to access this shooting`
      });
    }

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

// @desc    Update shooting
// @route   PUT /api/shootings/:id
// @access  Private (Client - owner, Admin)
export const updateShooting = async (req, res) => {
  try {
    let shooting = await Shooting.findById(req.params.id);

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
      });
    }

    // Make sure client owns the shooting or is admin
    if (
      req.user.role !== 'admin' &&
      shooting.client.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: `Not authorized to update this shooting`
      });
    }

    // Only let client update certain fields
    if (req.user.role === 'client') {
      const { date, time, location, photosCount, type, description } = req.body;
      const updateFields = { date, time, location, photosCount, type, description };
      
      // Filter out undefined fields
      const filteredUpdateFields = Object.fromEntries(
        Object.entries(updateFields).filter(([key, value]) => value !== undefined)
      );
      
      shooting = await Shooting.findByIdAndUpdate(
        req.params.id,
        filteredUpdateFields,
        { new: true, runValidators: true }
      );
    } else {
      // Admin can update all fields
      shooting = await Shooting.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    }

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

// @desc    Delete shooting
// @route   DELETE /api/shootings/:id
// @access  Private (Admin)
export const deleteShooting = async (req, res) => {
  try {
    const shooting = await Shooting.findById(req.params.id);

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
      });
    }

    await shooting.deleteOne();

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