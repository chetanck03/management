import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = Router();

// Get attendance summary per subject
router.get('/summary', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id as subject_id,
        s.name,
        s.code,
        s.color,
        s.faculty,
        COUNT(a.id) as total_classes,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count
      FROM subjects s
      LEFT JOIN attendance a ON a.subject_id = s.id AND a.user_id = $1
      WHERE s.user_id = $1
      GROUP BY s.id, s.name, s.code, s.color, s.faculty
      ORDER BY s.code
    `, [req.userId]);

    const subjects = result.rows.map(row => ({
      ...row,
      total_classes: parseInt(row.total_classes),
      present_count: parseInt(row.present_count),
      percentage: row.total_classes > 0 
        ? Math.round((parseInt(row.present_count) / parseInt(row.total_classes)) * 100) 
        : 0,
    }));

    res.json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark attendance
router.post('/', authenticate, async (req, res) => {
  try {
    const { subjectId, date, status, timetableId } = req.body;

    if (!subjectId || !date || !status) {
      return res.status(400).json({ error: 'subjectId, date, and status are required' });
    }

    // Check if already marked
    const existing = await pool.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND subject_id = $2 AND date = $3 AND timetable_id = $4',
      [req.userId, subjectId, date, timetableId || null]
    );

    if (existing.rows.length > 0) {
      // Update existing
      await pool.query(
        'UPDATE attendance SET status = $1 WHERE id = $2',
        [status, existing.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO attendance (user_id, subject_id, timetable_id, date, status) VALUES ($1, $2, $3, $4, $5)',
        [req.userId, subjectId, timetableId || null, date, status]
      );
    }

    // Log activity
    const subjectResult = await pool.query('SELECT name FROM subjects WHERE id = $1', [subjectId]);
    const subjectName = subjectResult.rows[0]?.name || 'Unknown';
    await pool.query(
      'INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)',
      [req.userId, 'attendance', `Marked ${status} in ${subjectName}`]
    );

    res.json({ message: 'Attendance marked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attendance records for a subject
router.get('/subject/:subjectId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM attendance WHERE user_id = $1 AND subject_id = $2 ORDER BY date DESC',
      [req.userId, req.params.subjectId]
    );
    res.json({ records: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
