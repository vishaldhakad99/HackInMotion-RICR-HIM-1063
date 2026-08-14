import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Upload single or multiple images to Cloudinary
// @route   POST /api/upload/image
// @access  Private / Public
export const uploadImage = async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = req.file.path || req.file.secure_url;
      const publicId = req.file.filename || req.file.public_id;
      return successResponse(res, 200, "Image uploaded successfully to Cloudinary", {
        url: imageUrl,
        path: imageUrl,
        filename: publicId,
        public_id: publicId,
      });
    }

    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => ({
        url: file.path || file.secure_url,
        path: file.path || file.secure_url,
        filename: file.filename || file.public_id,
        public_id: file.filename || file.public_id,
      }));
      return successResponse(res, 200, "Images uploaded successfully to Cloudinary", {
        images: uploadedFiles,
      });
    }

    return errorResponse(res, 400, "No image file provided");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

