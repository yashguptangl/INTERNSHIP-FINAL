import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { Request, Response } from 'express';

const router = Router();

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req : Request, res : Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const secret: string = process.env.JWT_SECRET || 'secret';
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Register (for creating new admin users)
router.post(
  '/register',
  authenticate,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req : Request, res : Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password, name } = req.body;

      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'admin',
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: admin,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// Get current admin
router.get('/me', authenticate, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;