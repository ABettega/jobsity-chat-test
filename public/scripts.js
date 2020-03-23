const socket = io('http://localhost:3000/');

const username = document.querySelector('#username').value;

document.querySelector('#msg-window').addEventListener('submit', (event) => {
  event.preventDefault();
  const msgField = document.querySelector('#usr-msg');
  socket.emit('newMessageToServer', { text: msgField.value, user: username, initial: true });
  msgField.value = '';
  msgField.focus();
})

socket.on('messageToClients', ({ text, initial, user }) => {
  if (initial) {
    document.querySelector('#chat-log').innerHTML += `<li class="initial-message">${text}</li>`;
  } else {
    document.querySelector('#chat-log').innerHTML += `<li><span class="user-msg">${user}</span>: ${text}</li>`;
  }
})
