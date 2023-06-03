import { User, Post, Review } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const register = async (req, res) => {
  try {
    const { name, phone } = req.body;

    //const avatar = req.files.avatar.tempFilePath;

    let user = await User.findOne({ phone });

    if (user) {
      sendToken(res, user, 200, "Login Successful");
    }else{

    //const otp = Math.floor(Math.random() * 1000000);

    //const mycloud = await cloudinary.v2.uploader.upload(avatar);

    //fs.rmSync("./tmp", { recursive: true });

    user = await User.create({
      name,
      phone,
      // avatar: {
      //   public_id: mycloud.public_id,
      //   url: mycloud.secure_url,
      // },
      // otp,
      // otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    //await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

    sendToken(
      res,
      user,
      201,
      //"OTP sent to your email, please verify your account"
    );
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const verify = async (req, res) => {
//   try {
//     const otp = Number(req.body.otp);

//     const user = await User.findById(req.user._id);

//     if (user.otp !== otp || user.otp_expiry < Date.now()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP or has been Expired" });
//     }

//     user.verified = true;
//     user.otp = null;
//     user.otp_expiry = null;

//     await user.save();

//     sendToken(res, user, 200, "Account Verified");
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please enter all fields" });
//     }

//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Email or Password" });
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid Email or Password" });
//     }

//     sendToken(res, user, 200, "Login Successful");
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPost = async (req, res) => {
  try {
    const { title, description, venue, date } = req.body;

    const user = await User.findById(req.user._id);
    const creator=user._id;
    
    const post = await Post.create(
      {
        creator,
        title,
        description,
        venue,
        date,
        createdAt: new Date(Date.now()),
      }
    )

    res.status(200).json({ success: true, message: "Post added successfully", post:post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    //const user = await User.findById(req.user._id);
     Post.findByIdAndDelete(postId)
    res
      .status(200)
      .json({ success: true, message: "Post removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const post=await Post.find({creator:req.user._id})

    res
      .status(200)
      .json({ success: true, post:post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllPosts = async (req, res) => {
  try {

    const posts=await Post.find();

    res
      .status(200)
      .json({ success: true, posts:posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    sendToken(res, user, 201);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const postReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { stars, description } = req.body;

    const user = await User.findById(req.user._id);
    const creator=user._id;
    
    const review = await Review.create(
      {
        by:creator,
        about:userId,
        stars:stars,
        description:description,
        createdAt: new Date(Date.now()),
      }
    )

    res.status(200).json({ success: true, message: "Review added successfully", review:review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { preference } = req.body;

    if (preference) user.preference = preference;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Profile Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Old Password" });
    }

    user.password = newPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;

    await sendMail(email, "Request for Reseting Password", message);

    res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
