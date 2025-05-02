const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

// Import des routes
const creneauRoutes = require('./routes/creneauRoute');
const reservationRoutes = require('./routes/reservationRoute');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/creneaux', creneauRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => console.error('Erreur de connexion MongoDB :', err));