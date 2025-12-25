import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';
import emailService from '../services/email.service.js';
import googleSheetsService from '../services/googleSheets.service.js';

const router = Router();

// Get statistics (MUST be before /:employeeId route)
router.get('/stats', authenticate, async (req, res) => {
  try {
    const total = await prisma.intern.count();
    const active = await prisma.intern.count({ where: { status: 'active' } });
    const completed = await prisma.intern.count({ where: { status: 'completed' } });
    const pending = await prisma.intern.count({ where: { status: 'pending' } });

    res.json({
      success: true,
      data: {
        total,
        active,
        completed,
        pending,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Manually trigger Google Sheets sync (MUST be before /:employeeId route)
router.post('/sync/sheets', authenticate, async (req, res) => {
  try {
    await googleSheetsService.syncFromSheets();

    res.json({
      success: true,
      message: 'Sync completed successfully',
    });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync from Google Sheets',
    });
  }
});

// Get all interns (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, domain, search } = req.query;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (domain && domain !== 'all') {
      where.domain = domain;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { employeeId: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const interns = await prisma.intern.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: interns,
    });
  } catch (error) {
    console.error('Get interns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get intern by Employee ID (public route for verification)
router.get('/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { employeeId },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    res.json({
      success: true,
      data: intern,
    });
  } catch (error) {
    console.error('Get intern error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send offer letter
router.post('/:id/send-offer', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    // Debug log
    console.log('📧 Sending offer letter to:', {
      id: intern.id,
      name: intern.name,
      email: intern.email,
      emailType: typeof intern.email,
      emailLength: intern.email?.length,
      emailTrimmed: intern.email?.trim(),
    });

    if (!intern.email || intern.email.trim() === '') {
      console.log('❌ Email missing for intern:', intern.name, 'ID:', intern.id);
      return res.status(400).json({
        success: false,
        message: 'Intern email address is missing. Please sync with Google Sheets to update intern data.',
      });
    }

    if (intern.offerLetterSent) {
      return res.status(400).json({
        success: false,
        message: 'Offer letter already sent',
      });
    }

    await emailService.sendOfferLetter(intern);

    await prisma.intern.update({
      where: { id },
      data: { offerLetterSent: true },
    });

    res.json({
      success: true,
      message: 'Offer letter sent successfully',
    });
  } catch (error) {
    console.error('Send offer letter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send offer letter',
    });
  }
});

// Preview offer letter
router.get('/:id/preview-offer', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    const html = emailService.getOfferLetterPreview(intern);
    res.send(html);
  } catch (error) {
    console.error('Preview offer letter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate offer letter preview',
    });
  }
});

// Send certificate
router.post('/:id/send-certificate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    if (!intern.email || intern.email.trim() === '') {
      console.log('❌ Email missing for intern:', intern.name, 'ID:', intern.id);
      return res.status(400).json({
        success: false,
        message: 'Intern email address is missing. Please sync with Google Sheets to update intern data.',
      });
    }

    if (!intern.offerLetterSent) {
      return res.status(400).json({
        success: false,
        message: 'Send offer letter first',
      });
    }

    if (intern.certificateSent) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already sent',
      });
    }

    await emailService.sendCertificate(intern);

    await prisma.intern.update({
      where: { id },
      data: { 
        certificateSent: true,
        status: 'completed', // Automatically mark as completed
      },
    });

    res.json({
      success: true,
      message: 'Certificate sent successfully',
    });
  } catch (error) {
    console.error('Send certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send certificate',
    });
  }
});

// Preview certificate
router.get('/:id/preview-certificate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    const html = emailService.getCertificatePreview(intern);
    res.send(html);
  } catch (error) {
    console.error('Preview certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate preview',
    });
  }
});

// Update intern
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const intern = await prisma.intern.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Intern updated successfully',
      data: intern,
    });
  } catch (error) {
    console.error('Update intern error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update intern',
    });
  }
});

// Delete intern
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.intern.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Intern deleted successfully',
    });
  } catch (error) {
    console.error('Delete intern error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete intern',
    });
  }
});

export default router;