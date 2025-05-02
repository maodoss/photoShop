const mongoose = require('mongoose');

const photographeSchema = new mongoose.Schema({
  IdPhotographe: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numero: { type: String, required: true }
});

module.exports = mongoose.model('Photographe', photographeSchema);