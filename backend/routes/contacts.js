// ── contacts.js ──
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Contact } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty(),
  body('message').notEmpty().isLength({ min: 10 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Your message has been received. We will get back to you soon!', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, total, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status, repliedAt: new Date(), repliedBy: req.user._id }, { new: true });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
