const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


//When user connects
io.on('connection', (socket) => {
    // We show in the console that user connected
    console.log('a user connected');

    // When the connected user disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    //When we receive 'chat message' event
    socket.on('chat message', (msg, userName) => {
        io.emit('chat message', msg, userName);
    })


  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});