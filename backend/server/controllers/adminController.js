//adminController.js

import User from '../models/User.js';
import Shooting from '../models/Shooting.js';

// @desc    Create employee account
// @route   POST /api/admin/employees
// @access  Private (Admin)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (role !== 'employee' && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Role must be either employee or admin'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create employee
    const employee = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private (Admin)
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $in: ['employee', 'admin'] } })
      .select('-password');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all shooting requests
// @route   GET /api/admin/shootings
// @access  Private (Admin)
export const getAllShootings = async (req, res) => {
  try {
    const shootings = await Shooting.find()
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

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

// @desc    Assign shooting to employee
// @route   PUT /api/admin/shootings/:id/assign
// @access  Private (Admin)
export const assignShooting = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employee ID'
      });
    }

    // Check if employee exists and is an employee
    const employee = await User.findById(employeeId);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update shooting
    const shooting = await Shooting.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: employeeId,
        status: 'confirmed'
      },
      { new: true, runValidators: true }
    ).populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
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

// @desc    Update shooting status
// @route   PUT /api/admin/shootings/:id/status
// @access  Private (Admin)
export const updateShootingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    // Validate status
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, confirmed, completed, or cancelled'
      });
    }

    // Update shooting
    const shooting = await Shooting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: `Shooting not found with id of ${req.params.id}`
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