const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admission = require('../models/Admission');
const { protect, authorize } = require('../middleware/auth');

// POST /api/admissions — Public (submit form)
router.post('/', [
  body('studentName').trim().notEmpty(),
  body('dateOfBirth').isDate(),
  body('gender').isIn(['male', 'female', 'other']),
  body('applyingForGrade').notEmpty(),
  body('parentName').trim().notEmpty(),
  body('parentEmail').isEmail().normalizeEmail(),
  body('parentPhone').notEmpty(),
  body('academicYear').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({ success: true, message: 'Application submitted successfully!', applicationNumber: admission.applicationNumber, admission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admissions — Admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, grade, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (grade) query.applyingForGrade = grade;
    if (search) query.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { parentName: { $regex: search, $options: 'i' } },
      { applicationNumber: { $regex: search, $options: 'i' } },
    ];
    const total = await Admission.countDocuments(query);
    const admissions = await Admission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), admissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admissions/:id — Admin or applicant check via appNumber
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findOne({
      $or: [{ _id: req.params.id }, { applicationNumber: req.params.id }]
    });
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, admission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admissions/:id/status — Admin only
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, statusNote, interviewDate } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status, statusNote, interviewDate, reviewedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, admission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admissions/:id — Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
