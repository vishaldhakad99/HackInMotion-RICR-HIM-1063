import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Upload single or multiple images to Cloudinary
// @route   POST /api/upload/image
// @access  Private / Public
export const uploadImage = async (req, res) => {
  try {
    // Single image upload
    if (req.file) {
      const imageUrl = req.file.path || req.file.secure_url;
      const publicId = req.file.filename || req.file.public_id;

      return successResponse(
        res,
        200,
        "Image uploaded successfully to Cloudinary",
        {
          url: imageUrl,
          path: imageUrl,
          filename: publicId,
          public_id: publicId,
        }
      );
    }

    // Multiple images upload
    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => {
        const imageUrl = file.path || file.secure_url;
        const publicId = file.filename || file.public_id;

        return {
          url: imageUrl,
          path: imageUrl,
          filename: publicId,
          public_id: publicId,
        };
      });

      return successResponse(
        res,
        200,
        "Images uploaded successfully to Cloudinary",
        {
          images: uploadedFiles,
        }
      );
    }

    // No image uploaded
    return errorResponse(res, 400, "No image file provided");
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return errorResponse(
      res,
      500,
      error.message || "Failed to upload image to Cloudinary"
    );
  }
};