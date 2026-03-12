# 📚 Knowledge Vault

> **Pakistan's #1 Digital Library Platform** — A full-stack MERN application with AI recommendations, PDF downloads, Stripe payments, and Cloudinary file uploads.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![License](https://img.shields.io/badge/license-MIT-purple)

---

## 🌐 Live Demo

| Service | URL |
|--------|-----|
| 🖥️ Frontend | `https://knowledge-vault.vercel.app` |
| ⚙️ Backend API | `https://knowledge-vault.up.railway.app/api` |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**Knowledge Vault** is a modern digital library platform where users can:
- Browse and search thousands of books
- Download PDFs directly in the browser
- Get AI-powered book recommendations
- Subscribe to premium plans via Stripe payments
- Admins can manage books with Cloudinary file uploads

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT Authentication
- ✅ Browse all books with search & filter
- ✅ Download free PDFs directly in browser
- ✅ AI-powered book recommendations (based on history + genre)
- ✅ View trending/popular books
- ✅ Subscribe to Monthly ($5) or Yearly ($40) plans
- ✅ Forgot Password via email reset link

### 👑 Admin Features
- ✅ Add books with cover image + PDF (Cloudinary)
- ✅ Delete books
- ✅ View all books in grid layout
- ✅ Mark books as Free or Premium

### 🤖 AI Recommendation Engine
- ✅ Analyzes user's download history
- ✅ Scores books based on genre preference
- ✅ Boosts popular books by download count
- ✅ Falls back to popular books for new users

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM (Object Data Modeling) |
| JWT | Authentication |
| Bcryptjs | Password Hashing |
| Cloudinary | Image & PDF Storage |
| Multer | File Upload Middleware |
| Nodemailer | Email Service |
| Stripe | Payment Processing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI Framework |
| Redux Toolkit | State Management |
| React Router | Client-side Routing |
| Axios | HTTP Requests |
| React Toastify | Notifications |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│                     localhost:3000                           │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │   Home   │  │Dashboard │  │  Admin   │  │  Subs.   │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                        │                                     │
│                   Redux Store                                │
│                  (Auth State)                                │
└─────────────────────────────┬───────────────────────────────┘
                              │ Axios + Bearer Token
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                        │
│                     localhost:5000                            │
│                                                              │
│   ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│   │  /api/auth   │  │  /api/books │  │   /api/payment   │  │
│   │  - register  │  │  - GET all  │  │  - checkout      │  │
│   │  - login     │  │  - POST add │  │  - verify        │  │
│   │  - forgot    │  │  - DELETE   │  └──────────────────┘  │
│   │  - reset     │  └─────────────┘                        │
│   └──────────────┘                                          │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                    /api/ai                           │  │
│   │   - /recommendations  - /popular  - /download/:id   │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│   ┌──────────────┐  Middleware  ┌──────────────────────┐   │
│   │  authMiddle  │─────────────▶│  protect + adminOnly │   │
│   └──────────────┘              └──────────────────────┘   │
└──────────────┬───────────────────────┬──────────────────────┘
               │                       │
               ▼                       ▼
┌──────────────────────┐  ┌─────────────────────────────────┐
│   MongoDB Database   │  │      External Services           │
│                      │  │                                  │
│  ┌────────────────┐  │  │  ☁️  Cloudinary (Images + PDFs) │
│  │   Users        │  │  │  💳  Stripe (Payments)           │
│  │   Books        │  │  │  📧  Gmail (Nodemailer)          │
│  └────────────────┘  │  └─────────────────────────────────┘
└──────────────────────┘
```

---

## 📁 Folder Structure

```
knowledge-vault/
│
├── backend/                          ← Node.js + Express Server
│   ├── config/
│   │   └── cloudinary.js             ← Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js         ← Register, Login, Reset Password
│   │   ├── bookController.js         ← CRUD operations for books
│   │   ├── paymentController.js      ← Stripe checkout + verify
│   │   └── recommendationController.js ← AI engine + download
│   ├── middleware/
│   │   └── authMiddleware.js         ← JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js                   ← User schema
│   │   └── Book.js                   ← Book schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── recommendationRoutes.js
│   ├── utils/
│   │   └── sendEmail.js              ← Nodemailer email sender
│   ├── .env                          ← Environment variables
│   ├── server.js                     ← Entry point
│   └── package.json
│
└── frontend/
    └── frontend/                     ← React App
        └── src/
            ├── pages/
            │   ├── Home.jsx
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   ├── Dashboard.jsx     ← Books + AI + Download
            │   ├── AdminDashboard.jsx
            │   ├── ForgotPassword.jsx
            │   ├── ResetPassword.jsx
            │   ├── Subscription.jsx  ← Stripe plans
            │   └── PaymentSuccess.jsx
            ├── redux/
            │   ├── store.js
            │   └── slices/
            │       └── authSlice.js
            ├── utils/
            │   └── axios.js          ← Auto token injection
            └── App.js                ← All routes
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name:             String (required),
  email:            String (required, unique),
  password:         String (hashed),
  role:             String (user / admin),
  subscription:     String (free / monthly / yearly),
  downloadHistory:  [{ book: ObjectId, downloadedAt: Date }],
  resetToken:       String,
  resetTokenExpiry: Date,
  createdAt:        Date
}
```

### Book Model
```javascript
{
  title:         String (required),
  author:        String (required),
  description:   String,
  genre:         String,
  category:      String,
  language:      String,
  pages:         Number,
  coverImage:    String (Cloudinary URL),
  pdfFile:       String (Cloudinary URL),
  isPremium:     Boolean,
  downloadCount: Number,
  addedBy:       ObjectId (ref: User),
  createdAt:     Date
}
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/forgot-password` | Send reset email | ❌ |
| POST | `/reset-password/:token` | Reset password | ❌ |

### Book Routes — `/api/books`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all books | ❌ |
| GET | `/:id` | Get single book | ❌ |
| POST | `/` | Add new book | ✅ Admin |
| PUT | `/:id` | Update book | ✅ Admin |
| DELETE | `/:id` | Delete book | ✅ Admin |

### AI Routes — `/api/ai`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/recommendations` | AI book picks | ✅ User |
| GET | `/popular` | Popular books | ❌ |
| POST | `/download/:id` | Download book | ✅ User |

### Payment Routes — `/api/payment`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-checkout` | Stripe checkout | ✅ User |
| POST | `/verify` | Verify payment | ✅ User |

---

## 🤖 AI Recommendation Flow

```
User Downloads Book
        │
        ▼
Save to downloadHistory
        │
        ▼
Extract genres from history
        │
        ▼
Score all books:
  ┌─────────────────────────────┐
  │ Genre match    → +10 points │
  │ Download count → +2 points  │
  │ Free book      → +5 points  │
  └─────────────────────────────┘
        │
        ▼
Sort by score → Top 6 books
        │
        ▼
Return recommendations
        │
(If no history → Return popular books)
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/knowledge-vault.git
cd knowledge-vault
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (see Environment Variables below)

```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend/frontend
npm install
npm start
# App running on http://localhost:3000
```

### 4. Set Admin Role
Open MongoDB Compass or shell:
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/knowledge-vault

# JWT
JWT_SECRET=your_super_secret_key

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🚀 Deployment

### Backend → Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Set Root Directory: `backend`
4. Add all environment variables
5. Deploy!

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import GitHub repo
3. Set Root Directory: `frontend/frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-url.up.railway.app/api
   ```
5. Deploy!

### Database → MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in Railway

---

## 🗺️ App Routes

```
/                      → Home Page
/login                 → Login
/register              → Register
/dashboard             → User Dashboard (protected)
/admin                 → Admin Dashboard (admin only)
/forgot-password       → Forgot Password
/reset-password/:token → Reset Password
/subscription          → Subscription Plans
/payment-success       → Payment Success
```

---

## 💳 Subscription Plans

| Plan | Price | Features |
|------|-------|---------|
| 🆓 Free | $0/forever | 50 free books, basic search |
| 📚 Monthly | $5/month | Unlimited books, PDF download, AI recommendations |
| 🏆 Yearly | $40/year | All monthly features + priority support (Save 33%) |

---

## 👨‍💻 Developer

**Hamza Khan** **muhammad saad shakeel** && **Ilham Raza**
- Stack: MERN (MongoDB, Express, React, Node.js)
- Built: 2026

---

## 📄 License

This project is licensed under the MIT License.

---

> Built with ❤️ using MERN Stack — Knowledge Vault 2026