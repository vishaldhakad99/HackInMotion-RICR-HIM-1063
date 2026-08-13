import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  MapPin,
  LayoutDashboard,
  Shield,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notificationService";

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch {
      // Ignore error
    }
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const dashboardPath = role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300">
              <Building2 className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 leading-none">
                  Civic<span className="text-blue-600">Connect</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1 flex items-center gap-1">
                <span>Smart City Portal</span>
              </span>
            </div>
          </Link>

          {/* Desktop Central Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === "/"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Home
            </Link>

            <Link
              to="/city-map"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                location.pathname === "/city-map"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              City Map
            </Link>

            {isAuthenticated && (
              <Link
                to={dashboardPath}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  location.pathname.startsWith("/admin") || location.pathname === "/dashboard"
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Report Issue CTA Button for Logged-In Citizens */}
            {isAuthenticated && role !== "admin" && (
              <Link
                to="/report-issue"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <PlusCircle className="w-4 h-4 text-blue-100 group-hover:rotate-90 transition-transform duration-300" />
                <span>Report Issue</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 relative">
                {/* Notifications Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserDropdownOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all relative ${
                      notificationsOpen
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-100 border-slate-200/80 bg-slate-50/50"
                    }`}
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-blue-600" />
                          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Notifications</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                          {unreadCount} unread
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs font-medium text-slate-400">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkRead(n._id)}
                              className={`p-3.5 text-xs cursor-pointer hover:bg-slate-50/80 transition-all ${
                                !n.isRead ? "bg-blue-50/40" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-slate-800 leading-tight">{n.title}</p>
                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-0.5"></span>
                                )}
                              </div>
                              <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-1.5 pl-2 rounded-xl border transition-all ${
                      userDropdownOpen
                        ? "bg-slate-100 border-blue-300"
                        : "border-slate-200/80 hover:border-blue-300/80 bg-slate-50/60 hover:bg-white shadow-xs"
                    }`}
                  >
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name || "User Avatar"}
                          className="w-8 h-8 rounded-lg object-cover shadow-xs border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>

                    <div className="text-left hidden lg:block pr-1">
                      <p className="text-xs font-extrabold text-slate-900 leading-none">{user?.name || "User"}</p>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
                        {user?.role === "admin" ? "Admin" : "Citizen"}
                      </span>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180 text-blue-600" : ""}`} />
                  </button>

                  {/* Profile Popover Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                        <p className="text-xs font-black text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-extrabold rounded-full border border-blue-200/60 uppercase tracking-wider">
                          {user?.role === "admin" ? <Shield className="w-3 h-3 text-emerald-500" /> : <User className="w-3 h-3 text-blue-500" />}
                          {user?.role === "admin" ? "Administrator" : "Citizen User"}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={user?.role === "admin" ? "/admin/profile" : "/profile"}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition-all"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Profile
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Responsive Controls */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200/80 shadow-xs active:scale-95 transition-all"
                title="Toggle Sidebar Navigation Menu"
                aria-label="Toggle Sidebar Menu"
              >
                <MoreVertical className="w-5 h-5 text-slate-700" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Toggle Header Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
          >
            Home
          </Link>
          <Link
            to="/city-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
          >
            City Map
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                Dashboard
              </Link>
              {role !== "admin" && (
                <Link
                  to="/report-issue"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm"
                >
                  + Report Issue
                </Link>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-800 border border-slate-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 rounded-xl shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
