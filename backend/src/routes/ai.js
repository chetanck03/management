import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = Router();

// Chat with AI tutor
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { subjectId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get subject info
    let subjectContext = '';
    if (subjectId) {
      const subResult = await pool.query('SELECT name, code FROM subjects WHERE id = $1 AND user_id = $2', [subjectId, req.userId]);
      if (subResult.rows.length > 0) {
        subjectContext = `You are an expert tutor for the subject "${subResult.rows[0].name}" (${subResult.rows[0].code}). `;
      }
    }

    // Get recent chat history for context
    let history = [];
    if (subjectId) {
      const histResult = await pool.query(
        'SELECT message, role FROM chat_history WHERE user_id = $1 AND subject_id = $2 ORDER BY created_at DESC LIMIT 10',
        [req.userId, subjectId]
      );
      history = histResult.rows.reverse();
    }

    // Build prompt
    const systemPrompt = `${subjectContext}You are an AI tutor helping a college student. 
Provide clear, detailed explanations with examples. Use markdown formatting.
Include code examples when relevant. Be encouraging and helpful.
Keep responses focused and educational.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chatHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.message }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // Save to chat history
    await pool.query(
      'INSERT INTO chat_history (user_id, subject_id, message, role) VALUES ($1, $2, $3, $4)',
      [req.userId, subjectId || null, message, 'user']
    );
    await pool.query(
      'INSERT INTO chat_history (user_id, subject_id, message, role) VALUES ($1, $2, $3, $4)',
      [req.userId, subjectId || null, response, 'assistant']
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)',
      [req.userId, 'ai', `Asked AI Tutor a question`]
    );

    res.json({ response });
  } catch (err) {
    console.error('AI Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response. Check your GEMINI_API_KEY.' });
  }
});

// Get chat history for a subject
router.get('/history/:subjectId', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, message, role, created_at FROM chat_history WHERE user_id = $1 AND subject_id = $2 ORDER BY created_at ASC LIMIT 50',
      [req.userId, req.params.subjectId]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
