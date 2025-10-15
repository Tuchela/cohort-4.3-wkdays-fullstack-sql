import { pool } from "../database/connection.js";
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "../utils/utilities.js";
import {
  registerUser,
  findEmail,
  findIfEmailExist,
} from "../database/queries/sql.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { hashOTP, verifyOTP } from "../utils/utilities.js";
// Fulll CRUD Application

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
    // find by email
    const { email } = req.body;
    const { rows } = await pool.query(findIfEmailExist, [email]);
    const { id, role, first_name } = rows[0];
    // check if passwprd exist
    const checkIfPasswordMatch = verifyPassword(
      rows[0].password,
      req.body.password
    );

    if (!checkIfPasswordMatch) {
      return res.status(401).json({
        error: "Invalid user credentials, Either email or password incorrect",
      });
    }

    // generate token
    const token = generateToken(
      {
        id,
        role,
      },
      process.env.JWT_SECRET_KEY
    );

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
 * ForgotPssword
 */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await pool.query(findIfEmailExist, [email]);
    if (!rows[0]) {
      return res.status(401).json({
        message: "user does not exist, Kindly register",
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6 digits
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    // Hash the OTP before storing
    const hashedOtp = hashOTP(otp);
    await pool.query(
      "UPDATE users SET otp = $1, otp_expires = $2 WHERE email = $3",
      [hashedOtp, otpExpires, email]
    );

    // Send OTP via email (configure transporter)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
/**
 * Reset Password
 */

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "email, otp and newPassword required" });
    }

    const { rows } = await pool.query(findIfEmailExist, [email]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check expiration
    if (!user.otp || !user.otp_expires || Date.now() > Number(user.otp_expires)) {
      return res.status(400).json({ message: "OTP expired or not set" });
    }

    // Verify hashed OTP
    const isValid = verifyOTP(user.otp, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash new password and update, clear OTP fields
    const hashedpassword = hashPassword(newPassword);
    await pool.query(
      "UPDATE users SET password = $1, otp = NULL, otp_expires = NULL WHERE email = $2",
      [hashedpassword, email]
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Verify otp
 */
