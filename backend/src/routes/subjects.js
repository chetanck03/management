import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = Router();

// Get all subjects for user
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE user_id = $1 ORDER BY code',
      [req.userId]
    );
    res.json({ subjects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a subject
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, code, faculty, color } = req.body;
    const result = await pool.query(
      'INSERT INTO subjects (name, code, faculty, color, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, code, faculty || null, color || '#4f46e5', req.userId]
    );
    res.status(201).json({ subject: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a subject
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
