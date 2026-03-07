const express = require("express");
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/multer.middleware.js");

const router = express.Router();

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

//POST /api/auth/logout [PROTECTED]
router.post(
  "/logout",
  authMiddleware.authUserMiddleware,
  authController.logout,
);

// GET /api/auth/onboarding-status [PROTECTED]
router.get(
  "/onboarding-status",
  authMiddleware.authUserMiddleware,
  authController.getOnboardingStatus,
);

// POST /api/auth/complete-onboarding [PROTECTED]
router.post(
  "/complete-onboarding",
  authMiddleware.authUserMiddleware,
  upload.single('rawPhoto'), // Handle single file upload with field name 'rawPhoto'
  authController.completeOnboarding,
);

// GET /api/auth/me [PROTECTED] - Get current user profile
router.get(
  "/me",
  authMiddleware.authUserMiddleware,
  authController.getCurrentUser,
);

module.exports = router;
