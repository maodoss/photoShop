import mongoose from 'mongoose';

const ShootingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date for the shooting']
  },
  time: {
    type: String,
    required: [true, 'Please add a time for the shooting']
  },
  location: {
    type: String,
    required: [true, 'Please add a location for the shooting']
  },
  photosCount: {
    type: Number,
    required: [true, 'Please specify the number of photos needed']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of shooting'],
    enum: ['wedding', 'portrait', 'event', 'commercial', 'other']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Shooting', ShootingSchema);