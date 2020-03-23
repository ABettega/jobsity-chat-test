const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  username: String,
  text: String,
  timestamp: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
