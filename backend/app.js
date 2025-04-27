const http = require('http');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Test du serveur' });
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
