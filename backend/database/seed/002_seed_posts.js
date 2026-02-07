import { pool } from "../connection.js";

async function seedUserData() {
  try {
    await pool.query(`
      INSERT INTO posts (post_owner_id, post_title, post_desc, post_comment)
      VALUES 
        (2, 'Learn PostgreSQL', 'This is first lessson on SQL databases', 'I enjoyed learn sql databse'),
        (1, 'Learn Nodejs', 'This is first lessson on Nodejs class', 'I enjoyed learn Nodejs'),
        (3, 'Learn React', 'This is first lessson on React Hook', 'I enjoyed learn React Hook'),
        (4, 'Learn Mongodb', 'This is first lessson on mongodb', 'I enjoyed learn mongodb databse')
      `);
    console.log("Posts data seeded successfully");
  } catch (error) {
    console.error("Unable to seed posts data", error);
  }
}
export default seedUserData;
// seedUserData();
