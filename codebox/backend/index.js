require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors'); 

// Import routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const routineRoutes = require('./routes/routines');
const dailyGoalRoutes = require('./routes/dailyGoals');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CodeBox API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      routines: '/api/routines',
      dailyGoals: '/api/daily-goals'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/daily-goals', dailyGoalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 CodeBox API Server running on http://localhost:${port}`);
  console.log(`📚 Endpoints available:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET/POST/PUT/DELETE /api/todos`);
  console.log(`   - GET/POST/DELETE /api/routines`);
  console.log(`   - GET/POST/PUT/DELETE /api/daily-goals`);
});

module.exports = app;