const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const routineValidation = [
  body('routineId').trim().notEmpty().withMessage('Routine ID is required'),
];

// @route   GET /api/routines
// @desc    Get all routines for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const routines = await prisma.routine.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(routines);
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({ error: 'Server error fetching routines' });
  }
});

// @route   POST /api/routines
// @desc    Create or toggle a routine
// @access  Private
router.post('/', routineValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routineId, isActive } = req.body;

    // Check if routine already exists
    const existingRoutine = await prisma.routine.findUnique({
      where: {
        userId_routineId: {
          userId: req.user.id,
          routineId,
        },
      },
    });

    let routine;
    if (existingRoutine) {
      // Update existing routine
      routine = await prisma.routine.update({
        where: {
          userId_routineId: {
            userId: req.user.id,
            routineId,
          },
        },
        data: {
          isActive: isActive !== undefined ? isActive : !existingRoutine.isActive,
        },
      });
    } else {
      // Create new routine
      routine = await prisma.routine.create({
        data: {
          routineId,
          isActive: isActive !== undefined ? isActive : true,
          userId: req.user.id,
        },
      });
    }

    res.status(201).json(routine);
  } catch (error) {
    console.error('Create/update routine error:', error);
    res.status(500).json({ error: 'Server error managing routine' });
  }
});

// @route   DELETE /api/routines/:routineId
// @desc    Delete a routine
// @access  Private
router.delete('/:routineId', async (req, res) => {
  try {
    const { routineId } = req.params;

    // Check if routine exists and belongs to user
    const existingRoutine = await prisma.routine.findUnique({
      where: {
        userId_routineId: {
          userId: req.user.id,
          routineId,
        },
      },
    });

    if (!existingRoutine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    await prisma.routine.delete({
      where: {
        userId_routineId: {
          userId: req.user.id,
          routineId,
        },
      },
    });

    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    console.error('Delete routine error:', error);
    res.status(500).json({ error: 'Server error deleting routine' });
  }
});

module.exports = router;
