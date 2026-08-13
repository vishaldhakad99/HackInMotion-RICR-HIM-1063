import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  PlusCircle,
  MapPin,
  CheckCircle2,
  Users,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Droplets,
  Trash2,
  Road,
  Lightbulb,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertTriangle,
  HeartHandshake,
  Smartphone,
  BarChart3,
  Layers,
  Sparkles,
  PhoneCall,
  Mail,
  ExternalLink,
  FileText,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { analyticsService } from "../services/analyticsService";
import { CATEGORIES } from "../utils/constants";

const categoryCardStyles = {
  "Roads & Infrastructure": {
    iconBg: "from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 ring-4 ring-orange-500/10",
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
    topGradient: "from-amber-500 to-orange-500",
  },
  "Sanitation & Waste Management": {
    iconBg: "from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/10",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    topGradient: "from-emerald-500 to-teal-500",
  },
  "Electricity & Street Lighting": {
    iconBg: "from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10",
    badge: "bg-blue-50 text-blue-700 border-blue-200/70",
    topGradient: "from-blue-600 to-indigo-600",
  },
  "Water Supply & Drainage": {
    iconBg: "from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-4 ring-cyan-500/10",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200/70",
    topGradient: "from-cyan-500 to-blue-600",
  },
  "Public Property": {
    iconBg: "from-purple-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-purple-500/25 ring-4 ring-purple-500/10",
    badge: "bg-purple-50 text-purple-700 border-purple-200/70",
    topGradient: "from-purple-600 to-indigo-600",
  },
  "Parks & Recreation": {
    iconBg: "from-green-500 via-emerald-500 to-teal-600 text-white shadow-lg shadow-green-500/25 ring-4 ring-green-500/10",
    badge: "bg-green-50 text-green-700 border-green-200/70",
    topGradient: "from-green-500 to-emerald-600",
  },
  "Illegal Dumping": {
    iconBg: "from-rose-500 via-red-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 ring-4 ring-rose-500/10",
    badge: "bg-rose-50 text-rose-700 border-rose-200/70",
    topGradient: "from-rose-500 to-red-600",
  },
  Streetlights: {
    iconBg: "from-amber-400 via-yellow-400 to-amber-500 text-slate-900 shadow-lg shadow-amber-500/25 ring-4 ring-amber-500/10",
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
    topGradient: "from-amber-400 to-yellow-500",
  },
  Other: {
    iconBg: "from-slate-600 via-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/25 ring-4 ring-slate-500/10",
    badge: "bg-slate-50 text-slate-700 border-slate-200/70",
    topGradient: "from-slate-600 to-slate-800",
  },
};

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

const Landing = () => {
  const [stats, setStats] = useState({
    totalIssues: 8,
    resolutionRate: 12.5,
    avgResolutionTimeDays: 1.8,
    activeCitizens: 1850,
    resolvedIssues: 1,
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Smart Governance Platform 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-tight">
              Build a Cleaner & Safer City <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">Together</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empowering citizens to report potholes, water leaks, uncollected garbage, and broken streetlights with instant GPS location and automated municipal department routing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/report-issue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" />
                Report an Issue Now
              </Link>
              <Link
                to="/city-map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-slate-800/90 hover:bg-slate-800 text-slate-100 font-bold text-sm rounded-2xl border border-slate-700 backdrop-blur-md transition"
              >
                <MapPin className="w-5 h-5 text-blue-400" />
                Explore Live City Map
              </Link>
            </div>

            {/* Quick feature pills */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Automated Routing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Resolution Proof</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Real-time Updates</span>
            </div>
          </div>

          {/* Hero Live Ticket Card Preview */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/70 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-extrabold shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Live Complaint Tracker</h3>
                    <p className="text-[11px] text-slate-400">Connected to Municipal Operations</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Dispatch
                </span>
              </div>

              {/* Sample Ticket Preview Cards */}
              <div className="space-y-3">
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400 font-mono font-bold">#CIV-ROADS-104</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-emerald-500/30">
                      Resolved
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-100">Deep Pothole Repaired on MG Road</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Roads & Infrastructure</span>
                    <span className="text-emerald-400 font-semibold">Proof Uploaded</span>
                  </div>
                </div>

                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400 font-mono font-bold">#CIV-SAN-108</span>
                    <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-indigo-500/30">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-100">Garbage Dumpster Cleared at Park Gate</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Sanitation Dept</span>
                    <span>Dispatched Crew</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS METRICS BAR */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 border-y border-slate-200/80 py-14 px-4 sm:px-6 lg:px-8 shadow-xs overflow-hidden">
        {/* Background Accent Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-[0.06] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Header Badge & Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-extrabold border border-blue-200/70 tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Real-Time Impact Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              City Operations at a Glance
            </h2>
          </div>

          {/* 6 Grid Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {/* Card 1: Total Reports */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  Reports
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stats.totalIssues}+
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Total Reports</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">All Categories</p>
              </div>
            </div>

            {/* Card 2: Resolved Tickets */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Verified
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                  {stats.resolvedIssues}+
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Resolved Tickets</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Proof Uploaded</p>
              </div>
            </div>

            {/* Card 3: Resolution Rate */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  Efficiency
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
                  {stats.resolutionRate}%
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Resolution Rate</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Fix Ratio</p>
              </div>
            </div>

            {/* Card 4: Avg Turnaround */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  Speed
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                  {stats.avgResolutionTimeDays} Days
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Avg Turnaround</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Rapid Response</p>
              </div>
            </div>

            {/* Card 5: Active Citizens */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100">
                  Community
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-teal-600 tracking-tight">
                  {stats.activeCitizens}+
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Active Citizens</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Registered Users</p>
              </div>
            </div>

            {/* Card 6: Cities */}
            <div className="group bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                  Urban
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">
                  5
                </p>
                <p className="text-xs font-extrabold text-slate-700 mt-1">Cities</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Active Smart Wards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ISSUE CATEGORIES SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-extrabold border border-blue-200/70 uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Comprehensive Coverage
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            What Civic Issues Can You Report?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            From road damage to public lighting, select a category and submit your report directly to the correct department.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {CATEGORIES.map((cat) => {
            const IconComp = categoryIcons[cat.id] || Sparkles;
            const style = categoryCardStyles[cat.id] || {
              iconBg: "from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10",
              badge: "bg-blue-50 text-blue-700 border-blue-200/70",
              topGradient: "from-blue-600 to-indigo-600",
            };

            return (
              <div
                key={cat.id}
                className="group relative bg-white/95 backdrop-blur-sm p-7 rounded-[2rem] border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Hover Top Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${style.topGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${style.iconBg} flex items-center justify-center font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${style.badge} uppercase tracking-wider shadow-2xs`}>
                      Municipal Queue
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg mb-2.5 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to="/report-issue"
                  className="inline-flex items-center justify-between px-4.5 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 group-hover:bg-blue-50/80 group-hover:border-blue-200 text-xs font-extrabold text-slate-700 group-hover:text-blue-600 transition-all duration-200"
                >
                  <span>Report in {cat.name}</span>
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-200/80 text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS PIPELINE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Transparent Operations
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">How CivicConnect Resolves Issues</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A transparent, 4-step pipeline ensuring every report is tracked from citizen dispatch to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                  className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 relative space-y-4 hover:border-blue-500 transition"
                >
                  <div className="text-4xl font-black text-slate-700">{item.step}</div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: SMART CITY FEATURES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-extrabold border border-blue-200/70 uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Innovative Features
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">Built for Citizens & City Managers</h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Cutting-edge technology features designed to streamline civic grievance redressal and public accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {[
            {
              title: "Interactive City Map",
              desc: "View all active civic complaints across the city in real-time. Filter by department, status, or neighborhood sector.",
              icon: MapPin,
              badge: "GIS Mapping",
              color: "from-blue-600 to-indigo-600",
              iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
              tagStyle: "bg-blue-50 text-blue-700 border-blue-200/80",
            },
            {
              title: "Duplicate Check Engine",
              desc: "Prevents duplicate submissions by matching nearby reports. Citizens can upvote existing tickets to increase priority.",
              icon: Search,
              badge: "Smart Match",
              color: "from-amber-500 to-orange-500",
              iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
              tagStyle: "bg-amber-50 text-amber-700 border-amber-200/80",
            },
            {
              title: "Resolution Proof Upload",
              desc: "Municipal teams must upload proof photos before closing tickets, ensuring complete transparency and accountability.",
              icon: CheckCircle2,
              badge: "Verification",
              color: "from-emerald-500 to-teal-600",
              iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
              tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
            },
            {
              title: "Recharts Analytics",
              desc: "Comprehensive administrator dashboard featuring category bar charts, status donut charts, and department turnaround rankings.",
              icon: BarChart3,
              badge: "Intelligence",
              color: "from-indigo-600 to-violet-600",
              iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
              tagStyle: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
            },
            {
              title: "Role-Based Protection",
              desc: "Secure authentication with distinct portals for Citizens and Municipal Administrators, enforced with protected routes.",
              icon: ShieldCheck,
              badge: "Security",
              color: "from-teal-500 to-cyan-600",
              iconBg: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
              tagStyle: "bg-teal-50 text-teal-700 border-teal-200/80",
            },
            {
              title: "Mobile First Design",
              desc: "Fully responsive layout designed for mobile phones, tablets, and desktops, allowing easy reporting on the go.",
              icon: Smartphone,
              badge: "Responsive",
              color: "from-purple-600 to-pink-600",
              iconBg: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
              tagStyle: "bg-purple-50 text-purple-700 border-purple-200/80",
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/95 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden space-y-5"
              >
                {/* Top Gradient Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center font-bold transition-all duration-300 shadow-xs group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${item.tagStyle} uppercase tracking-wider shadow-2xs`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100/90 flex items-center justify-between text-[11px] font-extrabold text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span>Smart City Platform</span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: RESOLUTION SPOTLIGHT SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-y border-slate-200 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
              Verified Fixes
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Recent City Resolutions</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Real examples of civic issues reported by citizens and successfully fixed by municipal departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showcaseFixes.map((fix, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full bg-slate-200">
                    <img src={fix.afterImg} alt={fix.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full shadow">
                      VERIFIED FIXED
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about reporting, tracking, and resolving city grievances.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Make Your Neighborhood Smarter?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join thousands of active citizens reporting issues and helping local administration maintain cleaner, safer city wards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/report-issue"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg text-center"
            >
              Report an Issue
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg text-center"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: COMPREHENSIVE MULTI-COLUMN FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-black text-white text-xl">CivicConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart City Issue Reporting & Resolution Portal enabling transparent citizen-government collaboration.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/city-map" className="hover:text-white transition">Interactive City Map</Link></li>
              <li><Link to="/report-issue" className="hover:text-white transition">Report an Issue</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Citizen Portal Login</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Administrator Portal Login</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Municipal Departments</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Roads & Infrastructure Department</li>
              <li>Sanitation & Waste Management</li>
              <li>Water Supply & Drainage Bureau</li>
              <li>Electricity & Street Lighting</li>
              <li>Parks & Public Property Office</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Emergency Helplines</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><PhoneCall className="w-3.5 h-3.5 text-blue-400" /> Civic Helpline: 1800-CIVIC-CONNECT</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> Support: support@civicconnect.gov.in</li>
              <li className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-blue-400" /> Municipal HQ: Central City Ward 14</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; 2026 CivicConnect Smart City Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link to="/privacy-policy#accessibility" className="hover:text-slate-300 transition">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
