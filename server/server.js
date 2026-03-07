require("dotenv").config()
const app=require('./src/app');
const connectDB=require('./src/config/db');

//connect to database
connectDB();

app.listen(5000,()=>{
    console.log('Server is running on port 5000 🥳');
})