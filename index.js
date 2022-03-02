const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('new user', name => {
        users[socket.id] = name;
        io.emit('user connected', name);
    });
    socket.on('chat message', msg => {
        io.emit('chat message', {msg: msg, name: users[socket.id]});
    });
    socket.on('disconnect', () => {
        io.emit('user disconnected', users[socket.id]);
        delete users[socket.id];
    });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});