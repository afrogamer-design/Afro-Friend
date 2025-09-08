const express = require('express');
const { pool } = require('../models/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all users with optional filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { country, game, search } = req.query;
    let query = `
      SELECT 
        u.id, u.username, u.country, u.created_at,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', g.id,
              'name', g.game_name,
              'category', g.category
            )
          ) FILTER (WHERE g.id IS NOT NULL), '[]'
        ) as games
      FROM users u
      LEFT JOIN user_games ug ON u.id = ug.user_id
      LEFT JOIN games g ON ug.game_id = g.id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (country) {
      paramCount++;
      conditions.push(`u.country = $${paramCount}`);
      params.push(country);
    }

    if (game) {
      paramCount++;
      conditions.push(`g.game_name ILIKE $${paramCount}`);
      params.push(`%${game}%`);
    }

    if (search) {
      paramCount++;
      conditions.push(`u.username ILIKE $${paramCount}`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY u.id ORDER BY u.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const userResult = await pool.query(
      `SELECT id, username, country, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const gamesResult = await pool.query(
      `SELECT g.id, g.game_name, g.category 
       FROM user_games ug
       JOIN games g ON ug.game_id = g.id
       WHERE ug.user_id = $1`,
      [id]
    );

    const user = userResult.rows[0];
    user.games = gamesResult.rows;

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, country, games } = req.body;
    
    // Verify user owns this profile
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update user details
    const userResult = await pool.query(
      `UPDATE users SET username = $1, country = $2 
       WHERE id = $3 RETURNING id, username, country`,
      [username, country, id]
    );

    // Update user games
    if (games && Array.isArray(games)) {
      // Delete existing games
      await pool.query('DELETE FROM user_games WHERE user_id = $1', [id]);
      
      // Add new games
      for (const gameId of games) {
        await pool.query(
          'INSERT INTO user_games (user_id, game_id) VALUES ($1, $2)',
          [id, gameId]
        );
      }
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Server error while updating user' });
  }
});

module.exports = router;