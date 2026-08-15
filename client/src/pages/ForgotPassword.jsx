import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success(res.message || "Reset link generated.");
        setSubmitted(true);
        if (res.data?.resetToken) {
          setResetToken(res.data.resetToken);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process forgot password request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 group mb-6">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-600/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
              Civic<span className="text-sky-600">Connect</span>
            </span>
            <span className="text-[10px] text-sky-600 font-extrabold tracking-widest uppercase mt-1">
              SMART CITY PLATFORM
            </span>
          </div>
        </Link>

        <h2 className="text-center text-2xl font-extrabold text-slate-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-xs text-slate-600 max-w-xs mx-auto">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10">
          {submitted ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Sent Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Password reset instructions have been generated for <strong className="text-slate-800">{email}</strong>.
                </p>
              </div>

              {resetToken && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-left space-y-3">
                  <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs">
                    <KeyRound className="w-4 h-4 text-sky-600" />
                    <span>Reset Link Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Click the button below to proceed directly to the Password Reset page.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/reset-password/${resetToken}`)}
                    className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Reset Password</span>
                  </button>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gmail / Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
