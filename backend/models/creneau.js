const mongoose = require('mongoose');

const creneauSchema = new mongoose.Schema({
  IdCreneau: { type: Number, required: true, unique: true },
  Date: { type: Date, required: true }
});

module.exports = mongoose.model('Creneau', creneauSchema);