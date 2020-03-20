const socket = io('http://localhost:3000/');

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const msgField = document.querySelector('#usr-msg');
  socket.emit('newMessageToServer', { text: msgField.value, initial: true });
  msgField.value = '';
  msgField.focus();
})

socket.on('messageToClients', ({ text, initial }) => {
  if (initial) {
    document.querySelector('#chat-log').innerHTML += `<li class="initial-message">${text}</li>`;
  } else {
    document.querySelector('#chat-log').innerHTML += `<li>${text}</li>`;
  }
})
