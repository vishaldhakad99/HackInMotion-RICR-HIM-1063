import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";

import connectDB from "./config/dbConnection.js";
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use(errorMiddleware);

const runTests = async () => {
  await connectDB();
  
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5005, resolve));
  console.log("Test Server listening on port 5005...");

  const BASE_URL = "http://localhost:5005";

  let userToken = "";
  let adminToken = "";
  let createdIssueId = "";
  let departmentId = "";
  let notificationId = "";

  const results = [];

  const testReq = async (name, method, endpoint, body = null, token = null) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const opts = { method, headers };
      if (body) opts.body = JSON.stringify(body);

      const res = await fetch(`${BASE_URL}${endpoint}`, opts);
      const data = await res.json();

      const passed = res.ok && data.success !== false;
      results.push({ name, method, endpoint, status: res.status, passed, data });
      console.log(`[${passed ? "PASS" : "FAIL"}] ${method} ${endpoint} - Status: ${res.status}`);
      return { status: res.status, data };
    } catch (err) {
      console.error(`[FAIL] ${method} ${endpoint} - Error: ${err.message}`);
      results.push({ name, method, endpoint, status: 500, passed: false, error: err.message });
      return { status: 500, data: null };
    }
  };

  console.log("\n--- STARTING API ENDPOINT TESTS ---");

  // 1. AUTH
  const regEmail = `testuser_${Date.now()}@example.com`;
  await testReq("Register User", "POST", "/api/auth/register", {
    name: "Test User",
    email: regEmail,
    password: "password123",
  });

  const userLogin = await testReq("Login User", "POST", "/api/auth/login", {
    email: "citizen@example.com",
    password: "userpassword123",
  });
  userToken = userLogin.data?.data?.token;

  const adminLogin = await testReq("Login Admin", "POST", "/api/auth/login", {
    email: "admin@civic.gov.in",
    password: "adminpassword123",
  });
  adminToken = adminLogin.data?.data?.token;

  await testReq("Get Auth Me", "GET", "/api/auth/me", null, userToken);

  // 2. DEPARTMENTS
  const deptsRes = await testReq("Get Departments", "GET", "/api/departments");
  if (deptsRes.data?.data?.length > 0) {
    departmentId = deptsRes.data.data[0]._id;
  }
  if (departmentId) {
    await testReq("Get Department By ID", "GET", `/api/departments/${departmentId}`);
    await testReq("Get Department Issues", "GET", `/api/departments/${departmentId}/issues`);
  }

  // 3. ISSUES
  const newIssueRes = await testReq("Create Issue", "POST", "/api/issues", {
    title: "Broken Bench in Central Park",
    description: "The wooden bench near the main fountain is broken.",
    category: "Parks & Recreation",
    location: { address: "Central Park, Sector 5", city: "Mumbai" },
    priority: "Low",
  }, userToken);

  createdIssueId = newIssueRes.data?.data?._id;

  await testReq("Get Issues List", "GET", "/api/issues");
  await testReq("Get My Issues", "GET", "/api/issues/my", null, userToken);

  if (createdIssueId) {
    await testReq("Get Issue By ID", "GET", `/api/issues/${createdIssueId}`);
    await testReq("Update Issue", "PUT", `/api/issues/${createdIssueId}`, {
      title: "Broken Bench and Damaged Lamp Post in Central Park",
      priority: "Medium",
    }, userToken);

    await testReq("Upvote Issue", "POST", `/api/issues/${createdIssueId}/upvote`, null, userToken);
    await testReq("Verify Issue", "POST", `/api/issues/${createdIssueId}/verify`, {
      status: "verified",
      comment: "I saw this bench today, it is indeed broken.",
    }, userToken);
    await testReq("Verify Photo Issue", "POST", `/api/issues/${createdIssueId}/verify-photo`, {
      photoUrl: "/uploads/sample-bench.jpg",
      comment: "Attached photo of bench.",
    }, userToken);
  }

  // 4. ADMIN
  await testReq("Get Admin Dashboard", "GET", "/api/admin/dashboard", null, adminToken);
  await testReq("Get Admin Issues List", "GET", "/api/admin/issues", null, adminToken);
  if (createdIssueId) {
    await testReq("Get Admin Issue By ID", "GET", `/api/admin/issues/${createdIssueId}`, null, adminToken);
    await testReq("Update Issue Status (Admin)", "PUT", `/api/admin/issues/${createdIssueId}/status`, {
      status: "In Progress",
    }, adminToken);
    await testReq("Submit Resolution (Admin)", "POST", `/api/admin/issues/${createdIssueId}/resolution`, {
      details: "Bench has been repaired by municipal team.",
      proofPhotos: ["/uploads/repaired-bench.jpg"],
    }, adminToken);
  }

  if (createdIssueId) {
    await testReq("Reopen Issue", "POST", `/api/issues/${createdIssueId}/reopen`, {
      reason: "The bench legs are still wobbly after repair.",
    }, userToken);
  }

  // 5. ANALYTICS
  await testReq("Get Analytics Overview", "GET", "/api/analytics/overview");
  await testReq("Get Analytics Categories", "GET", "/api/analytics/categories");
  await testReq("Get Analytics Status", "GET", "/api/analytics/status");
  await testReq("Get Analytics Departments", "GET", "/api/analytics/departments");
  await testReq("Get Analytics Hotspots", "GET", "/api/analytics/hotspots");
  await testReq("Get Analytics Resolution Time", "GET", "/api/analytics/resolution-time");

  // 6. NOTIFICATIONS
  const notifRes = await testReq("Get User Notifications", "GET", "/api/notifications", null, userToken);
  if (notifRes.data?.data?.notifications?.length > 0) {
    notificationId = notifRes.data.data.notifications[0]._id;
    await testReq("Mark Notification Read", "PUT", `/api/notifications/${notificationId}/read`, null, userToken);
  }

  // SUMMARY
  const failed = results.filter((r) => !r.passed);
  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.length - failed.length} | FAILED: ${failed.length}`);
  console.log(`========================================\n`);

  server.close();
  process.exit(failed.length > 0 ? 1 : 0);
};

runTests();
