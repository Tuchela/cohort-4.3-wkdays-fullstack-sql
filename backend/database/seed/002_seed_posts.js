import { pool } from "../connection.js";

async function seedPostData() {
  try {
    await pool.query(`
      INSERT INTO posts (post_id, post_title, post_desc)
       VALUES
        (2, 'First Post', 'This is the description for the first post.'),
        (1, 'Second Post', 'This is the description for the second post.'),
        (3, 'Third Post', 'This is the description for the third post.'),
        (4, 'Fourth Post', 'This is the description for the fourth post.')
      `);
    console.log("Post data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to seed post data", error);
    process.exit(1);
  }
}
seedPostData(); 