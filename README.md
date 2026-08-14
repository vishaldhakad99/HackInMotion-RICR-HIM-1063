# CivicConnect — Smart City Civic Issue Reporting & Resolution Portal

![CivicConnect Header](https://img.shields.io/badge/CivicConnect-Smart%20Governance%20Platform-blue?style=for-the-badge&logo=building)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-Express%205-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-emerald?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)

**CivicConnect** is a state-of-the-art full-stack web application designed to streamline civic grievance redressal and municipal operations. It connects citizens directly with municipal departments (Roads & Infrastructure, Sanitation, Water Supply, Electricity, Public Property, etc.) for transparent issue reporting, real-time map pin-pointing, automated routing, duplicate complaint detection, photo evidence verification, and administrative analytics.

---

## 🌟 Key Features

### 👤 Citizen Portal
- **Guided 5-Step Issue Reporting**:
  1. **Category Selection**: Choose from color-coded municipal categories with domain icons.
  2. **Interactive Map Pinning**: Use Leaflet GPS maps to set exact latitude/longitude coordinates.
  3. **Photo Evidence Upload**: Attach clear site images to assist municipal inspection crews.
  4. **Urgency & Details**: Set priority level (*Low*, *Medium*, *High*, *Critical*) with title and description.
  5. **Duplicate Alert Check**: Pre-submission scan alerts users if a nearby ticket already exists, allowing them to upvote instead of creating duplicates.
- **Interactive City Map**: View all reported civic complaints across city wards with status markers (*Reported*, *In Progress*, *Resolved*, *Reopened*).
- **Citizen Dashboard & Issue Tracker**: Real-time status updates, department assignments, ticket timeline history, and resolution proof photos uploaded by repair crews.

### 🏢 Municipal Administrator Portal
- **Centralized Operations Dashboard**: High-level metrics showing Total Reports, Resolved Tickets, Resolution Rate, and Average Turnaround Days.
- **Department Management Queue**: Automated ticket routing to specialized municipal departments (Roads, Sanitation, Water, Electricity, Parks).
- **Recharts Data Analytics**: Interactive bar charts (Category Distribution), donut charts (Status Breakdown), and department turnaround ranking scorecards.
- **User Management & Role Protection**: Protected JWT authentication with distinct access controls for **Citizens** (`user`) and **Administrators** (`admin`).
- **Real-Time Notification Center**: Header bell dropdown notifying users and admins when tickets update.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8, React Router v7 |
| **Styling & UI** | TailwindCSS v4, Lucide React Icons, Glassmorphic Aesthetics |
| **Maps & Data Visualization** | Leaflet, React-Leaflet, Recharts |
| **HTTP & Notifications** | Axios, React Hot Toast |
| **Backend Framework** | Node.js (ES Modules), Express.js 5 |
| **Database & Auth** | MongoDB, Mongoose 9, JWT (JSON Web Tokens), BcryptJS |
| **File Handling** | Multer |

---

## 📁 Project Architecture

```
HackMotion/
├── client/                      # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # Shared UI components (Navbar, Sidebar, MapView, ImageUploader, etc.)
│   │   ├── config/             # API client base configuration
│   │   ├── context/            # AuthContext for session & role management
│   │   ├── pages/              # Main route views
│   │   │   ├── admin/          # Admin Dashboard, Admin Issues, Analytics, Departments, Users
│   │   │   ├── citizen/        # Citizen Dashboard, ReportIssue, MyIssues, IssueDetails, CityMap, Profile
│   │   │   ├── Landing.jsx     # High-impact homepage & statistics showcase
│   │   │   ├── Login.jsx       # User authentication login
│   │   │   ├── Register.jsx    # Citizen account registration
│   │   │   ├── PrivacyPolicy.jsx # Standalone Privacy Policy page
│   │   │   └── TermsOfService.jsx # Standalone Terms of Service page
│   │   ├── services/           # API integration service modules (issueService, analyticsService, etc.)
│   │   └── utils/              # Helper constants, status badges, formatters
│   ├── package.json
│   └── vite.config.js
│
└── server/                      # Backend Express 5 REST API
    ├── src/
    │   ├── config/             # Database connection (db.js)
    │   ├── controllers/        # Route logic (auth, issues, departments, analytics, notifications)
    │   ├── middleware/         # Auth & Role verification middleware (authMiddleware.js)
    │   ├── models/             # Mongoose schemas (User, Issue, Department, Notification)
    │   ├── routes/             # Express API endpoints
    │   └── seed.js             # Database seeder for demo data
    ├── uploads/                # Static storage for uploaded ticket evidence images
    ├── index.js                # Express app entry point
    └── package.json
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Connection URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/CivicConnect.git
cd CivicConnect
```

### 2. Backend Server Configuration
Navigate to the `server` directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicconnect________________
JWT_SECRET=civic_connect_super_secret___________2026
NODE_ENV=development
```

Seed initial municipal demo data (departments, admin account, sample citizen tickets):
```bash
npm run seed
```
Start the backend API server:
```bash
npm run dev
```
Backend API server will run on `http://localhost:5000`.

---

### 3. Frontend Client Configuration
In a new terminal window, navigate to the `client` directory:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```
Frontend Web Portal will open at `http://localhost:5173`.

---

## 🔑 Demo Test Credentials

| Portal Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Citizen User** | `user@civicconnect.gov.in` | `password123` | Report issues, pin GPS map location, track ticket status, upvote duplicate complaints |
| **Administrator** | `admin@civicconnect.gov.in` | `admin123` | Manage all city issues, reassign departments, update resolution statuses, upload fix proof photos, access Recharts analytics |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new citizen account.
- `POST /api/auth/login` — Authenticate user and issue JWT token.
- `GET /api/auth/me` — Retrieve current authenticated profile.

### Civic Issues (`/api/issues`)
- `GET /api/issues` — Fetch all reported issues (supports category, status, priority filtering).
- `POST /api/issues` — Submit a new civic issue ticket with GPS coords and evidence photos.
- `GET /api/issues/:id` — Get detailed ticket timeline & department assignment info.
- `PUT /api/issues/:id/status` — Update ticket status & upload proof photos (Admin only).
- `POST /api/issues/:id/upvote` — Upvote an existing duplicate ticket.
- `POST /api/issues/check-duplicate` — Check for nearby existing complaints.

### Analytics & Operations (`/api/analytics`, `/api/departments`)
- `GET /api/analytics/overview` — Get real-time municipal performance metrics.
- `GET /api/departments` — List active municipal departments and their turnaround statistics.

---

## 📜 License

This project is licensed under the **ISC License**. Developed for modern smart city governance.
