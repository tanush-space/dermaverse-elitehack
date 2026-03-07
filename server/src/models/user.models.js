const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required for creating a User"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address", // Custom error message if the regex fails
      ], //this is email regex
      required: [true, "Email is required for creating a User"],
      unique: [true, "Email already exists, please try with another email"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating a User"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, //this will prevent the password from being returned in any query by default
    },
    skinType: {
      type: String,
      enum: ["Balanced", "Dry", "Oily", "Combination", "Sensitive"],
    },

    primaryConcerns: {
      type: [String],
      default: [],
    },

    sunExposure: {
      type: String,
      enum: ["Minimal", "Moderate", "High"],
    },

    pollutionExposure: {
      type: String,
      enum: ["Low", "High"],
    },

    dietPattern: {
      type: String,
    },

    rawPhoto: {
      type: String, // store image URL (Cloudinary or local path)
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function(){
  if(!this.isModified("password")){
    return;
  }
  //hashing the password before saving the user document to the database
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
})

userSchema.methods.comparedPassword=async function(password){
  return await bcrypt.compare(password,this.password);
}





const User=mongoose.model("User", userSchema);

module.exports=User;

