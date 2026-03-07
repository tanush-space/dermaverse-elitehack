const express = require("express");
const chatController = require("../controllers/chat.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const { uploadMemory } = require("../middleware/multer.middleware.js");

const router = express.Router();

// POST /api/chat/analyze [PROTECTED] - Analyze skin image (direct to Gemini, no disk)
router.post(
  "/analyze",
  authMiddleware.authUserMiddleware,
  uploadMemory.single('image'),
  chatController.analyzeSkinPhoto
);

// POST /api/chat/message [PROTECTED] - Chat with AI (with optional image)
router.post(
  "/message",
  authMiddleware.authUserMiddleware,
  uploadMemory.single('image'),
  chatController.chatWithAI
);

module.exports = router;
