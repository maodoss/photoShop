import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  shooting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shooting',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'Please add a file name']
  },
  originalName: {
    type: String,
    required: [true, 'Please add the original file name']
  },
  filePath: {
    type: String,
    required: [true, 'Please add a file path']
  },
  fileSize: {
    type: Number,
    required: [true, 'Please add file size']
  },
  mimeType: {
    type: String,
    required: [true, 'Please add mime type']
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  thumbnailPath: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Photo', PhotoSchema);