import React, { useState, useRef } from "react";
import { User, Mail, Shield, Key, LogOut, CheckCircle2, Camera, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { issueService } from "../../services/issueService";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    try {
      setUploadingAvatar(true);
      const toastId = toast.loading("Uploading profile picture...");

      // 1. Upload file to server
      const uploadRes = await issueService.uploadImage(file);
      const avatarUrl = uploadRes.data?.url || uploadRes.data?.path;

      if (!avatarUrl) {
        toast.dismiss(toastId);
        toast.error("Failed to upload image.");
        setUploadingAvatar(false);
        return;
      }

      // 2. Persist avatar URL in user profile in DB
      const profileRes = await authService.updateProfile({ avatar: avatarUrl });

      if (profileRes.success) {
        updateUser({ avatar: avatarUrl });
        toast.dismiss(toastId);
        toast.success("Profile picture updated successfully!");
      } else {
        toast.dismiss(toastId);
        toast.error(profileRes.message || "Failed to update profile picture.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || err.message || "Upload failed.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true);
      const profileRes = await authService.updateProfile({ avatar: "" });
      if (profileRes.success) {
        updateUser({ avatar: "" });
        toast.success("Profile picture removed.");
      }
    } catch {
      toast.error("Failed to remove profile picture.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authService.updateProfile({ name, email });
      if (res.success) {
        updateUser({ name, email });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in password fields.");
      return;
    }

    try {
      const res = await authService.updateProfile({ password: newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(res.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.role === "admin" ? "Administrator Profile" : "User Profile"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your account credentials, avatar, and personal preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Avatar & Overview Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-5">
              {/* Avatar Box */}
              <div className="relative w-28 h-28 mx-auto group">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-xl shadow-blue-500/20 relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                  )}

                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                      <Loader2 className="w-7 h-7 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Overlay Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-[#0088cc] hover:bg-[#0077bb] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-2 border-white"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
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

              {/* Upload CTA Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0088cc] text-xs font-extrabold rounded-xl border border-sky-200 transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Profile Photo</span>
                </button>

                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="w-full py-2 text-rose-600 hover:text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Edit Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
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

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    {saving ? "Saving..." : "Save Profile Changes"}
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
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Update Password
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
