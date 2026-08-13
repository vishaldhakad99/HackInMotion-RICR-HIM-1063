import React, { useState, useEffect } from "react";
import { Search, Filter, PlusCircle, RefreshCw } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueCard from "../../components/IssueCard";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { CATEGORIES, STATUS_OPTIONS } from "../../utils/constants";
import toast from "react-hot-toast";

const MyIssues = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, categoryFilter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getMyIssues({
        status: statusFilter || undefined,
        limit: 50,
      });
      if (res.success && res.data?.issues) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (issueId) => {
    try {
      const res = await issueService.upvoteIssue(issueId);
      if (res.success) {
        toast.success(res.message || "Upvoted!");
        fetchIssues();
      }
    } catch (err) {
      toast.error("Could not process upvote.");
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      !search ||
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase()) ||
      issue.location?.address?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryFilter || issue.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">My Reported Issues</h1>
              <p className="text-xs text-slate-500 mt-1">Manage and check status updates on tickets you submitted.</p>
            </div>

            <button
              onClick={fetchIssues}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
              title="Refresh List"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search issues by title, description, address..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid List */}
          {loading ? (
            <Loader text="Loading your issues..." />
          ) : error ? (
              <ErrorMessage message={error} onRetry={fetchIssues} />
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-500">
              No matching reported issues found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} onUpvote={handleUpvote} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyIssues;
