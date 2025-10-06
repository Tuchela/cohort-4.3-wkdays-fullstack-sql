import { pool } from "../connection.js";

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        role VARCHAR(100) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    console.log("Users table created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("User migration failed", error);
    process.exit(1);
  }
}
createUsersTable();
