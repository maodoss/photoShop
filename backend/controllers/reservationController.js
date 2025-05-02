const Reservation = require('../models/reservation');
const Creneau = require('../models/creneau');

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  try {
    // Vérifier si le créneau existe et est disponible
    const creneau = await Creneau.findOne({ 
      IdCreneau: req.body.IdCreneau,
      disponibilite: true
    });
    
    if (!creneau) {
      return res.status(400).json({ message: 'Ce créneau n\'est pas disponible ou n\'existe pas' });
    }
    
    // Créer la réservation
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();
    
    // Mettre à jour le statut du créneau
    creneau.disponibilite = false;
    await creneau.save();
    
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer une réservation par son ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ IdReservation: req.params.id });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Annuler une réservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ IdReservation: req.params.id });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Rendre le créneau à nouveau disponible
    const creneau = await Creneau.findOne({ IdCreneau: reservation.IdCreneau });
    if (creneau) {
      creneau.disponibilite = true;
      await creneau.save();
    }

    // Supprimer la réservation
    await Reservation.findOneAndDelete({ IdReservation: req.params.id });
    
    res.status(200).json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};