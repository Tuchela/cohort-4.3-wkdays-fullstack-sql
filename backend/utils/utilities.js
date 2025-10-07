import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;
const salt = process.env.SALT;

/**
 * @function generateToken
 * @param 
 */