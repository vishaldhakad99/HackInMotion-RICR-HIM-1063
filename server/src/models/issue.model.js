import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    location: {
      address: { type: String, default: "" },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      city: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["Reported", "In Progress", "Resolved", "Closed", "Rejected", "Reopened"],
      default: "Reported",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    verifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["verified", "flagged"], default: "verified" },
        photoUrl: { type: String, default: "" },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    verificationCount: {
      type: Number,
      default: 0,
    },
    verifyPhotos: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        photoUrl: { type: String, required: true },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reopenHistory: [
      {
        reopenedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, required: true },
        reopenedAt: { type: Date, default: Date.now },
      },
    ],
    resolution: {
      details: { type: String, default: "" },
      proofPhotos: [{ type: String }],
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      resolvedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
