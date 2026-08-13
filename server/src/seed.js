import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Department from "./models/department.model.js";
import Issue from "./models/issue.model.js";
import Notification from "./models/notification.model.js";

dotenv.config();

const defaultDepartments = [
  {
    name: "Roads & Infrastructure",
    code: "ROADS",
    description: "Responsible for road repairs, pothole filling, pavement maintenance, and bridges.",
    headName: "Vikram Malhotra",
    contactEmail: "roads@civic.gov.in",
    icon: "road",
  },
  {
    name: "Sanitation & Waste Management",
    code: "SAN",
    description: "Manages garbage collection, street cleaning, dumpsters, and waste disposal.",
    headName: "Anita Sharma",
    contactEmail: "sanitation@civic.gov.in",
    icon: "trash-2",
  },
  {
    name: "Water Supply & Drainage",
    code: "WATER",
    description: "Handles water pipeline leaks, drainage overflow, sewage issues, and water supply.",
    headName: "Rajesh Kumar",
    contactEmail: "water@civic.gov.in",
    icon: "droplet",
  },
  {
    name: "Electricity & Street Lighting",
    code: "ELEC",
    description: "Responsible for non-functional streetlights, damaged electric poles, and exposed wiring.",
    headName: "Suresh Verma",
    contactEmail: "electricity@civic.gov.in",
    icon: "zap",
  },
  {
    name: "Parks & Recreation",
    code: "PARK",
    description: "Maintains public parks, tree pruning, playground equipment, and green spaces.",
    headName: "Pooja Mehta",
    contactEmail: "parks@civic.gov.in",
    icon: "tree",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Seed Departments
    for (const deptData of defaultDepartments) {
      await Department.findOneAndUpdate(
        { code: deptData.code },
        deptData,
        { upsert: true, new: true }
      );
    }
    console.log("Departments seeded.");

    const roadsDept = await Department.findOne({ code: "ROADS" });
    const sanDept = await Department.findOne({ code: "SAN" });
    const waterDept = await Department.findOne({ code: "WATER" });
    const elecDept = await Department.findOne({ code: "ELEC" });

    // Seed Admin User
    let admin = await User.findOne({ email: "admin@civic.gov.in" });
    if (!admin) {
      admin = await User.create({
        name: "Civic Admin",
        email: "admin@civic.gov.in",
        password: "adminpassword123",
        role: "admin",
      });
      console.log("Admin user created.");
    }

    // Seed Demo User
    let user = await User.findOne({ email: "citizen@example.com" });
    if (!user) {
      user = await User.create({
        name: "Rahul Citizen",
        email: "citizen@example.com",
        password: "userpassword123",
        role: "user",
      });
      console.log("Demo user created.");
    }

    // Seed Demo Issues if none exist
    const issueCount = await Issue.countDocuments();
    if (issueCount === 0) {
      const sampleIssues = [
        {
          title: "Large Pothole on MG Road Near Metro Station",
          description: "A severe pothole has formed causing heavy traffic slowdown and risk of accidents for two-wheelers.",
          category: "Roads & Infrastructure",
          department: roadsDept._id,
          location: {
            address: "MG Road Signal, Sector 14",
            city: "Mumbai",
            latitude: 19.076,
            longitude: 72.8777,
            zipCode: "400001",
          },
          status: "In Progress",
          priority: "High",
          reportedBy: user._id,
          upvotes: [user._id, admin._id],
          upvoteCount: 2,
        },
        {
          title: "Garbage Overflowing at Community Park Corner",
          description: "Waste has not been collected for 4 days. Strong odor and stray dogs causing problems.",
          category: "Sanitation & Waste Management",
          department: sanDept._id,
          location: {
            address: "Park Avenue Gate 2",
            city: "Mumbai",
            latitude: 19.082,
            longitude: 72.885,
            zipCode: "400002",
          },
          status: "Reported",
          priority: "Medium",
          reportedBy: user._id,
          upvotes: [user._id],
          upvoteCount: 1,
        },
        {
          title: "Major Water Pipe Leakage on Pipeline Road",
          description: "Clean drinking water is being wasted rapidly from a burst underground pipe joint.",
          category: "Water Supply & Drainage",
          department: waterDept._id,
          location: {
            address: "Pipeline Road, Block B",
            city: "Mumbai",
            latitude: 19.09,
            longitude: 72.89,
            zipCode: "400003",
          },
          status: "Resolved",
          priority: "Critical",
          reportedBy: user._id,
          upvotes: [admin._id],
          upvoteCount: 1,
          resolution: {
            details: "Repaired pipeline joint and restored water supply valve.",
            resolvedBy: admin._id,
            resolvedAt: new Date(),
          },
        },
        {
          title: "Streetlight Malfunction on 5th Cross Road",
          description: "Three consecutive streetlights are out making the stretch dark and unsafe at night.",
          category: "Electricity & Street Lighting",
          department: elecDept._id,
          location: {
            address: "5th Cross Road, Sector 3",
            city: "Mumbai",
            latitude: 19.065,
            longitude: 72.865,
            zipCode: "400004",
          },
          status: "Reported",
          priority: "Medium",
          reportedBy: user._id,
          upvotes: [],
          upvoteCount: 0,
        },
      ];

      await Issue.insertMany(sampleIssues);
      console.log("Sample issues seeded successfully.");
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
