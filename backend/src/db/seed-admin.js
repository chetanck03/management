import bcrypt from 'bcryptjs';
import pool from './pool.js';

const seedAdmin = async () => {
  try {
    const email = 'admin@infomate.com';
    const password = 'admin123';
    const fullName = 'Admin';

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      // Update role to admin if exists
      await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', email]);
      console.log('Admin user already exists. Role updated.');
    } else {
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        [fullName, email, hash, 'admin']
      );
      console.log('Admin user created.');
    }

    console.log('  Email: admin@infomate.com');
    console.log('  Password: admin123');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await pool.end();
  }
};

seedAdmin();
