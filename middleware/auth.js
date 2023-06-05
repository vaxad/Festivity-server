import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    var { token } = req.cookies;
    if(!token){
      token=req.header('token');
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Login First" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
