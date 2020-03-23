const Messages = require('../models/Messages');

const getMessages = () => {
  return Messages.find().limit(10).sort({ 'created_at' : -1 });
}

const addMessage = (username, text, timestamp) => {
  const newMessage = new Messages({ username, text, timestamp });
  newMessage.save();
}

module.exports = { getMessages, addMessage };