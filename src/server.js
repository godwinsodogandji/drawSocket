import { createServer } from "http";
import express from 'express';
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {Server} from 'socket.io';

const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { join } = require('path');

const port = 3000;
const app = express();
const serverHttp = createServer(app)
const io = new Server(serverHttp) //server de websocket
//chemin du fichier serveur en cours d'execution
const __fileName = fileURLToPath(import.meta.url);
//dossier parent du fichier server
const __dirname = dirname(__fileName);
//Middlwares
app.use(express.static(join(__dirname, "../dist")));

//Ecoute de l'évenement connection
io.on('connection', (socket) => {
    console.log("Nouvelle connexion", socket.id);

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', {
            data
        })
    })
} )

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, "../dist", "index.html"));
})
serverHttp.listen(port, () => {
    console.log(`Le serveur tourne sur le port ${port}`)
})
