import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = Router();

// Get today's goals
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 AND date = CURRENT_DATE ORDER BY created_at',
      [req.userId]
    );
    res.json({ goals: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a goal
router.post('/', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const result = await pool.query(
      'INSERT INTO goals (user_id, text) VALUES ($1, $2) RETURNING *',
      [req.userId, text]
    );
    res.status(201).json({ goal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle goal completion
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE goals SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (result.rows[0].completed) {
      await pool.query(
        'INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)',
        [req.userId, 'goal', `Completed: ${result.rows[0].text}`]
      );
    }

    res.json({ goal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a goal
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
