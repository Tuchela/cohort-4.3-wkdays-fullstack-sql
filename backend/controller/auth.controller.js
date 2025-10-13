import { pool } from "../database/connection.js";
import { hashPassword } from "../utils/utilities.js";
import { registerUser } from "../database/queries/sql.js";
// Fulll CRUD Application

/**
 * Register
 */

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const hashedpassword = hashPassword(password);
    const values = [first_name, last_name, email, hashedpassword, role];
    const result = await pool.query(registerUser, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Login
 */

/**
 * ForgotPssword
 */

/**
 * Reset Password
 */

/**
 * Verify otp
 */
