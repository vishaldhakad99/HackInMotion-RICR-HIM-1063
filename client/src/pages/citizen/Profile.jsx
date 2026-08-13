import React, { useState, useRef } from "react";
import { User, Key, Camera, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { issueService } from "../../services/issueService";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authService.updateProfile({ name, email, avatar });
      if (res.success) {
        updateUser(res.data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const uploadRes = await issueService.uploadImage(file);
      if (uploadRes.success && uploadRes.data?.url) {
        const uploadedUrl = uploadRes.data.url;
        setAvatar(uploadedUrl);

        // Update backend profile with new avatar
        const res = await authService.updateProfile({ avatar: uploadedUrl });
        if (res.success) {
          updateUser(res.data);
          toast.success("Profile photo updated successfully!");
        }
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in password fields.");
      return;
    }

    try {
      setSaving(true);
      const res = await authService.updateProfile({ password: newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error updating password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">User Profile</h1>
              <p className="text-xs text-slate-500 mt-1">Manage your account credentials, profile photo, and personal preferences.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Overview Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
              {/* Profile Photo Container */}
              <div className="relative w-28 h-28 mx-auto group">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={user?.name || "Profile Photo"}
                    className="w-28 h-28 rounded-3xl object-cover shadow-lg shadow-blue-500/20 border-2 border-white ring-2 ring-blue-500/30"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-4xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                {/* Upload Button Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-slate-900/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs cursor-pointer disabled:cursor-not-allowed"
                  title="Upload profile photo"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-white" />
                      <span className="text-[10px] font-bold">Change Photo</span>
                    </>
                  )}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{user?.name}</h3>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  {user?.role === "admin" ? "Administrator" : "Citizen User"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Uploading Photo...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Upload Profile Photo</span>
                  </>
                )}
              </button>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Edit Profile */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo URL (Optional)</label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/photo.jpg or click Upload above"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                    <span>Save Profile Changes</span>
                  </button>
                </form>
              </div>

              {/* Security / Password */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  Security & Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                    <span>Update Password</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
