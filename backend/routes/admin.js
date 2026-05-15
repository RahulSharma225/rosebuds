const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admission = require('../models/Admission');
const { Contact, Event, News, Fee } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

// GET /api/admin/dashboard — Stats overview
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [
      totalStudents, totalParents, totalAdmissions, pendingAdmissions,
      newContacts, totalFeesDue, totalFeesPaid,
      upcomingEvents, recentNews
    ] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'parent', isActive: true }),
      Admission.countDocuments(),
      Admission.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'new' }),
      Fee.aggregate([{ $match: { status: { $in: ['pending', 'overdue'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Fee.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Event.find({ isPublished: true, date: { $gte: new Date() } }).sort({ date: 1 }).limit(5),
      News.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        students: totalStudents,
        parents: totalParents,
        admissions: { total: totalAdmissions, pending: pendingAdmissions },
        contacts: { new: newContacts },
        fees: {
          due: totalFeesDue[0]?.total || 0,
          collected: totalFeesPaid[0]?.total || 0,
        }
      },
      upcomingEvents,
      recentNews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users — All users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id — Toggle active, update role
router.patch('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
