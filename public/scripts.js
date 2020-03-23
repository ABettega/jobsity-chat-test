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
  const chatLog = document.querySelector('#chat-log');
  const date = new Date();
  var hours = `${date.getHours()}`;
  var minutes = `${date.getMinutes()}`;
  var seconds = `${date.getSeconds()}`;
  if (hours.length < 2)
    hours = `0${hours}`;
  if (minutes.length < 2)
    minutes = `0${minutes}`;
  if (seconds.length < 2)
    seconds = `0${seconds}`;
  const time = `${hours}:${minutes}:${seconds}`;
  if (initial) {
    chatLog.innerHTML += `<li class="initial-message message">${text}<span class="time">${time}</span></li>`;
  } else {
    chatLog.innerHTML += `<li class="message"><span><span class="user-msg">${user}</span>: ${text}</span><span class="time">${time}</span></li>`;
  }
  if (chatLog.childElementCount > 49) {
    chatLog.removeChild(chatLog.firstElementChild);
    chatLog.firstElementChild.classList.add('initial-message');
  }
})
