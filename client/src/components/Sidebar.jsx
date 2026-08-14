import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  Bell,
  User,
  LogOut,
  Building2,
  BarChart3,
  Users as UsersIcon,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { issueService } from "../services/issueService";

const Sidebar = () => {
  const { user, role, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

      const uploadRes = await issueService.uploadImage(file);
      const avatarUrl = uploadRes.data?.url || uploadRes.data?.path;

      if (!avatarUrl) {
        toast.dismiss(toastId);
        toast.error("Failed to upload image.");
        setUploadingAvatar(false);
        return;
      }

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

  const isAdmin = role === "admin";

  const citizenLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Report Issue", path: "/report-issue", icon: PlusCircle },
    { label: "My Issues", path: "/my-issues", icon: FileText },
    { label: "Live Location Map", path: "/city-map", icon: MapPin },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Issues Management", path: "/admin/issues", icon: FileText },
    { label: "Departments", path: "/admin/departments", icon: Building2 },
    { label: "Live Location Map", path: "/city-map", icon: MapPin },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Users List", path: "/admin/users", icon: UsersIcon },
    { label: "Admin Profile", path: "/admin/profile", icon: User },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <>
      {/* Flow spacer so main content aligns beside fixed sidebar without overlap */}
      <div className="w-64 shrink-0 hidden md:block" aria-hidden="true" />

      <aside className="w-64 bg-slate-900 text-white fixed left-0 top-0 h-screen flex flex-col justify-between p-4 shrink-0 shadow-xl hidden md:flex z-50">
        <div className="space-y-5 flex-1 overflow-y-auto min-h-0 pr-1">
          {/* Sidebar Header with Brand Logo */}
          <Link to="/" className="flex items-center gap-3 px-2 py-1 group border-b border-slate-800/80 pb-4">
            <div className="w-9 h-9 bg-[#0088cc] rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                Civic<span className="text-[#0088cc]">Connect</span>
              </span>
              <span className="text-[8px] text-sky-400 font-extrabold tracking-widest uppercase mt-1">
                SMART CITY PLATFORM
              </span>
            </div>
          </Link>

          {/* User Info Header with Profile Photo Upload */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50">
            <div className="relative group shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow overflow-hidden relative border border-slate-600">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                )}

                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Camera Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0088cc] hover:bg-[#0077bb] text-white rounded-full flex items-center justify-center shadow-md border border-slate-900 transition-transform hover:scale-110 cursor-pointer"
                title="Upload profile photo"
              >
                <Camera className="w-3 h-3" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="truncate flex-1">
              <h4 className="text-xs font-bold text-slate-100 truncate">{user?.name}</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                {isAdmin ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : null}
                {isAdmin ? "Administrator" : "Citizen"}
              </span>
            </div>
          </div>

          {/* Links Navigation */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        

        {/* Footer Logout */}
        <div className="pt-4 mt-auto border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
          >
            
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
            
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

