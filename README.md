# 🌹 Rose Buds Public School — MERN Stack Website

Full-stack school management website built with MongoDB, Express, React, Node.js.

## Project Structure
```
rosebuds/
├── backend/          ← Express API server
│   ├── models/       ← MongoDB schemas
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Auth middleware
│   ├── server.js     ← Entry point
│   └── seed.js       ← DB seeder
└── frontend/         ← React + Vite app
    └── src/
        ├── pages/    ← All page components
        ├── components/ ← Navbar, AdminLayout
        ├── context/  ← AuthContext
        └── utils/    ← Axios instance
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # Fill in your values
node seed.js             # Creates admin + sample data
npm run dev              # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env     # Set VITE_API_URL=http://localhost:5000/api
npm run dev              # Runs on http://localhost:5173
```

### 3. Admin Login
- URL: http://localhost:5173/admin
- Email: admin@rosebudspublicschool.edu
- Password: Admin@123

## Deployment
- **Backend** → Render.com (free tier)
- **Database** → MongoDB Atlas (free M0 cluster)
- **Frontend** → Vercel (free)

See the deployment guide in your chat for step-by-step instructions.

## Features
- 🌐 Public website (Home, About, Academics, Events, Contact)
- 📝 Online admission application with status tracking
- 👨‍👩‍👧 Parent/student login portal
- 💳 Fee payment via Razorpay
- 🔐 Admin panel: manage admissions, students, events, news, fees, enquiries
- 🔒 JWT authentication with role-based access
