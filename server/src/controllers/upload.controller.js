import { successResponse, errorResponse } from "../utils/response.js";


export const uploadImage = async (req, res) => {
  try {
    const protocol = req.protocol;
    const host = req.get("host");

    if (req.file) {
      const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      const relativeUrl = `/uploads/${req.file.filename}`;
      return successResponse(res, 200, "Image uploaded successfully", {
        url: imageUrl,
        path: relativeUrl,
        filename: req.file.filename,
      });
    }

    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => ({
        url: `${protocol}://${host}/uploads/${file.filename}`,
        path: `/uploads/${file.filename}`,
        filename: file.filename,
      }));
      return successResponse(res, 200, "Images uploaded successfully", {
        images: uploadedFiles,
      });
    }

    return errorResponse(res, 400, "No image file provided");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
