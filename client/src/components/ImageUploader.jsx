import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { issueService } from "../services/issueService";

const ImageUploader = ({ onImageUploaded, images = [], maxFiles = 3 }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds maximum size of 10MB.`);
        continue;
      }

      try {
        setUploading(true);
        const res = await issueService.uploadImage(file);
        if (res.success && res.data?.url) {
          onImageUploaded([...images, res.data.url]);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to upload image.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onImageUploaded(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      {images.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            uploading
              ? "border-blue-300 bg-blue-50/50"
              : "border-slate-300 hover:border-blue-500 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Upload className="w-6 h-6" />
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {uploading ? "Uploading photo..." : "Click or Drag & Drop photo here"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WEBP, GIF up to 10MB ({images.length}/{maxFiles} uploaded)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
