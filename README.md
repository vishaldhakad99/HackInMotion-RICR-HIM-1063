# CivicConnect — Smart City Issue Reporting & Resolution Platform 🏙️

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev)
[![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20RateLimit%20%7C%20NoSQL%20Sanitized-emerald.svg)](#security--production-hardening)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

**CivicConnect** is an enterprise-grade, full-stack Smart City Civic Tech platform designed for citizens to report civic infrastructure issues (potholes, streetlights, garbage, water leaks, public safety hazards) with real-time GPS geolocation, interactive live maps, evidence photo uploads, and automated department routing. Administrators gain real-time analytics, automated issue assignment, status management, and audit timeline tracking.

---

## 🌟 Key Features

### 👤 Citizen Portal
- **Interactive Live Location Map**: Real-time GPS location tracking powered by Leaflet and CartoDB Voyager tiles with user position markers, accuracy circles, and city autocomplete search suggestions.
- **Multi-Step Issue Reporting**: 5-step intuitive wizard including category selection, live map location picking, evidence photo capture/upload, priority tags, and duplicate issue detection.
- **Real-Time Issue Lifecycle & Upvoting**: Track issue statuses (`Reported`, `Acknowledged`, `In Progress`, `Resolved`, `Verified`, `Closed`, `Reopened`, `Rejected`) with community upvoting and comment discussions.
- **Account & Profile Management**: Profile avatar updates, role badges, and a complete secure **Forgot Password** & **Reset Password** workflow.

### 🛡️ Administrator & Official Portal
- **Centralized Admin Dashboard**: High-level KPI metrics (Total Issues, Pending, In Progress, Resolved, Critical Alerts).
- **Automated Department Assignment**: Department routing engine to route issues to specific city departments (Roads & Transport, Sanitation, Water Works, Electricity, Parks & Public Safety).
- **Interactive Analytics & Hotspots**: Visual charts for department performance, category breakdown, resolution response times, and civic hotspot identification.
- **User Directory & RBAC**: Real-time user management highlighting active administrative sessions.

---

## 🔒 Security & Production Hardening

The platform implements multi-layer backend and frontend security controls adhering to OWASP web security recommendations:

1. **HTTP Security Headers (`Helmet`)**: Protection against Cross-Site Scripting (XSS), Clickjacking, MIME Sniffing, and Referrer leakage via `helmet()` security headers.
2. **Rate Limiting (`express-rate-limit`)**:
   - **General API Limiter**: Max 200 requests per 15-minute window on all `/api/` endpoints to mitigate DDoS and web scraping attacks.
   - **Authentication Limiter**: Max 20 requests per 15-minute window on `/api/auth/login` and `/api/auth/forgot-password` to prevent brute-force credential stuffing.
3. **NoSQL Query Injection Prevention (`sanitizeInput`)**: Custom recursive middleware neutralizing dollar signs (`$`) and dots (`.`) in `req.body`, `req.query`, and `req.params` to prevent MongoDB operator injection.
4. **Role-Based Access Control (RBAC)**: Strict server-side route guards (`protect` & `authorizeRoles("admin")`) guaranteeing administrative actions cannot be accessed by unauthorized users.
5. **Secure Authentication & Token Management**:
   - Password hashing using `bcryptjs` with salt rounds.
   - JSON Web Tokens (JWT) signed with secret keys and automatic client-side 401 expiration handling.
   - Password reset tokens generated with `crypto.randomBytes(20)` and stored as SHA-256 hashes with 30-minute expiration timestamps.
6. **Strict CORS Policy**: Configured cross-origin policy allowing credentials for verified frontend origin URLs.
7. **Environment Variable Isolation**: Secret keys, MongoDB connection strings, and Cloudinary credentials isolated in `.env` files protected by `.gitignore`.

---




## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, React Leaflet, React Router DOM v7 |
| **Backend** | Node.js, Express.js v5, Mongoose v9, MongoDB Atlas |
| **Mapping & GIS** | Leaflet, CartoDB Voyager Basemaps, Photon Geocoding API, HTML5 Geolocation API |
| **Security** | Helmet, Express Rate Limit, Bcrypt.js, JSON Web Tokens (JWT), Crypto |
| **Media Uploads** | Multer, Cloudinary API, HTML5 Canvas / Camera Capture |
| **Code Quality** | Oxlint, ESLint |

---

## 📁 Repository Structure

```
HackInMotion-RICR-HIM-1063/
├── .gitignore                   # Root git ignore configuration
├── README.md                    # Project documentation
├── client/                      # Frontend React 19 Application
│   ├── src/
│   │   ├── components/          # Reusable UI components (MapView, Navbar, Sidebar, etc.)
│   │   ├── context/             # React AuthContext state provider
│   │   ├── pages/               # Page views (Landing, CityMap, CitizenDashboard, AdminDashboard, etc.)
│   │   ├── services/            # API services (issueService, authService, userService, analyticsService)
│   │   ├── utils/               # Constants and helper functions
│   │   ├── App.jsx              # Application router & routes
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js
└── server/                      # Backend Node.js / Express API
    ├── src/
    │   ├── config/              # DB connection & Cloudinary config
    │   ├── controllers/         # API controllers (auth, issue, admin, department, analytics)
    │   ├── middleware/          # Security, Auth Guard, Error, Upload middlewares
    │   ├── models/              # Mongoose models (User, Issue, Department, Notification)
    │   ├── routes/              # API route definitions
    │   └── seed.js              # Database seeder script
    ├── index.js                 # Server entry point
    └── package.json
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd server
npm install
```

Create a `server/.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/civic_connect
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

Seed initial database data (departments, admin, sample issues):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal tab:
```bash
cd client
npm install
```

Create a `client/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your web browser.

---

## 🧪 Testing & Code Quality

### Client Linter Verification
```bash
cd client
npx oxlint
```

### Server Linter Verification
```bash
cd server
npx oxlint
```

### Production Build Verification
```bash
cd client
npm run build
```

---

## 👥 Development Team

- **Vishal Dhakad** (Team Lead & Full-Stack Developer)
- **Dikesh Choure** (Frontend & UI/UX Developer)
- **Devendra Bankhede** (Backend & API Developer)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
