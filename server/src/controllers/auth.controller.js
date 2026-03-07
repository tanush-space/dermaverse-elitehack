const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");


async function register(req, res) {
  console.log('🚀 Registration endpoint hit!', req.body);
  try {
    console.log('Registration request received:', req.body);
    
    const {name,email,password}=req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    const isUserAlreadyExsists=await userModel.findOne({
      email
    })
    
    if(isUserAlreadyExsists){
      return res.status(400).json({
        message:"User Already Exists"
      })
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token);

    console.log('User registered successfully:', user.email);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages.join(', ') || "Validation failed",
        status: "failed"
      });
    }
    
    // Check if it's a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        status: "failed"
      });
    }
    
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      status: "failed"
    });
  }
}

async function login(req, res) {
  const {email,password}=req.body;

  const user=await userModel.findOne({
    email:email
  }).select("+password")

  if(!user){
    return res.status(401).json({
      message: "Invalid email or password",
      status: "failed",
    })
  }
  const isValidPassword = await user.comparedPassword(password);
  if(!isValidPassword){
    return res.status(401).json({
      message: "Invalid email or password",
      status: "failed",
    })
  }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token: token,
  });
}

async function logout(req, res) {
   res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

// Get onboarding status
async function getOnboardingStatus(req, res) {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed"
      });
    }

    res.status(200).json({
      onboardingCompleted: user.onboardingCompleted,
      hasOnboardingData: !!(user.skinType && user.primaryConcerns && user.sunExposure && user.pollutionExposure)
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching onboarding status",
      status: "failed"
    });
  }
}

// Complete onboarding
async function completeOnboarding(req, res) {
  console.log('🎯 Complete onboarding endpoint hit!');
  console.log('🎯 User from middleware:', req.user ? req.user.email : 'No user');
  console.log('🎯 Request body:', req.body);
  console.log('🎯 Request file:', req.file ? JSON.stringify({
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype,
    destination: req.file.destination
  }) : 'No file received');
  
  try {
    const { skinType, primaryConcerns, sunExposure, pollutionExposure, dietPattern } = req.body;
    
    // Check if there was a multer error (file too large, wrong format, etc.)
    if (req.multerError) {
      console.error('🎯 Multer error:', req.multerError);
      return res.status(400).json({
        message: req.multerError.message || "File upload failed",
        status: "failed"
      });
    }
    
    // Get uploaded file path
    const rawPhoto = req.file ? req.file.path : null;
    
    console.log('🎯 Raw photo path:', rawPhoto);

    // Validate required fields
    if (!skinType || !primaryConcerns || !sunExposure || !pollutionExposure) {
      console.log('🎯 Validation failed - Missing fields:', { skinType, primaryConcerns, sunExposure, pollutionExposure });
      return res.status(400).json({
        message: "Missing required onboarding fields",
        status: "failed"
      });
    }

    // Parse primaryConcerns if it's a string (from form data)
    let parsedConcerns = primaryConcerns;
    if (typeof primaryConcerns === 'string') {
      try {
        parsedConcerns = JSON.parse(primaryConcerns);
      } catch (e) {
        parsedConcerns = [primaryConcerns];
      }
    }

    const user = await userModel.findByIdAndUpdate(
      req.user._id, // Use req.user._id from the populated user object
      {
        skinType,
        primaryConcerns: parsedConcerns,
        sunExposure,
        pollutionExposure,
        dietPattern,
        rawPhoto,
        onboardingCompleted: true
      },
      { new: true }
    );

    if (!user) {
      console.log('🎯 User not found for ID:', req.user._id);
      return res.status(404).json({
        message: "User not found",
        status: "failed"
      });
    }

    console.log('🎯 Onboarding completed for user:', user.email);
    console.log('🎯 User rawPhoto in DB:', user.rawPhoto);

    res.status(200).json({
      message: "Onboarding completed successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted,
        rawPhoto: user.rawPhoto
      }
    });
  } catch (error) {
    console.error("🎯 Onboarding error:", error.message);
    console.error("🎯 Error stack:", error.stack);
    res.status(500).json({
      message: "Error completing onboarding",
      status: "failed",
      error: error.message
    });
  }
}

// Get current user profile
async function getCurrentUser(req, res) {
  try {
    // req.user is already populated by auth middleware
    const user = req.user;
    
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        skinType: user.skinType,
        primaryConcerns: user.primaryConcerns,
        sunExposure: user.sunExposure,
        pollutionExposure: user.pollutionExposure,
        dietPattern: user.dietPattern,
        rawPhoto: user.rawPhoto,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: "Error fetching user profile",
      status: "failed"
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getOnboardingStatus,
  completeOnboarding,
  getCurrentUser,
};
