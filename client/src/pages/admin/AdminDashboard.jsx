import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { formatDate } from "../../utils/helpers";

const AdminDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getAdminDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      } else {
        setError(res.message || "Failed to load admin dashboard.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to admin dashboard endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const metrics = dashboardData?.metrics || {
    totalIssues: 0,
    statusCounts: { reported: 0, inProgress: 0, resolved: 0, reopened: 0 },
    priorityCounts: { critical: 0 },
  };

  const recentIssues = dashboardData?.recentIssues || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Admin Operations Portal</span>
              </div>
              <h1 className="text-2xl font-extrabold">Administrator Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Overview of city-wide complaint queues and departmental turnaround performance.</p>
            </div>

            <Link
              to="/admin/issues"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Manage Issue Queue
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading administrative dashboard metrics..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboard} />
          ) : (
            <>
              {/* Dashboard Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">Total Issues</span>
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{metrics.totalIssues}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">Pending Issues</span>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{metrics.statusCounts?.reported || 0}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">In Progress</span>
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{metrics.statusCounts?.inProgress || 0}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold">Critical Issues</span>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-black text-red-600">{metrics.priorityCounts?.critical || 0}</p>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-900">Recent Reported Issues Queue</h2>
                  <Link to="/admin/issues" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    View Full Table
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {recentIssues.map((issue) => (
                        <tr key={issue._id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{issue.title}</td>
                          <td className="py-3 px-4">{issue.category}</td>
                          <td className="py-3 px-4 text-indigo-600 font-semibold">{issue.department?.name || "Unassigned"}</td>
                          <td className="py-3 px-4">
                            <IssueStatusBadge status={issue.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-500">{formatDate(issue.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/admin/issues/${issue._id}`}
                              className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
