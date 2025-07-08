import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creneau: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creneau',
    required: true
  },
  shooting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shooting'
  },
  nomReservation: {
    type: String,
    required: [true, 'Please add a reservation name'],
    trim: true
  },
  lieu: {
    type: String,
    required: [true, 'Please add a location']
  },
  typeService: {
    type: String,
    enum: ['wedding', 'portrait', 'event', 'commercial', 'other'],
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'annulee', 'terminee'],
    default: 'en_attente'
  },
  montant: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
ReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Reservation', ReservationSchema);