const express = require('express');
const router = express.Router();
const creneauController = require('../controllers/creneauController');

router.get('/', creneauController.getAllCreneaux);
router.get('/disponibles', creneauController.getCreneauxDisponibles);
router.post('/', creneauController.createCreneau);
router.put('/:id', creneauController.updateCreneau);
router.delete('/:id', creneauController.deleteCreneau);

module.exports = router;