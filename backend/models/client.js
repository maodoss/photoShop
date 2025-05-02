const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  IdClient: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  numero: { type: String, required: true },
  sexe: { type: String, enum: ['Masculin', 'Feminin'], required: true }
});

module.exports = mongoose.model('Client', clientSchema);
