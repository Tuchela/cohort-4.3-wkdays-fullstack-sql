import { pool } from '../connection.js';

async function seedUserData() {
  try {
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES
        ('Mubarak', 'Ismail', 'mubarak_1@gmail.com', 'pass@!123', 'admin'),
        ('Maruf', 'Alimi', 'alimi_1@gmail.com', 'pass@!123', 'superadmin'),
        ('David', 'Ugochukwu', 'Ugochukwu_1@gmail.com', 'pass@!123', 'user'),
        ('Thomas', 'Tuchela', 'thomas_1@gmail.com', 'pass@!123', 'employee')
      `);
    console.log("User data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to seed data", error); 
    process.exit(1);
  }
}
seedUserData();