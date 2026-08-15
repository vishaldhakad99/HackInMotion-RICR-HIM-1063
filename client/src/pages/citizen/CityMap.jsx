import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, MapPin, RefreshCw, Info, Loader2, X, ArrowLeft, Layers } from "lucide-react";
import Navbar from "../../components/Navbar";
import MapView from "../../components/MapView";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { CATEGORIES, STATUS_OPTIONS } from "../../utils/constants";
import { searchLocations, MAJOR_INDIAN_CITIES } from "../../services/mapServices";

const CityMap = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchMapIssues();
  }, [categoryFilter, statusFilter]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Multi-stage geocoding search for city names
  useEffect(() => {
    if (!search || search.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(search);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.warn("Geocoding search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectCity = (city) => {
    setSearch(city.shortName || city.name.split(",")[0]);
    setShowDropdown(false);
    setSearchedLocation({
      latitude: city.lat,
      longitude: city.lon,
      address: city.name,
    });
  };

  const handleClearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
    setSearchedLocation(null);
  };

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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
      <Navbar />

      {/* Main Full-Bleed Map Canvas Container */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        {/* Floating Top Control Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Left Title & Back button Pill */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 leading-none">Live City Issue Map</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold rounded-full border border-sky-200 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                  Live GPS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">Real-time GPS tracking & community issue heatmap</p>
            </div>
          </div>

          {/* Right Search & Filters Bar */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-lg flex flex-wrap items-center gap-2">
            {/* City Search Bar */}
            <div className="relative flex-1 sm:w-60 min-w-[180px]" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search city (e.g. Mumbai)..."
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                />
                {isSearching ? (
                  <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin absolute right-2.5 top-2.5" />
                ) : search ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

              {/* City Suggestions Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-[2000] max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCity(item)}
                      className="w-full text-left px-3.5 py-2 hover:bg-sky-50 transition flex items-start gap-2 group cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.shortName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
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
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
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
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Refresh Map Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Toggle Map Legend Button */}
            <button
              type="button"
              onClick={() => setShowLegend(!showLegend)}
              className={`p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                showLegend ? "bg-sky-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title="Toggle Map Legend"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Legend</span>
            </button>
          </div>
        </div>

        {/* Floating Bottom Legend Drawer */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-xl text-xs max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-100 font-extrabold text-slate-800">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Map Color Pin Legend</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Reported / Reopened</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Resolved / Verified / Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                <span>Critical / Rejected</span>
              </div>
            </div>
          </div>
        )}

        {/* Focused City Indicator Badge */}
        {searchedLocation && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-indigo-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-700 shadow-xl text-white text-xs flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-indigo-300 animate-bounce" />
            <div>
              <p className="font-bold leading-none">{searchedLocation.address.split(",")[0]}</p>
              <p className="text-[9px] text-indigo-200 mt-0.5 font-mono">
                {searchedLocation.latitude}, {searchedLocation.longitude}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="ml-1 px-2 py-0.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}

        {/* 100% Full Canvas Height Map View */}
        <div className="w-full h-full flex-1 relative bg-slate-100">
          {loading ? (
            <Loader text="Loading full-page city map..." />
          ) : error ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <ErrorMessage message={error} onRetry={fetchMapIssues} />
            </div>
          ) : (
            <MapView
              issues={filteredIssues}
              searchedLocation={searchedLocation}
              zoom={12}
              className="w-full h-full"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CityMap;
