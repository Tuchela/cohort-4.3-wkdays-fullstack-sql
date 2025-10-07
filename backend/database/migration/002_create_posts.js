import { pool } from "../connection.js";

async function createPostsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL,
        post_title VARCHAR(200) NOT NULL,
        post_desc TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES users(id) ON DELETE CASCADE,
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
