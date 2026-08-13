import React from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = role === "admin";

  const citizenLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Report Issue", path: "/report-issue", icon: PlusCircle },
    { label: "My Issues", path: "/my-issues", icon: FileText },
    { label: "City Map", path: "/city-map", icon: MapPin },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Issues Management", path: "/admin/issues", icon: FileText },
    { label: "Departments", path: "/admin/departments", icon: Building2 },
    { label: "City Map", path: "/city-map", icon: MapPin },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Users List", path: "/admin/users", icon: UsersIcon },
    { label: "Admin Profile", path: "/admin/profile", icon: User },
  ];

  const links = isAdmin ? adminLinks : citizenLinks;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-lg hidden md:flex">
      <div className="space-y-6">
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="truncate">
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
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
