# CivicConnect — Smart City Issue Reporting & Resolution Platform 🏙️

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev)
[![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20RateLimit%20%7C%20NoSQL%20Sanitized-emerald.svg)](#-security--production-hardening)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

**CivicConnect** is an enterprise-grade, full-stack Smart City Civic Tech platform designed to help citizens report civic infrastructure issues such as potholes, broken streetlights, garbage, water leaks, and public safety hazards.

The platform provides real-time GPS geolocation, interactive maps, evidence photo uploads, automated department routing, issue tracking, community interaction, and administrative analytics.

Administrators and authorized officials can manage reported issues, assign departments, monitor resolution progress, analyze civic hotspots, manage users, and track complete issue timelines.

---

## 🌟 Key Features

### 👤 Citizen Portal

- **Interactive Live Location Map**
  - Real-time GPS location tracking.
  - Leaflet-based interactive maps.
  - CartoDB Voyager basemap tiles.
  - User location markers.
  - Location accuracy circles.
  - City autocomplete search suggestions.

- **Multi-Step Issue Reporting**
  - 5-step issue reporting wizard.
  - Civic issue category selection.
  - Live map location selection.
  - Evidence photo capture/upload.
  - Priority selection.
  - Duplicate issue detection.

- **Real-Time Issue Lifecycle**
  - Track issue status throughout its lifecycle.
  - Supported statuses:
    - `Reported`
    - `Acknowledged`
    - `In Progress`
    - `Resolved`
    - `Verified`
    - `Closed`
    - `Reopened`
    - `Rejected`

- **Community Interaction**
  - Upvote civic issues.
  - Comment and discuss reported issues.
  - Follow issue progress.

- **Account & Profile Management**
  - Secure authentication.
  - Profile management.
  - Profile avatar/photo upload.
  - Role badges.
  - Secure Forgot Password workflow.
  - Secure Reset Password workflow.

---

### 🛡️ Administrator & Official Portal

- **Centralized Admin Dashboard**
  - Total Issues.
  - Pending Issues.
  - Issues In Progress.
  - Resolved Issues.
  - Critical Alerts.
  - Real-time dashboard statistics.

- **Automated Department Assignment**
  - Automatically routes issues to appropriate departments.
  - Supported departments include:
    - Roads & Transport.
    - Sanitation.
    - Water Works.
    - Electricity.
    - Parks & Public Safety.

- **Interactive Analytics**
  - Department performance charts.
  - Issue category breakdown.
  - Resolution response-time analysis.
  - Civic hotspot identification.
  - Issue statistics and trends.

- **User Directory & RBAC**
  - User management.
  - Role-based access control.
  - Administrative access protection.
  - Active administrative session monitoring.

---

## 🔒 Security & Production Hardening

CivicConnect implements multiple backend and frontend security controls following common OWASP web security practices.

### 1. HTTP Security Headers — Helmet

The application uses `helmet()` middleware to configure security-related HTTP headers.

Protection includes:

- Cross-Site Scripting (XSS) mitigation.
- Clickjacking protection.
- MIME sniffing protection.
- Referrer policy protection.
- Additional HTTP security headers.

---

### 2. Rate Limiting

The application uses `express-rate-limit` to protect APIs from excessive requests.

#### General API Limiter

- Maximum: **200 requests**
- Window: **15 minutes**
- Applied to `/api/` endpoints.

This helps reduce:

- API abuse.
- Excessive automated requests.
- Scraping.
- Basic denial-of-service attempts.

#### Authentication Limiter

Authentication-sensitive endpoints use a stricter rate limit:

- Maximum: **20 requests**
- Window: **15 minutes**

Applied to authentication-related operations such as:

- Login.
- Forgot Password.

This helps reduce brute-force and credential-stuffing attempts.

---

### 3. NoSQL Injection Prevention

CivicConnect includes custom `sanitizeInput` middleware.

The middleware recursively sanitizes:

- `req.body`
- `req.query`
- `req.params`

It neutralizes potentially dangerous MongoDB operators involving:

- `$`
- `.`

This helps prevent MongoDB/NoSQL operator injection attacks.

---

### 4. Role-Based Access Control — RBAC

Administrative routes are protected using server-side authorization middleware.

The application uses:

```text
protect
authorizeRoles("admin")