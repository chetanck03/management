import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import pool from '../db/pool.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate);
router.use(isAdmin);

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['student']);
    const subjects = await pool.query('SELECT COUNT(DISTINCT code) as count FROM subjects');
    const timetableEntries = await pool.query('SELECT COUNT(*) as count FROM timetable');
    const attendanceRecords = await pool.query('SELECT COUNT(*) as count FROM attendance');
    const chatMessages = await pool.query('SELECT COUNT(*) as count FROM chat_history');
    const goals = await pool.query('SELECT COUNT(*) as count FROM goals');

    res.json({
      stats: {
        totalStudents: parseInt(users.rows[0].count),
        totalSubjects: parseInt(subjects.rows[0].count),
        totalTimetableEntries: parseInt(timetableEntries.rows[0].count),
        totalAttendanceRecords: parseInt(attendanceRecords.rows[0].count),
        totalChatMessages: parseInt(chatMessages.rows[0].count),
        totalGoals: parseInt(goals.rows[0].count),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== USER MANAGEMENT =====
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, roll_no, semester, branch, college, cgpa, streak, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, roll_no, semester, branch, college, cgpa, streak, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, email, role, rollNo, semester, branch, college, cgpa, streak } = req.body;
    const result = await pool.query(
      `UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), 
       role = COALESCE($3, role), roll_no = COALESCE($4, roll_no), semester = COALESCE($5, semester),
       branch = COALESCE($6, branch), college = COALESCE($7, college), cgpa = COALESCE($8, cgpa),
       streak = COALESCE($9, streak), updated_at = NOW()
       WHERE id = $10 RETURNING id, full_name, email, role, roll_no, semester, branch, college, cgpa, streak`,
      [fullName, email, role, rollNo, semester, branch, college, cgpa, streak, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    // Prevent deleting yourself
    if (parseInt(req.params.id) === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (admin can create students or other admins)
router.post('/users', async (req, res) => {
  try {
    const { fullName, email, password, role, rollNo, semester, branch, college } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, password are required' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, roll_no, semester, branch, college)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, full_name, email, role, roll_no, semester, branch, college, cgpa, streak`,
      [fullName, email, passwordHash, role || 'student', rollNo || null, semester || null, branch || null, college || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== SUBJECT MANAGEMENT (GLOBAL) =====
router.get('/subjects', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.full_name as user_name FROM subjects s 
       LEFT JOIN users u ON s.user_id = u.id 
       ORDER BY s.code, s.user_id`
    );
    res.json({ subjects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign subjects to a user
router.post('/subjects/assign', async (req, res) => {
  try {
    const { userId, subjects } = req.body;
    if (!userId || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'userId and subjects array required' });
    }

    const created = [];
    for (const sub of subjects) {
      const result = await pool.query(
        'INSERT INTO subjects (name, code, faculty, color, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [sub.name, sub.code, sub.faculty || null, sub.color || '#4f46e5', userId]
      );
      created.push(result.rows[0]);
    }

    res.status(201).json({ subjects: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM subjects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== TIMETABLE MANAGEMENT =====
router.get('/timetable', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `
      SELECT t.*, s.name as subject_name, s.code as subject_code, u.full_name as user_name
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN users u ON t.user_id = u.id
    `;
    const params = [];
    if (userId) {
      query += ' WHERE t.user_id = $1';
      params.push(userId);
    }
    query += ' ORDER BY t.day, t.start_time';

    const result = await pool.query(query, params);
    res.json({ timetable: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/timetable', async (req, res) => {
  try {
    const { userId, subjectId, day, startTime, endTime, room, type } = req.body;
    if (!userId || !subjectId || !day || !startTime || !endTime) {
      return res.status(400).json({ error: 'userId, subjectId, day, startTime, endTime required' });
    }

    const result = await pool.query(
      `INSERT INTO timetable (user_id, subject_id, day, start_time, end_time, room, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, subjectId, day, startTime, endTime, room || null, type || 'Lecture']
    );
    res.status(201).json({ entry: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/timetable/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM timetable WHERE id = $1', [req.params.id]);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== NOTIFICATIONS =====
router.post('/notifications', async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message required' });
    }

    if (userId) {
      // Send to specific user
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
        [userId, title, message, type || 'info']
      );
    } else {
      // Send to all students
      const users = await pool.query("SELECT id FROM users WHERE role = 'student'");
      for (const user of users.rows) {
        await pool.query(
          'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
          [user.id, title, message, type || 'info']
        );
      }
    }

    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== ATTENDANCE OVERVIEW =====
router.get('/attendance', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id as user_id, u.full_name, u.roll_no,
        s.name as subject_name, s.code as subject_code,
        COUNT(a.id) as total,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present
      FROM users u
      JOIN subjects s ON s.user_id = u.id
      LEFT JOIN attendance a ON a.user_id = u.id AND a.subject_id = s.id
      WHERE u.role = 'student'
      GROUP BY u.id, u.full_name, u.roll_no, s.name, s.code
      ORDER BY u.full_name, s.code
    `);
    res.json({ records: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
