import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    headName: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "building",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
