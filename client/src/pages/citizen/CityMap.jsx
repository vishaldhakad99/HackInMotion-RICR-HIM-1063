import React, { useState, useEffect } from "react";
import { Filter, Search, MapPin, RefreshCw, Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import MapView from "../../components/MapView";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { CATEGORIES, STATUS_OPTIONS } from "../../utils/constants";

const CityMap = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMapIssues();
  }, [categoryFilter, statusFilter]);

  const fetchMapIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getIssues({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        limit: 100,
      });
      if (res.success && res.data?.issues) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load map markers.");
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (!search) return true;
    const loc = issue.location?.address || issue.location?.city || "";
    return (
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 leading-none">Live Location Issue Map</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-full border border-sky-200 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                  Live GPS Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Explore reported civic issues around your current live location.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchMapIssues}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Refresh Map Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Map Legend:</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Reported / Reopened</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Resolved / Verified / Closed</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
          {loading ? (
            <Loader text="Loading interactive city map..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMapIssues} />
          ) : (
            <MapView issues={filteredIssues} zoom={12} className="w-full h-full min-h-[550px]" />
          )}
        </div>
      </main>
    </div>
  );
};

export default CityMap;
