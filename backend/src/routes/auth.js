import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

const router = Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, rollNo, semester, branch, college } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, roll_no, semester, branch, college)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, full_name, email, roll_no, semester, branch, college, cgpa, streak`,
      [fullName, email, passwordHash, rollNo || null, semester || null, branch || null, college || null]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create default subjects for the user
    const defaultSubjects = [
      { name: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', color: '#4f46e5' },
      { name: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', color: '#7c3aed' },
      { name: 'Database Management Systems', code: 'CS303', faculty: 'Dr. Patel', color: '#0891b2' },
      { name: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', color: '#059669' },
      { name: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', color: '#d97706' },
      { name: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', color: '#dc2626' },
    ];

    for (const sub of defaultSubjects) {
      await pool.query(
        'INSERT INTO subjects (name, code, faculty, color, user_id) VALUES ($1, $2, $3, $4, $5)',
        [sub.name, sub.code, sub.faculty, sub.color, user.id]
      );
    }

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT id, full_name, email, password_hash, role, roll_no, semester, branch, college, cgpa, streak FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const { password_hash, ...userData } = user;
    res.json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT id, full_name, email, role, roll_no, semester, branch, college, cgpa, streak FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
