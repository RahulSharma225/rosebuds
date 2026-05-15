const express = require('express');
const router = express.Router();
const { Fee } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

// GET /api/fees — Parent sees own child fees; Admin sees all
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { student: { $in: [req.user._id, ...req.user.children] } };
    const { status, academicYear } = req.query;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    const fees = await Fee.find(query).populate('student', 'name grade section').sort({ dueDate: 1 });
    res.json({ success: true, fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/fees — Admin creates fee record
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.create({ ...req.body, collectedBy: req.user._id });
    res.status(201).json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/fees/:id/create-order — Razorpay order
router.post('/:id/create-order', protect, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    if (fee.status === 'paid') return res.status(400).json({ success: false, message: 'Fee already paid' });

    // Razorpay order creation
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: Math.round(fee.amount * 100), // in paise
      currency: 'INR',
      receipt: `fee_${fee._id}`,
      notes: { feeId: fee._id.toString(), studentName: fee.studentName }
    });
    fee.razorpayOrderId = order.id;
    await fee.save();
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/fees/:id/verify-payment — Verify Razorpay signature
router.post('/:id/verify-payment', protect, async (req, res) => {
  try {
    const crypto = require('crypto');
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const sign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');
    if (expectedSign !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    const fee = await Fee.findByIdAndUpdate(req.params.id, {
      status: 'paid', paidAt: new Date(),
      razorpayPaymentId, transactionId: razorpayPaymentId,
    }, { new: true });
    res.json({ success: true, message: 'Payment verified and recorded!', fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/fees/:id — Admin update
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
