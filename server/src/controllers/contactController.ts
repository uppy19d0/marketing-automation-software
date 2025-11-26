import { Response } from 'express';
import Contact from '../models/Contact';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { sendEmail } from '../services/emailService';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    // Search by name or email
    if (req.query.search) {
      filter.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = (req.query.tags as string).split(',');
      filter.tags = { $in: tags };
    }

    // Filter by country
    if (req.query.country) {
      filter.country = req.query.country;
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
export const getContact = async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('segments');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Get contact events
    const events = await Event.find({ contactId: contact._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('campaignId landingPageId');

    res.status(200).json({
      success: true,
      data: {
        contact,
        events,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
export const createContact = async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Delete associated events
    await Event.deleteMany({ contactId: contact._id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Import contacts from CSV
// @route   POST /api/contacts/import
// @access  Private
export const importContacts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const contacts: any[] = [];
    const errors: any[] = [];

    // Parse CSV
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (row) => {
        contacts.push({
          email: row.email,
          firstName: row.firstName || row.first_name,
          lastName: row.lastName || row.last_name,
          country: row.country,
          city: row.city,
          tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
        });
      })
      .on('end', async () => {
        let imported = 0;
        let skipped = 0;

        for (const contactData of contacts) {
          try {
            // Check if contact exists
            const exists = await Contact.findOne({ email: contactData.email });

            if (exists) {
              skipped++;
              continue;
            }

            await Contact.create(contactData);
            imported++;
          } catch (error: any) {
            errors.push({ email: contactData.email, error: error.message });
            skipped++;
          }
        }

        res.status(200).json({
          success: true,
          data: {
            imported,
            skipped,
            errors: errors.length > 0 ? errors : undefined,
          },
        });
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Bulk tag assignment
// @route   POST /api/contacts/bulk-tag
// @access  Private
export const bulkTagAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { contactIds, tags, action } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'contactIds array is required',
      });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'tags array is required',
      });
    }

    let updateOperation;
    if (action === 'remove') {
      updateOperation = { $pullAll: { tags } };
    } else {
      updateOperation = { $addToSet: { tags: { $each: tags } } };
    }

    const result = await Contact.updateMany(
      { _id: { $in: contactIds } },
      updateOperation
    );

    res.status(200).json({
      success: true,
      data: {
        modified: result.modifiedCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Send email to contacts
// @route   POST /api/contacts/send-email
// @access  Private
export const sendEmailToContacts = async (req: AuthRequest, res: Response) => {
  try {
    const { contactIds, subject, message } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'contactIds array is required',
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'subject and message are required',
      });
    }

    // Get contacts by IDs
    const contacts = await Contact.find({ _id: { $in: contactIds } });

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No contacts found',
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Send email to each contact
    for (const contact of contacts) {
      try {
        await sendEmail(contact.email, subject, message);
        results.sent++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          email: contact.email,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
