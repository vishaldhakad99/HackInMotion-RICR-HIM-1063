import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Building2, Eye, EyeOff, Lock, Mail, UserCheck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    rememberMe: false,
  });


  

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);
      if (res.success) {
        toast.success(`Welcome back, ${res.data?.name || "User"}!`);
        const userRole = res.data?.role || formData.role;
        const redirectPath = userRole === "admin" ? "/admin" : "/dashboard";
        navigate(redirectPath);
      } else {
        toast.error(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 mb-6">
          <Link to="/" className="inline-flex items-center justify-center group">
            <div className="w-12 h-12 bg-[#0088cc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to CivicConnect</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Smart City Issue Reporting & Resolution Portal</p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Account Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "user" })}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
                    formData.role === "user"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition ${
                    formData.role === "admin"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="citizen@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); toast.error("Password reset functionality initialized."); }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign In as {formData.role === "admin" ? "Administrator" : "Citizen"}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">Quick Demo Logins</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ email: "citizen@example.com", password: "userpassword123", role: "user" })}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition text-center"
              >
                Demo Citizen
              </button>
              <button
                type="button"
                onClick={() => setFormData({ email: "admin@civic.gov.in", password: "adminpassword123", role: "admin" })}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition text-center"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {/* Footer Register Link */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
export default Login;



