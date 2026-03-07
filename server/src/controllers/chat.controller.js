const { analyzeSkinImage } = require("../services/ai.service.js");
const userModel = require("../models/user.models.js");

async function analyzeSkinPhoto(req, res) {
  try {
    console.log('🎯 Analyze endpoint hit');
    console.log('🎯 User:', req.user ? req.user.email : 'No user');
    console.log('🎯 File received:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

    if (!req.file) {
      return res.status(400).json({
        message: "No image provided",
        status: "failed"
      });
    }

    // Image is now in req.file.buffer (memory, not disk)
    const imageBuffer = req.file.buffer;
    console.log('🎯 Image buffer size:', imageBuffer.length);
    console.log('🎯 Sending to Gemini API...');

    // Call AI service - image goes directly to Gemini from memory
    const analysisResult = await analyzeSkinImage(imageBuffer);
    console.log('🎯 Gemini analysis completed');

    // Fetch user data for context
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed"
      });
    }

    res.status(200).json({
      analysis: analysisResult,
      status: "success",
      userContext: {
        skinType: user.skinType,
        primaryConcerns: user.primaryConcerns,
        sunExposure: user.sunExposure,
        pollutionExposure: user.pollutionExposure,
        dietPattern: user.dietPattern
      }
    });
  } catch (error) {
    console.error("🎯 Analysis error:", error);
    console.error("🎯 Error details:", error.message);
    res.status(500).json({
      message: "Error analyzing image",
      status: "failed",
      error: error.message
    });
  }
}

module.exports = {
  analyzeSkinPhoto
};
