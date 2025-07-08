import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['reservation', 'paiement', 'photo', 'annulation', 'rappel', 'system'],
    required: true
  },
  titre: {
    type: String,
    required: [true, 'Please add a title']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  lue: {
    type: Boolean,
    default: false
  },
  lienAction: {
    type: String // URL vers l'action à effectuer
  },
  donneesMeta: {
    type: mongoose.Schema.Types.Mixed // Données supplémentaires selon le type
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Notification', NotificationSchema);