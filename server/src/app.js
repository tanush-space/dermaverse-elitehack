//create instance of server and config the server
const express=require('express');
const cookieParser=require("cookie-parser")
const cors = require('cors');
const path = require('path');

const app=express();

// CORS configuration for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Your frontend URL
  credentials: true
}));

app.use(express.json())

app.use(cookieParser()) //this will parse the cookies from the incoming request and make them available in req.cookies

//importing routes
const authRoutes=require('./routes/auth.routes');
const chatRoutes=require('./routes/chat.routes');

//using routes
app.use("/api/auth",authRoutes)
app.use("/api/chat",chatRoutes)

module.exports=app
