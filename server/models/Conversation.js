const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
module.exports = ConversationModel;
