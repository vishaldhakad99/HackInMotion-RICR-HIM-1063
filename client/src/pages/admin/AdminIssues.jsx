import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { departmentService } from "../../services/departmentService";
import { CATEGORIES, STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../utils/constants";
import { formatDate, getImageUrl, getPriorityBadgeClass } from "../../utils/helpers";

const AdminIssues = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAdminIssues();
  }, [statusFilter, categoryFilter, priorityFilter, departmentFilter, page]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getDepartments();
      if (res.success && res.data) setDepartments(res.data);
    } catch {}
  };

  const fetchAdminIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getAdminIssues({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        department: departmentFilter || undefined,
        page,
        limit: 10,
      });

      if (res.success && res.data) {
        setIssues(res.data.issues || []);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdminIssues();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Issue Queue Management</h1>
              <p className="text-xs text-slate-500 mt-1">Review, assign, update status, and manage resolution workflows.</p>
            </div>

            <button
              onClick={fetchAdminIssues}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
              title="Refresh List"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ticket title, description, or address..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <Loader text="Loading issues queue..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchAdminIssues} />
            ) : issues.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No issues found matching selected criteria.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Photo</th>
                        <th className="py-3.5 px-4">Issue ID & Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4">Priority</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {issues.map((issue) => (
                        <tr key={issue._id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <img
                              src={getImageUrl(issue.images?.[0])}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100"
                            />
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-mono text-[10px] text-blue-600 font-bold">#{issue._id.substring(issue._id.length - 6)}</p>
                            <p className="font-bold text-slate-900 truncate">{issue.title}</p>
                          </td>
                          <td className="py-3 px-4">{issue.category}</td>
                          <td className="py-3 px-4 text-indigo-600 font-semibold">{issue.department?.name || "Unassigned"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] ${getPriorityBadgeClass(issue.priority)}`}>
                              {issue.priority || "Medium"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <IssueStatusBadge status={issue.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-500">{formatDate(issue.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/admin/issues/${issue._id}`}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-block"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminIssues;
