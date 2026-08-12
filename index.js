import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./scr/config/dbConnection.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

dbConnection();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Smart City Backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});