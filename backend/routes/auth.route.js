import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  getSingleUser,
  deleteUser,
  getAllUsers
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register-user", register);
router.post("/login-user", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);
router.put("/:id", updateUser);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);

export default router;
