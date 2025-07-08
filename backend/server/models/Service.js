import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  prix: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duree: {
    type: Number, // en minutes
    required: [true, 'Please add duration in minutes']
  },
  type: {
    type: String,
    enum: ['wedding', 'portrait', 'event', 'commercial', 'other'],
    required: true
  },
  photosIncluded: {
    type: Number,
    required: [true, 'Please specify number of photos included']
  },
  options: [{
    nom: String,
    prix: Number,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Service', ServiceSchema);