const userModel=require('../models/user.models')
const jwt=require('jsonwebtoken');


async function authUserMiddleware(req,res,next){
  const token=req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  console.log('🔍 Auth middleware - Token from cookies:', req.cookies.token);
  console.log('🔍 Auth middleware - Token from headers:', req.headers.authorization);
  console.log('🔍 Auth middleware - Final token:', token);

  if(!token){
    return res.status(401).json({
      message:"Please login first"
    })
  }
  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log('🔍 Auth middleware - Decoded token:', decoded);

    const user=await userModel.findById(decoded.userId)
    console.log('🔍 Auth middleware - Found user:', user ? user.email : 'No user found');

    if(!user){
      return res.status(401).json({
        message:"User not found"
      })
    }

    req.user=user

    next()
  } catch (error) {
    console.error('🔍 Auth middleware - Token verification error:', error);
    return res.status(401).json({
      message:"Invalid token"
    })
  }
}

module.exports={
  authUserMiddleware
}