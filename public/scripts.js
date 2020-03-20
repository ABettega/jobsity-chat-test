const socket = io('http://localhost:9000');

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const msgField = document.querySelector('#usr-msg');
  socket.emit('newMessageToServer', { text: msgField.value });
  msgField.value = '';
  msgField.focus();
})

socket.on('messageToClients', ({ text }) => {
  document.querySelector('#chat-log').innerHTML += `<li>${text}</li>`;
})
