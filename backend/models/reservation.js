const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  IdReservation: { type: Number, required: true, unique: true },
  NomReservation: { type: String, required: true },
  Date: { type: Date, required: true },
  Lieu: { type: String, required: true },
  TypeService: { type: String, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);