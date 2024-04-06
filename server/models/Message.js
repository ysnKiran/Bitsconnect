const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipient_name: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
