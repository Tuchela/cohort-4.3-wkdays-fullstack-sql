import express from "express";
import { register, login, forgotPassword } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register-user", register);
router.post("/login-user", login);
router.post("/forgot-password", forgotPassword);

export default router;
