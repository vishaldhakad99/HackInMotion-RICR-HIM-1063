import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, Database, ArrowLeft, Building2, ListFilter } from "lucide-react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("section-1");

  const sections = [
    { id: "section-1", number: "1", title: "Information We Collect" },
    { id: "section-2", number: "2", title: "How Your Data Is Utilized" },
    { id: "section-3", number: "3", title: "Data Security & Storage" },
    { id: "section-4", number: "4", title: "Citizen Privacy Controls" },
    { id: "section-5", number: "5", title: "Contact Data Privacy Officer" },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Breadcrumb & Header Card */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0088cc] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0088cc] rounded-full text-xs font-bold border border-sky-100 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Data Protection & Privacy
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                CivicConnect Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Learn how CivicConnect gathers, protects, and utilizes citizen data to power transparent municipal operations.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1 shrink-0">
              <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Effective Date</p>
              <p className="font-extrabold text-[#0f172a]">August 14, 2026</p>
              <p className="text-[11px] text-emerald-600 font-bold">Version 2.4 (Active)</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout with Sticky Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Table of Contents Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100">
                <ListFilter className="w-4 h-4 text-[#0088cc]" />
                <span>On This Page</span>
              </div>

              <nav className="space-y-1.5">
                {sections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-[#e0f2fe] text-[#0088cc] font-extrabold border border-[#bae6fd] shadow-xs"
                          : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-lg text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                          isActive ? "bg-[#0088cc] text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {sec.number}
                      </span>
                      <span className="leading-snug pt-0.5">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium text-center">
                Click any section above to navigate smoothly.
              </div>
            </div>
          </aside>

          {/* Main Document Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Section 1 */}
            <div id="section-1" className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0088cc] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">1. Information We Collect</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                To process civic issue reports accurately, CivicConnect collects minimal required information:
              </p>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-2 pl-13 font-medium">
                <li><strong>Account Profile:</strong> Your full name, verified email address, and role credentials.</li>
                <li><strong>Location Data:</strong> Geolocation coordinates (Latitude/Longitude) and address landmarks linked to reported issues.</li>
                <li><strong>Media Evidence:</strong> Photos uploaded to demonstrate physical infrastructure damage or civic defects.</li>
                <li><strong>System Logs:</strong> Device type, IP address, and timestamp data captured during ticket submissions for security auditing.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="section-2" className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">2. How Your Data Is Utilized</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                All collected information is strictly utilized to facilitate civic infrastructure resolution:
              </p>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-2 pl-13 font-medium">
                <li>Automatic routing of tickets to authorized municipal officers (Roads, Sanitation, Water, Electricity, Parks).</li>
                <li>Displaying issue pins on the public Interactive City Map for community visibility.</li>
                <li>Sending status update notifications regarding inspection, crew dispatch, and issue resolution.</li>
                <li>Generating anonymized municipal performance analytics and turnaround reports.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="section-3" className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">3. Data Security & Storage</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                We employ industry-standard encryption protocols (TLS/SSL in transit and AES-256 at rest) to safeguard user databases. Access to user personal information is strictly restricted to authenticated system administrators and verified municipal staff. We never sell, lease, or monetize user data to commercial third parties.
              </p>
            </div>

            {/* Section 4 */}
            <div id="section-4" className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">4. Citizen Privacy Controls</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                Citizens retain full control over their personal profile information. You can review your reported tickets, edit account details, or request ticket redaction at any time via your user dashboard profile settings.
              </p>
            </div>

            {/* Section 5 */}
            <div id="section-5" className="scroll-mt-28 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">5. Contact Data Privacy Officer</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                For questions, data modification requests, or privacy inquiries, contact our dedicated Municipal Data Desk at:
                <br />
                <span className="font-bold text-[#0088cc]">privacy@civicconnect.gov.in</span> or call <span className="font-bold text-slate-900">1800-CIVIC-CONNECT</span>.
              </p>
            </div>

            {/* Footer CTA Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-3xl text-center space-y-4 shadow-lg">
              <h3 className="text-xl font-extrabold">Empowering Transparent Municipal Governance</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Have questions about how CivicConnect protects citizen reports? Check out our Terms of Service or visit our interactive city map.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Link
                  to="/terms"
                  className="px-5 py-2.5 bg-[#0088cc] hover:bg-[#0077bb] text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  View Terms of Service
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
