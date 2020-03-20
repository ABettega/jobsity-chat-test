const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.of('/').on('connection', (socket) => {
  socket.emit('messageToClients', { text: 'Welcome to the chat server!' });

  socket.on('newMessageToServer', ({ text }) => {
    io.emit('messageToClients', { text });
  });
});
