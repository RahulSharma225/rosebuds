const express = require('express');
const router = express.Router();
const { News } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const total = await News.countDocuments(query);
    const news = await News.find(query).sort({ isPinned: -1, publishedAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, total, pages: Math.ceil(total/limit), news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!news || !news.isPublished) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const news = await News.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!news) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
