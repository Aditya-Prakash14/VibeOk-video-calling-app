const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// @route   GET /api/daily-goals
// @desc    Get all daily goals for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause = { userId: req.user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const dailyGoals = await prisma.dailyGoal.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    res.json(dailyGoals);
  } catch (error) {
    console.error('Get daily goals error:', error);
    res.status(500).json({ error: 'Server error fetching daily goals' });
  }
});

// @route   GET /api/daily-goals/:date
// @desc    Get daily goal for a specific date
// @access  Private
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    const dailyGoal = await prisma.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: new Date(date),
        },
      },
    });

    if (!dailyGoal) {
      return res.status(404).json({ error: 'Daily goal not found for this date' });
    }

    res.json(dailyGoal);
  } catch (error) {
    console.error('Get daily goal error:', error);
    res.status(500).json({ error: 'Server error fetching daily goal' });
  }
});

// @route   POST /api/daily-goals
// @desc    Create or update daily goal
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { date, codeforcesProblems, leetcodeProblems, githubCommits } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const goalDate = new Date(date);

    // Check if daily goal already exists
    const existingGoal = await prisma.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: goalDate,
        },
      },
    });

    let dailyGoal;
    if (existingGoal) {
      // Update existing goal
      dailyGoal = await prisma.dailyGoal.update({
        where: {
          userId_date: {
            userId: req.user.id,
            date: goalDate,
          },
        },
        data: {
          codeforcesProblems: codeforcesProblems !== undefined ? codeforcesProblems : existingGoal.codeforcesProblems,
          leetcodeProblems: leetcodeProblems !== undefined ? leetcodeProblems : existingGoal.leetcodeProblems,
          githubCommits: githubCommits !== undefined ? githubCommits : existingGoal.githubCommits,
        },
      });
    } else {
      // Create new goal
      dailyGoal = await prisma.dailyGoal.create({
        data: {
          date: goalDate,
          codeforcesProblems: codeforcesProblems || 0,
          leetcodeProblems: leetcodeProblems || 0,
          githubCommits: githubCommits || 0,
          userId: req.user.id,
        },
      });
    }

    res.status(201).json(dailyGoal);
  } catch (error) {
    console.error('Create/update daily goal error:', error);
    res.status(500).json({ error: 'Server error managing daily goal' });
  }
});

// @route   PUT /api/daily-goals/:date/increment
// @desc    Increment a specific counter for today's goal
// @access  Private
router.put('/:date/increment', async (req, res) => {
  try {
    const { date } = req.params;
    const { counter } = req.body; // 'codeforces', 'leetcode', or 'github'

    if (!counter || !['codeforces', 'leetcode', 'github'].includes(counter)) {
      return res.status(400).json({ error: 'Valid counter type is required (codeforces, leetcode, or github)' });
    }

    const goalDate = new Date(date);

    // Get or create today's goal
    let dailyGoal = await prisma.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: goalDate,
        },
      },
    });

    if (!dailyGoal) {
      dailyGoal = await prisma.dailyGoal.create({
        data: {
          date: goalDate,
          userId: req.user.id,
        },
      });
    }

    // Increment the appropriate counter
    const updateData = {};
    if (counter === 'codeforces') {
      updateData.codeforcesProblems = dailyGoal.codeforcesProblems + 1;
    } else if (counter === 'leetcode') {
      updateData.leetcodeProblems = dailyGoal.leetcodeProblems + 1;
    } else if (counter === 'github') {
      updateData.githubCommits = dailyGoal.githubCommits + 1;
    }

    const updatedGoal = await prisma.dailyGoal.update({
      where: {
        userId_date: {
          userId: req.user.id,
          date: goalDate,
        },
      },
      data: updateData,
    });

    res.json(updatedGoal);
  } catch (error) {
    console.error('Increment counter error:', error);
    res.status(500).json({ error: 'Server error incrementing counter' });
  }
});

// @route   DELETE /api/daily-goals/:date
// @desc    Delete a daily goal
// @access  Private
router.delete('/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const existingGoal = await prisma.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: new Date(date),
        },
      },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Daily goal not found' });
    }

    await prisma.dailyGoal.delete({
      where: {
        userId_date: {
          userId: req.user.id,
          date: new Date(date),
        },
      },
    });

    res.json({ message: 'Daily goal deleted successfully' });
  } catch (error) {
    console.error('Delete daily goal error:', error);
    res.status(500).json({ error: 'Server error deleting daily goal' });
  }
});

module.exports = router;
