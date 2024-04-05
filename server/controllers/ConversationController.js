const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const admin = require("firebase-admin");

exports.getUserConversations = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const user_id = user._id;

    const conversations = await Conversation.find({
      participants: user_id,
    });

    const participantConversations = conversations.map((conversation) => {
      // Find the ID of the other participant
      const otherParticipantId = conversation.participants.find(
        (participantId) => {
          return participantId.toString() !== user_id.toString();
        }
      );

      return {
        conversationId: conversation._id,
        otherParticipantId,
      };
    });

    const promises = participantConversations.map((conversation) => {
      return User.findById(conversation.otherParticipantId, "name")
        .then((user) => {
          if (user) {
            return {
              convoId: conversation.conversationId,
              otherParticipantId: conversation.otherParticipantId,
              otherName: user.name,
              myId: user_id,
            };
          } else {
            // If user not found, return null
            return null;
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          return null;
        });
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Filter out null values (users not found)
    const filteredResults = results.filter((result) => result !== null);

    res.status(200).json(filteredResults);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const { conversation_id } = req.params;

    // Find all messages in the conversation
    const messages = await Message.find({
      conversation: conversation_id,
    }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { sender, content, conversation_id } = req.body;

    // Find the conversation
    const conversation = await Conversation.findById(conversation_id);
    console.log("Convo:", conversation);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Determine the recipient ID
    const recipient = conversation.participants.find((participant) => {
      return participant.toString() !== sender.toString();
    });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Create a new message
    const newMessage = new Message({
      sender,
      recipient,
      content,
      conversation: conversation_id,
    });

    // Save the new message
    await newMessage.save();

    // Retrieve all messages in the conversation after adding the new message
    const messages = await Message.find({
      conversation: conversation_id,
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
