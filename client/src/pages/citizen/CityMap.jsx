import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, MapPin, RefreshCw, Info, Loader2, X, ArrowLeft, Home } from "lucide-react";
import Navbar from "../../components/Navbar";
import MapView from "../../components/MapView";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { CATEGORIES, STATUS_OPTIONS } from "../../utils/constants";

const MAJOR_CITIES = [
  { name: "Mumbai, Maharashtra, India", shortName: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Delhi, National Capital Territory, India", shortName: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Bengaluru, Karnataka, India", shortName: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad, Telangana, India", shortName: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Ahmedabad, Gujarat, India", shortName: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Chennai, Tamil Nadu, India", shortName: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata, West Bengal, India", shortName: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Surat, Gujarat, India", shortName: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Pune, Maharashtra, India", shortName: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Jaipur, Rajasthan, India", shortName: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "Lucknow, Uttar Pradesh, India", shortName: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { name: "Kanpur, Uttar Pradesh, India", shortName: "Kanpur", lat: 26.4499, lon: 80.3319 },
  { name: "Nagpur, Maharashtra, India", shortName: "Nagpur", lat: 21.1458, lon: 79.0882 },
  { name: "Indore, Madhya Pradesh, India", shortName: "Indore", lat: 22.7196, lon: 75.8577 },
  { name: "Thane, Maharashtra, India", shortName: "Thane", lat: 19.2183, lon: 72.9781 },
  { name: "Bhopal, Madhya Pradesh, India", shortName: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { name: "Visakhapatnam, Andhra Pradesh, India", shortName: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
  { name: "Patna, Bihar, India", shortName: "Patna", lat: 25.5941, lon: 85.1376 },
  { name: "Vadodara, Gujarat, India", shortName: "Vadodara", lat: 22.3072, lon: 73.1812 },
  { name: "Ghaziabad, Uttar Pradesh, India", shortName: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
  { name: "Ludhiana, Punjab, India", shortName: "Ludhiana", lat: 30.901, lon: 75.8573 },
  { name: "Agra, Uttar Pradesh, India", shortName: "Agra", lat: 27.1767, lon: 78.0081 },
  { name: "Nashik, Maharashtra, India", shortName: "Nashik", lat: 19.9975, lon: 73.7898 },
  { name: "Faridabad, Haryana, India", shortName: "Faridabad", lat: 28.4089, lon: 77.3178 },
  { name: "Meerut, Uttar Pradesh, India", shortName: "Meerut", lat: 28.9845, lon: 77.7064 },
  { name: "Rajkot, Gujarat, India", shortName: "Rajkot", lat: 22.3039, lon: 70.8022 },
  { name: "Varanasi, Uttar Pradesh, India", shortName: "Varanasi", lat: 25.3176, lon: 82.9739 },
  { name: "Srinagar, Jammu and Kashmir, India", shortName: "Srinagar", lat: 34.0837, lon: 74.7973 },
  { name: "Amritsar, Punjab, India", shortName: "Amritsar", lat: 31.634, lon: 74.8723 },
  { name: "Navi Mumbai, Maharashtra, India", shortName: "Navi Mumbai", lat: 19.033, lon: 73.0297 },
  { name: "Ranchi, Jharkhand, India", shortName: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { name: "Coimbatore, Tamil Nadu, India", shortName: "Coimbatore", lat: 11.0168, lon: 76.9558 },
  { name: "Jabalpur, Madhya Pradesh, India", shortName: "Jabalpur", lat: 23.1815, lon: 79.9864 },
  { name: "Gwalior, Madhya Pradesh, India", shortName: "Gwalior", lat: 26.2183, lon: 78.1828 },
  { name: "Vijayawada, Andhra Pradesh, India", shortName: "Vijayawada", lat: 16.5062, lon: 80.648 },
  { name: "Jodhpur, Rajasthan, India", shortName: "Jodhpur", lat: 26.2389, lon: 73.0243 },
  { name: "Madurai, Tamil Nadu, India", shortName: "Madurai", lat: 9.9252, lon: 78.1198 },
  { name: "Raipur, Chhattisgarh, India", shortName: "Raipur", lat: 21.2514, lon: 81.6296 },
  { name: "Kota, Rajasthan, India", shortName: "Kota", lat: 25.2138, lon: 75.8648 },
  { name: "Guwahati, Assam, India", shortName: "Guwahati", lat: 26.1445, lon: 91.7362 },
  { name: "Chandigarh, India", shortName: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { name: "New York, United States", shortName: "New York", lat: 40.7128, lon: -74.006 },
  { name: "London, United Kingdom", shortName: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo, Japan", shortName: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Paris, France", shortName: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai, United Arab Emirates", shortName: "Dubai", lat: 25.2048, lon: 55.2708 },
];

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
      const query = search.trim().toLowerCase();

      // 1. Instant match from pre-cached major cities
      const localMatches = MAJOR_CITIES.filter(
        (c) =>
          c.shortName.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query)
      ).map((c, idx) => ({ ...c, id: `local-${idx}` })).slice(0, 5);

      try {
        // 2. Fetch live results from Photon Geocoding API
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.features && data.features.length > 0) {
            const apiResults = data.features.map((f) => {
              const props = f.properties || {};
              const coords = f.geometry?.coordinates || [0, 0];
              const shortName = props.name || props.city || props.country || "Location";
              const fullName = [props.name, props.city, props.state, props.country]
                .filter(Boolean)
                .join(", ");
              return {
                id: `photon-${coords[1]}-${coords[0]}`,
                name: fullName || shortName,
                shortName: shortName,
                lat: coords[1],
                lon: coords[0],
              };
            });

            // Combine local matches & API results, deduplicating
            const combined = [...localMatches];
            apiResults.forEach((item) => {
              if (!combined.some((c) => c.shortName.toLowerCase() === item.shortName.toLowerCase())) {
                combined.push(item);
              }
            });

            setSuggestions(combined.slice(0, 5));
            setShowDropdown(true);
            setIsSearching(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Photon API fetch failed, using local matches:", err);
      }

      // 3. Fallback to local matches if network API fails
      setSuggestions(localMatches);
      setShowDropdown(localMatches.length > 0);
      setIsSearching(false);
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
              <p className="text-[11px] text-slate-500 mt-0.5">Explore reported civic issues around your current live location or search any city.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* City Autocomplete Search */}
            <div className="relative flex-1 sm:w-64" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Type city name (e.g. Mumbai, Delhi)..."
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
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="Refresh Map Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend & Searched City Info Bar */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
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

          {searchedLocation && (
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>City Focused: {searchedLocation.address.split(",")[0]}</span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="ml-1 text-indigo-500 hover:text-indigo-800 text-[10px] underline cursor-pointer"
              >
                Reset to My Live Location
              </button>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
          {loading ? (
            <Loader text="Loading interactive city map..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMapIssues} />
          ) : (
            <MapView
              issues={filteredIssues}
              searchedLocation={searchedLocation}
              zoom={12}
              className="w-full h-full min-h-[550px]"
            />
          )}
        </div>

        {/* Back to Home Button */}
        <div className="flex items-center justify-center pt-2 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600" />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CityMap;
