import { pool } from "../database/connection.js";
import {
  generateToken,
  hashPassword,
  verifyPassword,
  hashOTP,
  verifyOTP,
} from "../utils/utilities.js";
import {
  registerUser,
  findEmail,
  findIfEmailExist,
  forgetPassword,
  passwordReset,
} from "../database/queries/sql.js";
import brevo from "../config/mailer.js";
import crypto from "crypto";

/**
 * Register
 */
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const hashedpassword = hashPassword(password);
    const values = [first_name, last_name, email, hashedpassword, role];
    const { rows } = await pool.query(findEmail, [email]);
    if (rows[0]) {
      return res.status(401).json({
        message: "user already exist, please login",
      });
    }
    const result = await pool.query(registerUser, values);
    return res.status(201).json({
      status: "Success",
      data: {
        message: `Welcome aboard ${first_name}, your account has been created successfully`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Login
 */
export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await pool.query(findIfEmailExist, [email]);

    if (!rows[0]) {
      return res.status(401).json({
        error: "Invalid user credentials, Either email or password incorrect",
      });
    }

    const { id, role, first_name } = rows[0];

    const checkIfPasswordMatch = verifyPassword(
      rows[0].password,
      req.body.password,
    );

    if (!checkIfPasswordMatch) {
      return res.status(401).json({
        error: "Invalid user credentials, Either email or password incorrect",
      });
    }

    const token = generateToken({ id, role }, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      status: "Success",
      id,
      message: `Welcome back ${first_name}, you have logged in successfully`,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res
        .status(400)
        .json({ message: "A valid email address is required." });
    }

    const { rows } = await pool.query(findEmail, [email]);
    if (!rows[0]) {
      return res.status(404).json({
        message: "Email not registered. Kindly sign up.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const hashedOtp = hashOTP(otp);

    // ✅ Send email BEFORE persisting OTP
    try {
  await brevo.sendTransacEmail({
    sender: { name: "Support Team", email: process.env.BREVO_SENDER_EMAIL },
    to: [{ email }],
    subject: "Password Reset OTP",
    textContent: `Your OTP is ${otp}. It expires in 10 minutes.`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
} catch (mailError) {
  console.error("❌ Brevo error:", mailError.message);
  return res.status(503).json({
    message: "Email service temporarily unavailable. Please try again later.",
  });
}

    // ✅ Only persist OTP after successful delivery
    await pool.query(forgetPassword, [hashedOtp, otpExpires, email]);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ forgotPassword error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again" });
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "email, otp and newPassword required" });
    }

    const { rows } = await pool.query(findIfEmailExist, [email]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.otp ||
      !user.otp_expires ||
      Date.now() > Number(user.otp_expires)
    ) {
      return res.status(400).json({ message: "OTP expired or not set" });
    }

    const isValid = verifyOTP(user.otp, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedpassword = hashPassword(newPassword);
    await pool.query(passwordReset, [hashedpassword, email]);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
