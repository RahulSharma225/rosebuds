const express = require('express');
const router = express.Router();
const { Event } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

// GET /api/events — Public
router.get('/', async (req, res) => {
  try {
    const { category, upcoming } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (upcoming === 'true') query.date = { $gte: new Date() };
    const events = await Event.find(query).sort({ date: 1 }).limit(50);
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events — Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/events/:id — Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/events/:id — Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
