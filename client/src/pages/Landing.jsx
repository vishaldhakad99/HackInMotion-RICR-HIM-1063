import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  PlusCircle,
  MapPin,
  CheckCircle2,
  Zap,
  Droplets,
  Trash2,
  Road,
  Lightbulb,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Smartphone,
  BarChart3,
  Layers,
  Sparkles,
  PhoneCall,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { analyticsService } from "../services/analyticsService";
import { CATEGORIES } from "../utils/constants";

const categoryIcons = {
  "Roads & Infrastructure": Road,
  "Sanitation & Waste Management": Trash2,
  "Electricity & Street Lighting": Zap,
  "Water Supply & Drainage": Droplets,
  "Public Property": Building2,
  "Parks & Recreation": Layers,
  "Illegal Dumping": AlertTriangle,
  Streetlights: Lightbulb,
  Other: Sparkles,
};

const categoryThemeMap = {
  "Roads & Infrastructure": {
    badge: "Infrastructure",
    bg: "bg-amber-500/10",
    border: "border-amber-200/80",
    text: "text-amber-600",
    hoverBg: "group-hover:bg-amber-500",
    hoverShadow: "group-hover:shadow-amber-500/20",
    borderHover: "hover:border-amber-300",
  },
  "Sanitation & Waste Management": {
    badge: "Sanitation",
    bg: "bg-emerald-500/10",
    border: "border-emerald-200/80",
    text: "text-emerald-600",
    hoverBg: "group-hover:bg-emerald-500",
    hoverShadow: "group-hover:shadow-emerald-500/20",
    borderHover: "hover:border-emerald-300",
  },
  "Electricity & Street Lighting": {
    badge: "Power & Grid",
    bg: "bg-amber-500/10",
    border: "border-amber-200/80",
    text: "text-amber-600",
    hoverBg: "group-hover:bg-amber-500",
    hoverShadow: "group-hover:shadow-amber-500/20",
    borderHover: "hover:border-amber-300",
  },
  "Water Supply & Drainage": {
    badge: "Utilities",
    bg: "bg-sky-500/10",
    border: "border-sky-200/80",
    text: "text-[#0088cc]",
    hoverBg: "group-hover:bg-[#0088cc]",
    hoverShadow: "group-hover:shadow-sky-500/20",
    borderHover: "hover:border-sky-300",
  },
  "Public Property": {
    badge: "Public Property",
    bg: "bg-indigo-500/10",
    border: "border-indigo-200/80",
    text: "text-indigo-600",
    hoverBg: "group-hover:bg-indigo-600",
    hoverShadow: "group-hover:shadow-indigo-500/20",
    borderHover: "hover:border-indigo-300",
  },
  "Parks & Recreation": {
    badge: "Environment",
    bg: "bg-teal-500/10",
    border: "border-teal-200/80",
    text: "text-teal-600",
    hoverBg: "group-hover:bg-teal-600",
    hoverShadow: "group-hover:shadow-teal-500/20",
    borderHover: "hover:border-teal-300",
  },
  "Illegal Dumping": {
    badge: "Enforcement",
    bg: "bg-rose-500/10",
    border: "border-rose-200/80",
    text: "text-rose-600",
    hoverBg: "group-hover:bg-rose-500",
    hoverShadow: "group-hover:shadow-rose-500/20",
    borderHover: "hover:border-rose-300",
  },
  Streetlights: {
    badge: "Lighting",
    bg: "bg-cyan-500/10",
    border: "border-cyan-200/80",
    text: "text-cyan-600",
    hoverBg: "group-hover:bg-cyan-500",
    hoverShadow: "group-hover:shadow-cyan-500/20",
    borderHover: "hover:border-cyan-300",
  },
  Other: {
    badge: "General",
    bg: "bg-purple-500/10",
    border: "border-purple-200/80",
    text: "text-purple-600",
    hoverBg: "group-hover:bg-purple-600",
    hoverShadow: "group-hover:shadow-purple-500/20",
    borderHover: "hover:border-purple-300",
  },
};

const Landing = () => {
  const [stats, setStats] = useState({
    totalIssues: 142,
    resolutionRate: 91.2,
    avgResolutionTimeDays: 1.8,
    activeCitizens: 1850,
    resolvedIssues: 130,
    departmentsCount: 5,
  });

  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await analyticsService.getOverview();
      if (res.success && res.data) {
        setStats((prev) => ({
          ...prev,
          totalIssues: res.data.totalIssues || prev.totalIssues,
          resolvedIssues: res.data.resolvedIssues || prev.resolvedIssues,
          resolutionRate: res.data.resolutionRate || prev.resolutionRate,
          avgResolutionTimeDays: res.data.avgResolutionTimeDays || prev.avgResolutionTimeDays,
        }));
      }
    } catch {
      // Keep rich fallback metrics
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      question: "How does automated department routing work?",
      answer: "When a citizen reports an issue, our backend system analyzes the category and location. It automatically routes the ticket to the exact municipal department (such as Roads & Infrastructure or Sanitation) responsible for that ward.",
    },
    {
      question: "What is Duplicate Issue Detection?",
      answer: "Before submitting a new report, CivicConnect scans existing active complaints nearby. If a neighbor has already reported the same pothole or broken streetlight, you can upvote their ticket instead of creating duplicates.",
    },
    {
      question: "How do I know when my reported issue is resolved?",
      answer: "You receive real-time notifications at every stage: Acknowledged, In Progress, and Resolved. When municipal crews complete work, they upload a resolution proof photo so you can confirm and verify the fix.",
    },
    {
      question: "Can I reopen an issue if it was not fixed properly?",
      answer: "Yes! If a resolved issue remains unsatisfactory or recurs immediately, citizens can click 'Reopen Issue' on their ticket detail page and submit a reason for municipal re-inspection.",
    },
    {
      question: "Is CivicConnect free for citizens?",
      answer: "100% free! CivicConnect is built to empower citizens and municipal authorities to collaborate seamlessly for cleaner, safer, and smarter cities.",
    },
  ];

  const showcaseFixes = [
    {
      title: "Deep Pothole Repaired on MG Road",
      category: "Roads & Infrastructure",
      department: "Roads Department",
      location: "Sector 14, MG Road Signal",
      resolvedTime: "18 Hours Turnaround",
      beforeImg: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&auto=format&fit=crop&q=60",
      afterImg: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=60",
    },
    {
      title: "Water Pipeline Leak Restored",
      category: "Water Supply & Drainage",
      department: "Water Supply Department",
      location: "Block B, Pipeline Avenue",
      resolvedTime: "12 Hours Turnaround",
      beforeImg: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=500&auto=format&fit=crop&q=60",
      afterImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
    },
    {
      title: "Streetlight Poles Restored & Operational",
      category: "Electricity & Street Lighting",
      department: "Electricity Department",
      location: "5th Cross Road, Sector 3",
      resolvedTime: "24 Hours Turnaround",
      beforeImg: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60",
      afterImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-600 selection:text-white text-slate-900">
      <Navbar />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9ff] via-[#f8fafc] to-white text-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        {/* Subtle background radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#bae6fd]/30 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#99f6e4]/30 rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0f2fe]/90 border border-[#bae6fd] text-[#0284c7] text-xs font-semibold backdrop-blur-md shadow-xs">
              <Sparkles className="w-4 h-4 text-[#0284c7]" />
              <span>Smart Governance Platform 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] sm:leading-[1.12] text-[#0f172a]">
              Build a Cleaner & Safer{" "}
              <span className="block sm:inline">
                City{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088cc] via-[#0284c7] to-[#0d9488]">
                  Together
                </span>
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empowering citizens to report potholes, water leaks, uncollected garbage, and broken streetlights with instant GPS location and automated municipal department routing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full">
              <Link
                to="/report-issue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#0088cc] hover:bg-[#0077bb] text-white font-extrabold text-sm rounded-full shadow-lg shadow-sky-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">+</span>
                <span>Report an Issue Now</span>
              </Link>
              <Link
                to="/city-map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-full border border-slate-200/90 shadow-xs transition-all duration-200"
              >
                <MapPin className="w-5 h-5 text-[#0088cc]" />
                <span>Explore Live City Map</span>
              </Link>
            </div>

            {/* Quick feature pills */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>Automated Routing</span>
              </span>
              <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0088cc]" />
                <span>Resolution Proof</span>
              </span>
              <span className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
                <Zap className="w-4 h-4 text-[#f59e0b]" />
                <span>Real-time Updates</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Live Ticket Card Preview */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-[2.2rem] p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,136,204,0.08)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#e0f2fe] text-[#0088cc] font-extrabold flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0f172a]">Live Complaint Tracker</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Connected to Municipal Operations</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-bold border border-[#bbf7d0]">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
                  Live Dispatch
                </span>
              </div>

              {/* Sample Ticket Preview Cards */}
              <div className="space-y-3">
                <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/60 space-y-2.5 hover:border-sky-300 transition-all duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0088cc] font-mono font-bold text-[12px]">#CIV-ROADS-104</span>
                    <span className="bg-[#dcfce7] text-[#166534] px-3 py-0.5 rounded-full font-bold text-[10px]">
                      Resolved
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Deep Pothole Repaired on MG Road</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Roads & Infrastructure</span>
                    <span className="text-[#059669] font-bold">Proof Uploaded</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200/60 space-y-2.5 hover:border-sky-300 transition-all duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0088cc] font-mono font-bold text-[12px]">#CIV-SAN-108</span>
                    <span className="bg-[#e0f2fe] text-[#0369a1] px-3 py-0.5 rounded-full font-bold text-[10px]">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Garbage Dumpster Cleared at Park Gate</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Sanitation Dept</span>
                    <span className="text-slate-600 font-medium">Dispatched Crew</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS METRICS BAR */}
      <section className="bg-slate-50/60 border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Live Status Ribbon */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-extrabold tracking-widest text-emerald-700 uppercase">
                Live City Analytics Stream
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0088cc]" />
              Updated in real-time across municipal sectors
            </span>
          </div>

          {/* 6 Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
            {/* Metric 1: Total Reported */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 uppercase">Queue</span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stats.totalIssues}+</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Total Reported</p>
              </div>
            </div>

            {/* Metric 2: Resolved Tickets */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Closed</span>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-600">{stats.resolvedIssues}+</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Resolved Tickets</p>
              </div>
            </div>

            {/* Metric 3: Resolution Rate */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">Rate</span>
              </div>
              <div>
                <p className="text-3xl font-black text-[#0088cc]">{stats.resolutionRate}%</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Resolution Rate</p>
              </div>
            </div>

            {/* Metric 4: Avg Turnaround */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100 uppercase">Speed</span>
              </div>
              <div>
                <p className="text-3xl font-black text-cyan-600">{stats.avgResolutionTimeDays} Days</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Avg Turnaround</p>
              </div>
            </div>

            {/* Metric 5: Active Citizens */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 uppercase">Users</span>
              </div>
              <div>
                <p className="text-3xl font-black text-teal-600">{stats.activeCitizens}+</p>
                <p className="text-xs font-bold text-slate-500 mt-1">Active Citizens</p>
              </div>
            </div>

            {/* Metric 6: City Wards */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase">Sectors</span>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-600">5</p>
                <p className="text-xs font-bold text-slate-500 mt-1">City Wards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ISSUE CATEGORIES SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0088cc] bg-[#e0f2fe] px-4 py-1.5 rounded-full border border-[#bae6fd]">
            Comprehensive Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">What Civic Issues Can You Report?</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From road damage to public lighting, select a category and submit your report directly to the correct department.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComp = categoryIcons[cat.id] || Sparkles;
            const theme = categoryThemeMap[cat.id] || {
              badge: "Civic Ticket",
              bg: "bg-sky-500/10",
              border: "border-sky-200/80",
              text: "text-[#0088cc]",
              hoverBg: "group-hover:bg-[#0088cc]",
              hoverShadow: "group-hover:shadow-sky-500/20",
              borderHover: "hover:border-sky-300",
            };

            return (
              <div
                key={cat.id}
                className={`bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl ${theme.borderHover} transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Subtle Card Background Accent Tint */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} rounded-bl-full opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${theme.bg} ${theme.border} border ${theme.text} ${theme.hoverBg} ${theme.hoverShadow} group-hover:text-white flex items-center justify-center font-bold transition-all duration-300 shadow-xs group-hover:scale-105`}
                    >
                      <IconComp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200/60">
                      {theme.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0f172a] text-lg mb-2 group-hover:text-[#0088cc] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to="/report-issue"
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-[#0f172a] group-hover:text-[#0088cc] pt-4 border-t border-slate-100 transition-colors"
                >
                  <span>Report in {cat.name}</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-[#0088cc] group-hover:text-white flex items-center justify-center transition-all duration-200">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS PIPELINE (TRANSPARENT OPERATIONS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-50 border-y border-slate-200/80 text-slate-900 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
              Transparent Operations
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 tracking-tight">How CivicConnect Resolves Issues</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A transparent, 4-step pipeline ensuring every report is tracked from citizen dispatch to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Pinpoint & Snap",
                desc: "Capture a photo of the issue and pinpoint exact GPS coordinates on the interactive Leaflet map.",
                icon: MapPin,
              },
              {
                step: "02",
                title: "Automated Routing",
                desc: "Backend automatically categorizes and routes the ticket to the responsible department.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Live Inspection",
                desc: "Municipal officials inspect, assign repair crews, and update real-time status notifications.",
                icon: Clock,
              },
              {
                step: "04",
                title: "Proof Verification",
                desc: "Crews upload proof photos of the completed fix. Citizens upvote and confirm resolution.",
                icon: CheckCircle2,
              },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all duration-300 relative space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100/80 group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:to-cyan-600 group-hover:text-white flex items-center justify-center font-bold transition-all duration-200 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black bg-gradient-to-br from-sky-600 to-cyan-600 bg-clip-text text-transparent opacity-40 group-hover:opacity-100 transition-opacity">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: SMART CITY FEATURES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0088cc] bg-[#e0f2fe] px-4 py-1.5 rounded-full border border-[#bae6fd]">
            Innovative Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">Built for Citizens & City Managers</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Cutting-edge technology features designed to streamline civic grievance redressal and public accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Interactive City Map",
              desc: "View all active civic complaints across the city in real-time. Filter by department, status, or neighborhood sector.",
              icon: MapPin,
              tag: "GIS MAP",
              bg: "bg-sky-500/10",
              border: "border-sky-200/80",
              borderHover: "hover:border-sky-300",
              text: "text-sky-600",
              hoverBg: "group-hover:bg-sky-500",
              hoverShadow: "group-hover:shadow-sky-500/20",
            },
            {
              title: "Duplicate Check Engine",
              desc: "Prevents duplicate submissions by matching nearby reports. Citizens can upvote existing tickets to increase priority.",
              icon: Search,
              tag: "SMART AI",
              bg: "bg-amber-500/10",
              border: "border-amber-200/80",
              borderHover: "hover:border-amber-300",
              text: "text-amber-600",
              hoverBg: "group-hover:bg-amber-500",
              hoverShadow: "group-hover:shadow-amber-500/20",
            },
            {
              title: "Resolution Proof Upload",
              desc: "Municipal teams must upload proof photos before closing tickets, ensuring complete transparency and accountability.",
              icon: CheckCircle2,
              tag: "VERIFIED",
              bg: "bg-emerald-500/10",
              border: "border-emerald-200/80",
              borderHover: "hover:border-emerald-300",
              text: "text-emerald-600",
              hoverBg: "group-hover:bg-emerald-500",
              hoverShadow: "group-hover:shadow-emerald-500/20",
            },
            {
              title: "Recharts Analytics",
              desc: "Comprehensive administrator dashboard featuring category bar charts, status donut charts, and department turnaround rankings.",
              icon: BarChart3,
              tag: "BI INSIGHTS",
              bg: "bg-indigo-500/10",
              border: "border-indigo-200/80",
              borderHover: "hover:border-indigo-300",
              text: "text-indigo-600",
              hoverBg: "group-hover:bg-indigo-600",
              hoverShadow: "group-hover:shadow-indigo-500/20",
            },
            {
              title: "Role-Based Protection",
              desc: "Secure authentication with distinct portals for Citizens and Municipal Administrators, enforced with protected routes.",
              icon: ShieldCheck,
              tag: "SECURITY",
              bg: "bg-teal-500/10",
              border: "border-teal-200/80",
              borderHover: "hover:border-teal-300",
              text: "text-teal-600",
              hoverBg: "group-hover:bg-teal-600",
              hoverShadow: "group-hover:shadow-teal-500/20",
            },
            {
              title: "Mobile First Design",
              desc: "Fully responsive layout designed for mobile phones, tablets, and desktops, allowing easy reporting on the go.",
              icon: Smartphone,
              tag: "RESPONSIVE",
              bg: "bg-purple-500/10",
              border: "border-purple-200/80",
              borderHover: "hover:border-purple-300",
              text: "text-purple-600",
              hoverBg: "group-hover:bg-purple-600",
              hoverShadow: "group-hover:shadow-purple-500/20",
            },
          ].map((feat) => {
            const IconComp = feat.icon;
            return (
              <div
                key={feat.title}
                className={`bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl ${feat.borderHover} transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Subtle Card Background Accent Tint */}
                <div className={`absolute top-0 right-0 w-28 h-28 ${feat.bg} rounded-bl-full opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${feat.bg} ${feat.border} border ${feat.text} ${feat.hoverBg} ${feat.hoverShadow} group-hover:text-white flex items-center justify-center font-bold transition-all duration-300 shadow-xs group-hover:scale-105`}
                    >
                      <IconComp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200/60">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0f172a] text-lg mb-2 group-hover:text-[#0088cc] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#0088cc] pt-4 border-t border-slate-100 transition-colors">
                  <span>Smart City Tech</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-[#0088cc] group-hover:text-white flex items-center justify-center transition-all duration-200">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: RESOLUTION SPOTLIGHT SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              Verified Fixes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Recent City Resolutions</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Real examples of civic issues reported by citizens and successfully fixed by municipal departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcaseFixes.map((fix, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img src={fix.afterImg} alt={fix.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full shadow">
                      VERIFIED FIXED
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      {fix.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">{fix.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {fix.location}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">{fix.department}</span>
                  <span className="font-bold text-emerald-600">{fix.resolvedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to know about reporting, tracking, and resolving city grievances with complete transparency.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden ${
                  isOpen
                    ? "border-sky-400 shadow-md ring-2 ring-sky-500/10"
                    : "border-slate-200/90 hover:border-sky-300 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left font-extrabold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full transition-colors ${isOpen ? "bg-sky-600" : "bg-slate-300"}`}></span>
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-xl transition-colors ${isOpen ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}`}>
                    {isOpen ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: HIGH IMPACT CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 text-white rounded-3xl p-8 sm:p-14 shadow-2xl shadow-sky-600/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4 text-center md:text-left max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Join the Civic Movement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Make Your Neighborhood Smarter?
            </h2>
            <p className="text-sky-50 text-xs sm:text-sm leading-relaxed opacity-95">
              Join thousands of active citizens reporting issues and helping local administration maintain cleaner, safer city wards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
            <Link
              to="/report-issue"
              className="px-7 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-sky-400 stroke-[2.5]" />
              <span>Report an Issue Now</span>
            </Link>
            <Link
              to="/register"
              className="px-7 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0088cc] text-white font-bold flex items-center justify-center shadow-md shadow-sky-600/20">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight leading-none">
                Civic<span className="text-[#0088cc]">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Smart City Issue Reporting & Resolution Portal enabling transparent citizen-government collaboration.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Municipal Operations Center Active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/city-map" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  Interactive City Map
                </Link>
              </li>
              <li>
                <Link to="/report-issue" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  Citizen Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  Administrator Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal Departments */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Municipal Departments</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Roads & Infrastructure</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Sanitation & Waste Management</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Water Supply & Drainage</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Electricity & Street Lighting</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Parks & Public Property</li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Emergency Helplines</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 hover:border-sky-500/40 transition-colors">
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Toll-Free Helpline</p>
                  <p className="font-bold text-white">1800-CIVIC-CONNECT</p>
                </div>
              </li>
              <li className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 hover:border-sky-500/40 transition-colors">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Support Desk</p>
                  <p className="font-bold text-white">support@civicconnect.gov.in</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-medium">
          <p>&copy; 2026 CivicConnect Smart City Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-sky-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-sky-400 transition-colors">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
