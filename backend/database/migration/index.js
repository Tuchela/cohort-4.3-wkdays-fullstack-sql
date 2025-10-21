import createUserTable from "./001_create_users.js";
import createPostTable from "./002_create_posts.js";
import seedUserData from "../seed/001_seed_users.js";
import seedPostData from "../seed/002_seed_posts.js";

(async () => {
  try {
    await createUserTable();
    await createPostTable();
    await seedUserData();
    await seedPostData();
  } catch (error) {
    console.log(error.message);
  }
})();
