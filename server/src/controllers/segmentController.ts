import { Response } from 'express';
import Segment from '../models/Segment';
import Contact from '../models/Contact';
import { AuthRequest } from '../middleware/auth';

export const getSegments = async (req: AuthRequest, res: Response) => {
  try {
    const segments = await Segment.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: segments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSegment = async (req: AuthRequest, res: Response) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }
    res.status(200).json({ success: true, data: segment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSegment = async (req: AuthRequest, res: Response) => {
  try {
    const segment = await Segment.create(req.body);

    // Calculate initial contact count
    if (segment.type === 'dynamic') {
      const count = await calculateSegmentCount(segment);
      segment.contactCount = count;
      await segment.save();
    }

    res.status(201).json({ success: true, data: segment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSegment = async (req: AuthRequest, res: Response) => {
  try {
    const segment = await Segment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!segment) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }
    res.status(200).json({ success: true, data: segment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSegment = async (req: AuthRequest, res: Response) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSegmentContacts = async (req: AuthRequest, res: Response) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }

    const contacts = await Contact.find({ segments: segment._id });
    res.status(200).json({ success: true, data: contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const previewSegment = async (req: AuthRequest, res: Response) => {
  try {
    const { rules } = req.body;
    const query = buildSegmentQuery(rules);
    const contacts = await Contact.find(query).limit(100);
    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { contacts, total, preview: contacts.slice(0, 10) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper functions
const buildSegmentQuery = (rules: any[]) => {
  const query: any = {};
  if (!rules || rules.length === 0) return query;

  const conditions: any[] = [];

  rules.forEach(rule => {
    const condition: any = {};

    switch (rule.operator) {
      case 'contiene':
        condition[rule.field] = { $regex: rule.value, $options: 'i' };
        break;
      case 'es':
        condition[rule.field] = rule.value;
        break;
      case 'mayor':
        condition[rule.field] = { $gt: Number(rule.value) };
        break;
      case 'menor':
        condition[rule.field] = { $lt: Number(rule.value) };
        break;
      case 'despues':
        condition[rule.field] = { $gte: new Date(rule.value) };
        break;
    }

    conditions.push(condition);
  });

  if (conditions.length > 0) {
    const firstLogic = rules[0]?.logic || 'AND';
    query[firstLogic === 'OR' ? '$or' : '$and'] = conditions;
  }

  return query;
};

const calculateSegmentCount = async (segment: any) => {
  const query = buildSegmentQuery(segment.rules);
  return await Contact.countDocuments(query);
};
