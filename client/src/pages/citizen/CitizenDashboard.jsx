import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  TrendingUp,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import toast from "react-hot-toast";

const CitizenDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getMyIssues({ limit: 10 });
      if (res.success && res.data?.issues) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (issueId) => {
    try {
      const res = await issueService.upvoteIssue(issueId);
      if (res.success) {
        toast.success(res.message || "Upvoted!");
        fetchMyIssues();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not process upvote.");
    }
  };

  // Calculate metrics
  const total = issues.length;
  const reported = issues.filter((i) => i.status === "Reported").length;
  const inProgress = issues.filter((i) => i.status === "In Progress" || i.status === "Acknowledged").length;
  const resolved = issues.filter((i) => i.status === "Resolved" || i.status === "Verified" || i.status === "Closed").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Citizen Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">Track and manage all your reported civic issues in real-time.</p>
            </div>

            <Link
              to="/report-issue"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Report New Issue
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Total Reports</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{total}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Reported</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{reported}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">In Progress</span>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{inProgress}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Resolved</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{resolved}</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">Your Recent Reports</h2>
              <Link to="/my-issues" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <Loader text="Fetching your reported issues..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchMyIssues} />
            ) : issues.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No reported issues yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Notice a pothole, uncollected waste, or broken streetlight? Report it now and help improve your neighborhood.
                </p>
                <Link
                  to="/report-issue"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Issue Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {issues.map((issue) => (
                  <IssueCard key={issue._id} issue={issue} onUpvote={handleUpvote} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
