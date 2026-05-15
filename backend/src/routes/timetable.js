import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = Router();

// Get timetable for user (optionally filter by day)
router.get('/', authenticate, async (req, res) => {
  try {
    const { day } = req.query;
    let query = `
      SELECT t.*, s.name as subject_name, s.code as subject_code, s.faculty, s.color
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      WHERE t.user_id = $1
    `;
    const params = [req.userId];

    if (day) {
      query += ' AND t.day = $2';
      params.push(day);
    }

    query += ' ORDER BY t.start_time';

    const result = await pool.query(query, params);
    res.json({ timetable: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a timetable entry
router.post('/', authenticate, async (req, res) => {
  try {
    const { subjectId, day, startTime, endTime, room, type } = req.body;

    if (!subjectId || !day || !startTime || !endTime) {
      return res.status(400).json({ error: 'subjectId, day, startTime, endTime are required' });
    }

    const result = await pool.query(
      `INSERT INTO timetable (user_id, subject_id, day, start_time, end_time, room, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, subjectId, day, startTime, endTime, room || null, type || 'Lecture']
    );

    res.status(201).json({ entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a timetable entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM timetable WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
