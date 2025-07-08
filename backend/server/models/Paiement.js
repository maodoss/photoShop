import mongoose from 'mongoose';

const PaiementSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  montant: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  devise: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },
  methodePaiement: {
    type: String,
    enum: ['carte_credit', 'virement', 'especes', 'cheque', 'paypal'],
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'valide', 'echec', 'rembourse'],
    default: 'en_attente'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  stripePaymentId: {
    type: String,
    sparse: true
  },
  dateTransaction: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Paiement', PaiementSchema);