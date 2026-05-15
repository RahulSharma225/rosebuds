// students.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/students — Admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { grade, section, search, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };
    if (grade) query.grade = grade;
    if (section) query.section = section;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const students = await User.find(query).populate('parentId', 'name email phone').sort({ name: 1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, total, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/students — Admin creates student
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, grade, section, rollNo, parentId, phone } = req.body;
    const count = await User.countDocuments({ role: 'student' });
    const studentId = `RB${new Date().getFullYear()}${String(count + 1).padStart(4,'0')}`;
    const student = await User.create({ name, email, password: password || 'Welcome@123', role: 'student', grade, section, rollNo, parentId, phone, studentId });
    res.status(201).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).populate('parentId', 'name email phone');
    if (!student || student.role !== 'student') return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/students/:id — Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const student = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
