const express = require("express");
const router = express.Router();
const ConversationController = require("../controllers/ConversationController");

router.get("/conversations", ConversationController.getUserConversations);
router.get(
  "/conversations/messages/:conversation_id",
  ConversationController.getConversationMessages
);
router.post(
  "/conversations/messages/newMessage",
  ConversationController.postMessage
);

module.exports = router;
