const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;