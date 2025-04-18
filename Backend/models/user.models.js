import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { validate } from "node-cron";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Name must contain atleast 3 charater"],
      maxLength: [30, "Name can't exceed 30 charater"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please Provide valid email."],
    },
    phone: {
      type: Number,
      required: true,
      minLength: [10, "Number should be of length 10"],
      maxLength: [10, "Number should be of length 10"],
    },
    address: {
      type: String,
      required: true,
    },
    niches: {
      firstNiche: String,
      secondNiche: String,
      thirdNiche: String,
    }, //which domain dev Ai etc.
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must contain atleast 8 charater"],
      select:false,
    },
    resume: {
      public_id: String,
      url:String,
    },
    coverLetter: {
      type:String,
    },
    role: {
      type: String,
      required: true,
      enum:["Job Seeker","Employer"]
    },
  },
  { timestamps: true }
);

//hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}
/*
  🔍 What's happening here?
userSchema.methods
This is how you define instance methods in Mongoose. These methods are available on individual documents (i.e., specific users).

isPasswordCorrect
The name of the method you're adding. This will be used to check if a plain-text password matches the hashed one stored in the database.

async function (password)
An async function that takes the plain password as input.

bcrypt.compare(password, this.password)

password: the plain text password (user input).

this.password: the hashed password stored in the user document.

bcrypt.compare() returns true if they match, otherwise false.
*/

userSchema.methods.generateAccessToken = function () {
  console.log("Generating Token for :", this._id);

  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  );

  console.log("Generated Access Token:", token);
  return token;
}

// userSchema.methods.generateRefreshToken = function () {
//   console.log("Generating Token for :", this._id);

//   const token = jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );

//   console.log("Generated Refresn Token:", token);
//   return token;
// };
export const User=mongoose.model("User",userSchema)

