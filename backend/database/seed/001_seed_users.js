import { pool } from "../connection.js";
import { hashPassword } from "../../utils/utilities.js";

const passkey = process.env.PASSWORD;
const salt = process.env.SALT;
const hashedPassword = hashPassword(passkey, salt);

async function seedUserData() {
  try {
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES 
        ('Mubarak', 'Ismail', 'mubarak_12@email.com', '${hashedPassword}', 'admin'),
        ('Maruf', 'Alimi', 'alimi_12@email.com', '${hashedPassword}', 'superadmin'),
        ('David', 'Ugochukwu', 'david_12@email.com', '${hashedPassword}', 'user'),
        ('Thomas', 'Tuchela', 'thomas_12@email.com', '${hashedPassword}', 'employee')
      `);
    console.log("User data seeded successfully");
  } catch (error) {
    console.error("Unable to seed User data", error);
  }
}
export default seedUserData;
