const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  // Student Info
  studentName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  applyingForGrade: { type: String, required: true },
  previousSchool: { type: String, trim: true },
  previousGrade: { type: String },

  // Parent Info
  parentName: { type: String, required: true, trim: true },
  parentEmail: { type: String, required: true, lowercase: true },
  parentPhone: { type: String, required: true },
  parentOccupation: { type: String },
  relationship: { type: String, enum: ['father', 'mother', 'guardian'], default: 'father' },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  // Documents
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'under_review', 'shortlisted', 'accepted', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  statusNote: { type: String },

  // Admin fields
  interviewDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  applicationNumber: { type: String, unique: true },
  academicYear: { type: String, required: true },
  message: { type: String },
}, { timestamps: true });

// Auto-generate application number
admissionSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Admission').countDocuments();
    this.applicationNumber = `RB-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Admission', admissionSchema);
