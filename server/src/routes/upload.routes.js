import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Allow single file upload field 'image' or 'file', or fallback (Protected)
router.post(
  "/image",
  protect,
  (req, res, next) => {
    // Multer upload wrapper to handle single or multiple uploads gracefully
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Try 'file' field
        return upload.single("file")(req, res, (err2) => {
          if (err2) {
            return upload.array("images", 10)(req, res, (err3) => {
              if (err3) {
                return res.status(400).json({ success: false, message: err3.message });
              }
              next();
            });
          }
          next();
        });
      }
      next();
    });
  },
  uploadImage
);

export default router;
