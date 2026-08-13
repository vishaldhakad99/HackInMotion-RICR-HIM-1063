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

<<<<<<< HEAD
const Department = mongoose.model("Department", departmentSchema);

=======
const Department = mongoose.model("Department", departmentSchema)
>>>>>>> 821e155c4c5879245d6afb87c0015b4fd12d72b0
export default Department;
