// import express from 'express';
// import { createServer } from 'node:http';
// import { Server } from 'socket.io';
// import { cors } from 'cors';

const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { join } = require('path');

const port = 3000;
const app = express();
const server = createServer(app);

app.use(cors);
app.use(express.static(join(__dirname, '../dist')));


const io = require('socket.io')(4000,{
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.emit('hello', 'Hello from server');
  console.log('a user connected', socket.connected);
  console.log("Socket Id :", socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.connected);
  });

  socket.on('draw', (data) => {
    log(data);
    socket.broadcast.emit('draw', data);
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
  res.send('<h1>Hello  Socket io 🙌🙌</h1>');

});

server.listen(port, () => {
  console.log('Le serveur écoute tranquillement sur  http://localhost:3000');
});