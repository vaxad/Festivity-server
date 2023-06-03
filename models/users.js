import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  avatar: {
    public_id: String,
    url: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  //post:{type:mongoose.Schema.Types.ObjectId, ref:"Post"},

  preference: {
    type: String,
    default: "ALL",
  },
});

const postSchema = new mongoose.Schema({
  creator:"String",
  title:{
    type:"String",
    required: true
  },
    description:{
      type:"String",
      required: true
    },
    venue:{
      type:"String"
    },
    date:{
      type:Date
    },
    likes:{
      type:Number,
      default:0
    },
    createdAt: { type: Date, default: Date.now }
})

const reviewSchema = new mongoose.Schema({
  about:{
    type:"String"
  },
  by:{
    type:"String"
  },
    stars:{
      type:Number,
      required:true,
      default:0
    },
    description:{
      type:"String",
      required: true
    },
    likes:{
      type:Number,
      default:0
    },
    createdAt: { type: Date, default: Date.now }
})

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
export const Review = mongoose.model("Review", reviewSchema);
