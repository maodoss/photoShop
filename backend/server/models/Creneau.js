import mongoose from 'mongoose';

const CreneauSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please add a date for the time slot']
  },
  heureDebut: {
    type: String,
    required: [true, 'Please add a start time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time format (HH:MM)']
  },
  heureFin: {
    type: String,
    required: [true, 'Please add an end time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time format (HH:MM)']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  photographe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prix: {
    type: Number,
    required: [true, 'Please add a price for this time slot']
  },
  typeService: {
    type: String,
    enum: ['wedding', 'portrait', 'event', 'commercial', 'other'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour éviter les créneaux en double
CreneauSchema.index({ date: 1, heureDebut: 1, photographe: 1 }, { unique: true });

export default mongoose.model('Creneau', CreneauSchema);