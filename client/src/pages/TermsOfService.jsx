import React from "react";
import { Link } from "react-router-dom";
import {
  FileCheck,
  ShieldCheck,
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import Navbar from "../components/Navbar";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-blue-400 font-bold">Legal Documents</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-md">
            <FileCheck className="w-4 h-4 text-blue-400" />
            <span>CivicConnect Terms of Service</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">Terms of Service</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Please read these terms carefully before submitting civic reports or accessing municipal administrative portals.
          </p>

          <div className="pt-2 text-xs text-slate-400 font-medium">
            <span>Last Updated: August 13, 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            By registering or submitting reports through CivicConnect, citizens and municipal officers agree to abide by these Terms of Service and municipal guidelines.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900">2. Responsible Reporting</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Users must submit authentic, accurate, and non-frivolous complaints. Submission of false reports, offensive material, or spam will result in account suspension.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900">3. Municipal Response SLA</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Target resolution turnarounds are estimated based on department capacity. Emergency hazards (e.g. live wire or main pipeline burst) are prioritized automatically.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs text-center">
        <p>&copy; 2026 CivicConnect Smart City Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
