const Creneau = require('../models/creneau');

// Récupérer tous les créneaux
exports.getAllCreneaux = async (req, res) => {
  try {
    const creneaux = await Creneau.find();
    res.status(200).json(creneaux);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer uniquement les créneaux disponibles
exports.getCreneauxDisponibles = async (req, res) => {
  try {
    const creneauxDisponibles = await Creneau.find({ disponibilite: true });
    res.status(200).json(creneauxDisponibles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau créneau
exports.createCreneau = async (req, res) => {
  try {
    const newCreneau = new Creneau(req.body);
    const savedCreneau = await newCreneau.save();
    res.status(201).json(savedCreneau);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un créneau
exports.updateCreneau = async (req, res) => {
  try {
    const updatedCreneau = await Creneau.findOneAndUpdate(
      { IdCreneau: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedCreneau) {
      return res.status(404).json({ message: 'Créneau non trouvé' });
    }
    res.status(200).json(updatedCreneau);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un créneau
exports.deleteCreneau = async (req, res) => {
  try {
    const deletedCreneau = await Creneau.findOneAndDelete({ IdCreneau: req.params.id });
    if (!deletedCreneau) {
      return res.status(404).json({ message: 'Créneau non trouvé' });
    }
    res.status(200).json({ message: 'Créneau supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};