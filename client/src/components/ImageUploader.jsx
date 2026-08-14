import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Camera, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { issueService } from "../services/issueService";

const ImageUploader = ({ onImageUploaded, images = [], maxFiles = 3 }) => {
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Clean up camera stream tracks when modal closes or component unmounts
  const stopStreamTracks = (activeStream = stream) => {
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };

  const startCamera = async (mode = facingMode) => {
    setCameraLoading(true);
    setCameraError(null);

    // Stop current stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera access is not supported by your browser or environment.");
      setCameraLoading(false);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Could not access ideal camera facing mode, trying fallback...", err);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (fallbackErr) {
        console.error("Camera access failed:", fallbackErr);
        setCameraError("Camera access denied or device unavailable. Please check system permissions.");
      }
    } finally {
      setCameraLoading(false);
    }
  };

  useEffect(() => {
    if (showCamera) {
      startCamera(facingMode);
    } else {
      stopStreamTracks();
    }
    return () => {
      stopStreamTracks();
    };
  }, [showCamera]);

  const handleCloseCamera = () => {
    stopStreamTracks();
    setShowCamera(false);
    setCameraError(null);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const uploadSingleFile = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds maximum size of 10MB.`);
      return;
    }

    try {
      setUploading(true);
      const res = await issueService.uploadImage(file);
      if (res.success && res.data?.url) {
        onImageUploaded([...images, res.data.url]);
        toast.success("Image added successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    for (const file of files) {
      await uploadSingleFile(file);
    }

    // Reset input
    e.target.value = "";
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !stream) {
      toast.error("Camera stream not ready.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Failed to capture image snapshot.");
          return;
        }

        const capturedFile = new File([blob], `camera_photo_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        handleCloseCamera();
        await uploadSingleFile(capturedFile);
      },
      "image/jpeg",
      0.92
    );
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onImageUploaded(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      {images.length < maxFiles && (
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-bold text-slate-800">
                {uploading ? "Uploading photo..." : "Add Evidence Photos"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Upload images from your device or use your camera directly ({images.length}/{maxFiles} attached)
              </p>
            </div>

            {!uploading && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Browse Files
                </button>

                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  Open Camera
                </button>
              </div>
            )}
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

      {/* Camera Capture Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-slate-100">Live Camera Access</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Switch Camera (Front/Back)"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Feed */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraError ? "hidden" : "block"}`}
              />

              {cameraLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-2">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <span className="text-xs font-semibold text-slate-300">Initializing Camera...</span>
                </div>
              )}

              {cameraError && (
                <div className="p-6 text-center space-y-3">
                  <p className="text-xs text-rose-400 font-semibold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    Use Device Native Camera Instead
                  </button>
                </div>
              )}
            </div>

            {/* Shutter Action */}
            {!cameraError && (
              <div className="flex flex-col items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={cameraLoading || !stream}
                  className="w-14 h-14 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 rounded-full shadow-lg flex items-center justify-center transition active:scale-95 ring-4 ring-white/20"
                >
                  <Camera className="w-6 h-6 text-slate-900" />
                </button>
                <span className="text-[11px] font-semibold text-slate-400">Tap button to snap photo</span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

