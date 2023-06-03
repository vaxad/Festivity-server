import express from "express";
import {
  addPost,
  forgetPassword,
  getMyProfile,
  logout,
  register,
  removePost,
  resetPassword,
  updatePassword,
  updateProfile,
  getPost,
  getAllPosts,
  getUser,
} from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);

//router.route("/verify").post(isAuthenticated, verify);

// router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/newpost").post(isAuthenticated, addPost);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/getpost").get(isAuthenticated, getPost)
router.route("/getallpost").get(isAuthenticated, getAllPosts)

router
  .route("/user/:userId")
  .get(isAuthenticated, getUser);

router
  .route("/post/:postId")
  .delete(isAuthenticated, removePost);

// router.route("/updateprofile").put(isAuthenticated, updateProfile);
// router.route("/updatepassword").put(isAuthenticated, updatePassword);

// router.route("/forgetpassword").post(forgetPassword);
// router.route("/resetpassword").put(resetPassword);

export default router;
