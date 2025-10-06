import { pool } from "../connection.js";

async function createPostsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        post_title VARCHAR(200) NOT NULL,
        post_desc TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    console.log("Post table created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Post migration failed", error);
    process.exit(1);
  }
}
createPostsTable();
