import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';
import emailService from '../services/email.service.js';
import googleSheetsService from '../services/googleSheets.service.js';
import { generateEmployeeId, calculatePhase } from '../utils/internship.js';

const router = Router();

// ✅ Verify internship ID format and existence (public, keep BEFORE /:employeeId)
router.get('/verify/:employeeId', async (req, res) => {
  try {
    const raw = req.params.employeeId || '';
    const employeeId = raw.trim();

    // Match TS-MRN-25-P1-1234 type pattern
    const idPattern = /^TS-[A-Z]+-\d{2}-P\d-[A-Z0-9]{4}$/i;
    if (!idPattern.test(employeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID format',
      });
    }

    const intern = await prisma.intern.findUnique({ where: { employeeId } });
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Internship ID not found',
      });
    }

    return res.json({
      success: true,
      message: 'Internship ID is valid',
      data: intern,
    });
  } catch (error) {
    console.error('Verify internship ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Create new intern (backend generates employeeId + dates)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      country,
      domain,
      address,
      college,
      degree,
      year,
      socialMedia,
      status, // optional
    } = req.body;

    if (!name || !email || !domain) {
      return res.status(400).json({
        success: false,
        message: 'name, email, domain are required',
      });
    }

    const appliedDate = new Date();
    const phaseInfo = calculatePhase(appliedDate);
    const { phase, internshipStart, internshipEnd } = phaseInfo;

    const employeeId = generateEmployeeId(domain, phase);

    // Always set endDate to 28 days after startDate
    const fixedEndDate = new Date(internshipStart);
    fixedEndDate.setDate(fixedEndDate.getDate() + 27); // 28 days including start

    const intern = await prisma.intern.create({
      data: {
        name,
        email,
        phone,
        gender,
        country,
        domain,
        appliedDate,
        startDate: internshipStart,
        endDate: fixedEndDate,
        phase,
        address,
        college,
        degree,
        year,
        socialMedia,
        employeeId,
        offerLetterSent: false,
        certificateSent: false,
        status: status || 'pending',
      },
    });

    return res.json({
      success: true,
      message: 'Intern created successfully',
      data: intern,
    });
  } catch (error) {
    console.error('Create intern error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create intern',
    });
  }
});

// Get statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const total = await prisma.intern.count();
    const active = await prisma.intern.count({ where: { status: 'active' } });
    const completed = await prisma.intern.count({
      where: { status: 'completed' },
    });
    const pending = await prisma.intern.count({ where: { status: 'pending' } });

    return res.json({
      success: true,
      data: { total, active, completed, pending },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

// Manual Google Sheets sync
router.post('/sync/sheets', authenticate, async (req, res) => {
  try {
    await googleSheetsService.syncFromSheets();

    return res.json({
      success: true,
      message: 'Sync completed successfully',
    });
  } catch (error) {
    console.error('Manual sync error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync from Google Sheets',
    });
  }
});

// Get all interns (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, domain, search } = req.query as {
      status?: string;
      domain?: string;
      search?: string;
    };

    const where: any = {};

    if (status && status !== 'all') where.status = status;
    if (domain && domain !== 'all') where.domain = domain;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const interns = await prisma.intern.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: interns });
  } catch (error) {
    console.error('Get interns error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get intern by Employee ID (public, simple fetch)
router.get('/:employeeId', async (req, res) => {
  try {
    const employeeId = (req.params.employeeId || '').trim();

    const intern = await prisma.intern.findUnique({
      where: { employeeId },
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    return res.json({ success: true, data: intern });
  } catch (error) {
    console.error('Get intern error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send offer letter
router.post('/:id/send-offer', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({ where: { id } });

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
        message:
          'Intern email address is missing. Please sync with Google Sheets to update intern data.',
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

    return res.json({
      success: true,
      message: 'Offer letter sent successfully',
    });
  } catch (error) {
    console.error('Send offer letter error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send offer letter',
    });
  }
});

// Preview offer letter
router.get('/:id/preview-offer', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({ where: { id } });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    const html = emailService.getOfferLetterPreview(intern);
    return res.send(html);
  } catch (error) {
    console.error('Preview offer letter error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate offer letter preview',
    });
  }
});

// Send certificate
router.post('/:id/send-certificate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({ where: { id } });

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
        message:
          'Intern email address is missing. Please sync with Google Sheets to update intern data.',
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
        status: 'completed',
      },
    });

    return res.json({
      success: true,
      message: 'Certificate sent successfully',
    });
  } catch (error) {
    console.error('Send certificate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send certificate',
    });
  }
});

// Preview certificate
router.get('/:id/preview-certificate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({ where: { id } });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found',
      });
    }

    const html = emailService.getCertificatePreview(intern);
    return res.send(html);
  } catch (error) {
    console.error('Preview certificate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate certificate preview',
    });
  }
});

// SAFE Update intern (employeeId NOT updatable)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      'name',
      'email',
      'phone',
      'gender',
      'country',
      'domain',
      'startDate',
      'endDate',
      'phase',
      'status',
      'address',
      'college',
      'degree',
      'year',
      'socialMedia',
    ];

    const updateData: any = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const intern = await prisma.intern.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      success: true,
      message: 'Intern updated successfully',
      data: intern,
    });
  } catch (error) {
    console.error('Update intern error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update intern',
    });
  }
});

// Delete intern
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.intern.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Intern deleted successfully',
    });
  } catch (error) {
    console.error('Delete intern error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete intern',
    });
  }
});

export default router;
