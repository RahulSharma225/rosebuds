require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Admission = require('./models/Admission');
const { Event, News } = require('./models/index');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Clear existing
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), News.deleteMany({}), Admission.deleteMany({})]);
  console.log('Cleared existing data');

  // Create Admin
  const admin = await User.create({
    name: 'School Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@rosebudspublicschool.edu',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    phone: '+91 98765 43210',
  });

  // Create sample events
  await Event.create([
    { title: 'Annual Day & Cultural Fest', description: 'A grand celebration of talent with performances, awards, and exhibitions.', date: new Date('2026-06-15'), category: 'cultural', location: 'School Auditorium', createdBy: admin._id },
    { title: 'Science Olympiad 2026', description: 'Inter-school science competition for budding scientists.', date: new Date('2026-06-22'), category: 'academic', location: 'Science Block', createdBy: admin._id },
    { title: 'Open House Day 2026–27', description: 'Visit campus, meet faculty, and get admissions queries answered.', date: new Date('2026-07-01'), category: 'admission', location: 'Main Campus', createdBy: admin._id },
    { title: 'Annual Sports Day', description: 'Inter-house sports competition — track, field, and team events for all grades.', date: new Date('2026-07-20'), category: 'sports', location: 'Sports Ground', createdBy: admin._id },
  ]);

  // Create sample news
  await News.create([
    { title: 'Rose Buds Tops District Board Results', content: 'Our Grade 10 students achieved a remarkable 98.6% pass rate in the 2025–26 board examinations...', excerpt: 'Grade 10 achieves 98.6% pass rate in board exams', category: 'achievement', isPinned: true, createdBy: admin._id },
    { title: 'New Science Laboratory Inaugurated', content: 'The state-of-the-art science laboratory was inaugurated by the District Education Officer...', excerpt: 'State-of-the-art science lab now operational', category: 'news', createdBy: admin._id },
    { title: 'Admissions Open for 2026–27', content: 'Applications are now open for all grades from Pre-Nursery to Grade 9 for the academic year 2026–27...', excerpt: 'Apply now for the upcoming academic year', category: 'announcement', isPinned: true, createdBy: admin._id },
  ]);

  console.log('✅ Seed complete!');
  console.log(`Admin: ${process.env.ADMIN_EMAIL || 'admin@rosebudspublicschool.edu'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
