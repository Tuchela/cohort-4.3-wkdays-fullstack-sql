import { pool } from "../connection.js";

const usersTable = `
      DROP TABLE IF EXISTS users CASCADE;
       CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(250) NOT NULL,
        role VARCHAR(100) DEFAULT 'user',
        otp VARCHAR(225),
        otp_expires BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

async function createUserTable() {
  try {
    const create = await pool.query(usersTable);
    console.log(
      `users table ${create[0].command}PED and ${create[1].command}D`
    );
    console.log("User table created successfully");
  } catch (error) {
    console.error("User migration failed", error);
  }
}
export default createUserTable;
// createUserTable();
