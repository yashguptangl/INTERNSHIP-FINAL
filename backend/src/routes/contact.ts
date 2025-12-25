import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new contact submission (public route)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Create contact submission
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        phone: phone || null,
        status: 'new',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
    });
  }
});

// Get all contact submissions (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, search } = req.query;

    // Build filter conditions
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { subject: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
    });
  }
});

// Get contact statistics (admin only)
router.get('/stats', authenticate, async (req, res) => {
  try {
    const [total, newCount, readCount, respondedCount] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.contact.count({ where: { status: 'read' } }),
      prisma.contact.count({ where: { status: 'responded' } }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        new: newCount,
        read: readCount,
        responded: respondedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics',
    });
  }
});

// Get single contact by ID (admin only)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await prisma.contact.update({
        where: { id },
        data: { status: 'read' },
      });
    }

    return res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
    });
  }
});

// Update contact status (admin only)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: new, read, or responded',
      });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
    });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
    });
  }
});

export default router;
