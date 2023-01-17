// index.js
import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import 'dotenv/config';
import https from "https";
import {
    Server
} from "socket.io";
import socketIO from './lib/socket.js';

const app = new express();
app.use(cors());
app.use(bodyParser.json());

const httpsServer = https.createServer(app);
const io = new Server(httpsServer, {
    allowEIO3: true,
    cors: {
        origin: true,
        credentials: true
    }
});

socketIO(io);

// Import Routes
import roomsRoute from './routes/roomsRoute.js';
import authRoute from './routes/authRoute.js';

// Routes
app.use('/rooms', roomsRoute);
app.use('/auth', authRoute);
app.get('/', (req, res) => {
    res.send('Selamat Datang');
});

// Koneksi DB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Koneksi Berhasil');
});

httpsServer.listen(3000, () => {
    console.log('Express server listening on port https://localhost:3000')
});