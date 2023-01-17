// index.js
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv/config');
const http = require("http");
const {
    Server
} = require("socket.io");
const socketIO = require('./lib/socket.js');

const app = new express();
app.use(cors());
app.use(bodyParser.json());

// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//     allowEIO3: true,
//     cors: {
//         origin: true,
//         credentials: true
//     }
// });

// socketIO(io);

// Import Routes
const roomsRoute = require('./routes/roomsRoute.js');
// const authRoute = require('./routes/authRoute.js');

// Routes
app.use('/rooms', roomsRoute);
// app.use('/auth', authRoute);
app.get('/', (req, res) => {
    res.send('Selamat Datang');
});

// Koneksi DB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Koneksi Berhasil');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port http://localhost:3000')
});