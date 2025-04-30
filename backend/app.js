const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


const app = express();

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

