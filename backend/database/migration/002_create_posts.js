import { pool } from "../connection.js";

const postsTable = `
    DROP TABLE IF EXISTS posts CASCADE;
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        post_owner_id INTEGER NOT NULL,
        post_title VARCHAR(250) NOT NULL,
        post_desc VARCHAR(250) NOT NULL,
        post_comment TEXT,
        FOREIGN KEY (post_owner_id) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `;

async function createPostTable() {
  try {
    const create = await pool.query(postsTable);
        console.log(
          `posts table ${create[0].command}PED and ${create[1].command}D`
        );
        console.log("Post table created successfully");
  } catch (error) {
    console.error("Posts migration failed", error);
  }
}
export default createPostTable;
// createPostTable();
