import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Eye,
  MapPin,
  FileCheck,
  Building2,
  Mail,
  PhoneCall,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-blue-400 font-bold">Legal Documents</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>CivicConnect Privacy & Data Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">Privacy Policy</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Your privacy and data protection are paramount. Learn how CivicConnect collects, processes, and protects your civic report data in compliance with municipal regulations.
          </p>

          <div className="pt-2 text-xs text-slate-400 font-medium">
            <span>Last Updated: August 13, 2026</span> &bull; <span>Version 2.4</span>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24 space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider px-2">Policy Navigation</h3>
            <nav className="space-y-1 text-xs font-bold text-slate-600">
              <a href="#information-collection" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>1. Information We Collect</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#how-we-use-data" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>2. How We Use Information</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#gps-location" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>3. GPS Location Privacy</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#department-sharing" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>4. Department Data Sharing</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#data-security" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>5. Security & Encryption</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="#contact-dpo" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 hover:text-blue-600 transition">
                <span>6. Contact Data Protection Officer</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/report-issue"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-sm hover:shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Submit Civic Issue
              </Link>
            </div>
          </div>
        </aside>

        {/* Policy Content */}
        <article className="lg:col-span-8 space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="information-collection" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">1. Information We Collect</h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">
              CivicConnect collects personal and civic information necessary to verify, dispatch, and resolve municipal grievances effectively:
            </p>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200/60 font-medium">
              <li><strong>Account Profile Data:</strong> Full Name, Email Address, Phone Number, and Municipal Ward preference upon registration.</li>
              <li><strong>Issue Report Submissions:</strong> Problem title, detailed description, selected category, attached evidence photos, and urgency level.</li>
              <li><strong>Geographical Location Data:</strong> Precise GPS latitude and longitude coordinates associated with reported civic incidents.</li>
              <li><strong>System Usage Logs:</strong> IP address, device type, browser model, and timestamp logs for anti-abuse duplicate detection.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="how-we-use-data" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">2. How We Use Information</h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">
              All collected information is strictly utilized to operate the civic grievance resolution system:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-extrabold text-slate-900 mb-1">Automated Dispatch</h4>
                <p className="text-slate-500 font-normal">Matching report categories and location to route tickets to the correct municipal ward.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-extrabold text-slate-900 mb-1">Status Notifications</h4>
                <p className="text-slate-500 font-normal">Sending email and portal alerts as repair crews acknowledge and complete tickets.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-extrabold text-slate-900 mb-1">Duplicate Prevention</h4>
                <p className="text-slate-500 font-normal">Comparing nearby reports to prevent redundant work orders and enable community upvoting.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <h4 className="font-extrabold text-slate-900 mb-1">Municipal Analytics</h4>
                <p className="text-slate-500 font-normal">Aggregating anonymized resolution turnaround times to measure department efficiency.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="gps-location" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">3. GPS Location Privacy</h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">
              CivicConnect requests location access only when pinning an issue on the interactive city map. We do not perform background location tracking. Once an issue is pinned, GPS coordinates are published on the public city map to alert fellow citizens and municipal repair teams.
            </p>
          </section>

          {/* Section 4 */}
          <section id="department-sharing" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">4. Department Data Sharing</h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ticket details, photos, and pin coordinates are shared with accredited municipal field staff (e.g. Roads, Sanitation, Water Supply, Electricity Departments). <strong>CivicConnect does not sell or rent citizen personal data to third-party commercial advertisers.</strong>
            </p>
          </section>

          {/* Section 5 */}
          <section id="data-security" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">5. Security & Encryption</h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We enforce SSL/TLS encryption for all data in transit. Passwords are securely hashed before database storage. Role-Based Access Controls (RBAC) ensure citizen personal data is protected behind strict authentication boundaries.
            </p>
          </section>

          {/* Section 6 */}
          <section id="contact-dpo" className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 scroll-mt-28">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold border border-blue-400/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">6. Contact Data Protection Officer</h2>
                <p className="text-xs text-slate-300">Questions regarding your personal data or privacy rights?</p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-300 space-y-2 border-t border-slate-800">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Email: dpo@civicconnect.gov.in</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Helpline: 1800-CIVIC-CONNECT (Ext 4)</span>
              </p>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs text-center">
        <p>&copy; 2026 CivicConnect Smart City Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
