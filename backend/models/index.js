const mongoose = require('mongoose');

// ── Contact / Enquiry ──
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, lowercase: true },
  phone:   { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  repliedAt: Date,
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ── Event ──
const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date:        { type: Date, required: true },
  endDate:     { type: Date },
  location:    { type: String },
  category:    { type: String, enum: ['academic', 'cultural', 'sports', 'holiday', 'admission', 'exam', 'other'], default: 'other' },
  image:       { type: String },
  isPublished: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:        [String],
}, { timestamps: true });

// ── News / Announcement ──
const newsSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  content:     { type: String, required: true },
  excerpt:     { type: String },
  image:       { type: String },
  category:    { type: String, enum: ['news', 'announcement', 'achievement', 'circular'], default: 'news' },
  isPublished: { type: Boolean, default: true },
  isPinned:    { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:        [String],
  views:       { type: Number, default: 0 },
}, { timestamps: true });

// ── Fee Payment ──
const feeSchema = new mongoose.Schema({
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName:    { type: String, required: true },
  grade:          { type: String, required: true },
  academicYear:   { type: String, required: true },
  feeType:        { type: String, enum: ['tuition', 'transport', 'activity', 'exam', 'other'], required: true },
  amount:         { type: Number, required: true },
  dueDate:        { type: Date },
  paidAt:         { type: Date },
  status:         { type: String, enum: ['pending', 'paid', 'overdue', 'partial', 'waived'], default: 'pending' },
  paymentMethod:  { type: String, enum: ['online', 'cash', 'cheque', 'dd'], default: 'online' },
  transactionId:  { type: String },
  razorpayOrderId:  { type: String },
  razorpayPaymentId:{ type: String },
  receipt:        { type: String },
  remarks:        { type: String },
  collectedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = {
  Contact: mongoose.model('Contact', contactSchema),
  Event:   mongoose.model('Event',   eventSchema),
  News:    mongoose.model('News',    newsSchema),
  Fee:     mongoose.model('Fee',     feeSchema),
};
