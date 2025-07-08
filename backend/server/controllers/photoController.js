// 3. photoController.js
import Photo from '../models/Photo.js';
import Shooting from '../models/Shooting.js';
import multer from 'multer';
import path from 'path';

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @desc    Upload photos for a shooting
// @route   POST /api/photos/upload/:shootingId
// @access  Private (Employee/Admin)
export const uploadPhotos = async (req, res) => {
  try {
    const shooting = await Shooting.findById(req.params.shootingId);

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: 'Shooting not found'
      });
    }

    // Check if user is authorized to upload photos
    if (req.user.role !== 'admin' && shooting.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to upload photos for this shooting'
      });
    }

    const photos = [];

    // Process each uploaded file
    for (const file of req.files) {
      const photoData = {
        shooting: req.params.shootingId,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.user.id,
        dimensions: {
          width: 0, // You might want to use a library like sharp to get actual dimensions
          height: 0
        }
      };

      const photo = await Photo.create(photoData);
      photos.push(photo);
    }

    res.status(201).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get photos for a shooting
// @route   GET /api/photos/shooting/:shootingId
// @access  Private (Client, Employee assigned, Admin)
export const getShootingPhotos = async (req, res) => {
  try {
    const shooting = await Shooting.findById(req.params.shootingId);

    if (!shooting) {
      return res.status(404).json({
        success: false,
        message: 'Shooting not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      shooting.client.toString() !== req.user.id &&
      (!shooting.assignedTo || shooting.assignedTo.toString() !== req.user.id)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these photos'
      });
    }

    const photos = await Photo.find({ shooting: req.params.shootingId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark photos as delivered
// @route   PUT /api/photos/:id/deliver
// @access  Private (Employee/Admin)
export const markPhotoAsDelivered = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Get shooting to check authorization
    const shooting = await Shooting.findById(photo.shooting);
    
    if (req.user.role !== 'admin' && shooting.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to mark this photo as delivered'
      });
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(
      req.params.id,
      { isDelivered: true, deliveredAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedPhoto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private (Admin)
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    await photo.deleteOne();

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

// Export multer upload middleware
export const uploadMiddleware = upload.array('photos', 10);

// 4. serviceController.js
import Service from '../models/Service.js';

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const services = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id of ${req.params.id}`
      });
    }

    await service.deleteOne();

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