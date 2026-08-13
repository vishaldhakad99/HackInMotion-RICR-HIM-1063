import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  Upload,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Road,
  Trash2,
  Zap,
  Droplets,
  Building,
  Trees,
  Lightbulb,
  HelpCircle,
  ShieldAlert,
  Building2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MapView from "../../components/MapView";
import ImageUploader from "../../components/ImageUploader";
import { issueService } from "../../services/issueService";
import { CATEGORIES, PRIORITY_OPTIONS } from "../../utils/constants";

const STEPS = ["Category", "Location", "Evidence", "Details", "Review & Duplicate Check"];

const categoryIconMap = {
  "Roads & Infrastructure": Road,
  "Sanitation & Waste Management": Trash2,
  "Electricity & Street Lighting": Zap,
  "Water Supply & Drainage": Droplets,
  "Public Property": Building,
  "Parks & Recreation": Trees,
  "Illegal Dumping": AlertTriangle,
  Streetlights: Lightbulb,
  Other: HelpCircle,
};

const ReportIssue = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateFound, setDuplicateFound] = useState(null);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "Roads & Infrastructure",
    location: {
      address: "",
      city: "Mumbai",
      latitude: 19.076,
      longitude: 72.8777,
    },
    images: [],
    title: "",
    description: "",
    priority: "Medium",
  });

  const handleCategorySelect = (catName) => {
    setFormData((prev) => ({ ...prev, category: catName }));
  };

  const handleLocationSelect = (coords) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: prev.location.address || `Pinned Location (${coords.latitude}, ${coords.longitude})`,
      },
    }));
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && !formData.category) {
      toast.error("Please select an issue category.");
      return;
    }
    if (currentStep === 2 && (!formData.location.latitude || !formData.location.longitude)) {
      toast.error("Please select a location on the map.");
      return;
    }
    if (currentStep === 4) {
      if (!formData.title.trim()) {
        toast.error("Please enter an issue title.");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Please enter an issue description.");
        return;
      }

      // Perform duplicate check before final step
      try {
        setSubmitting(true);
        const dupRes = await issueService.checkDuplicate(formData.category, formData.location);
        if (dupRes.hasDuplicate && dupRes.duplicate) {
          setDuplicateFound(dupRes.duplicate);
        } else {
          setDuplicateFound(null);
        }
      } catch {
        setDuplicateFound(null);
      } finally {
        setSubmitting(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await issueService.createIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        images: formData.images,
      });

      if (res.success && res.data) {
        setSubmittedIssue(res.data);
        toast.success("Issue reported successfully!");
      } else {
        toast.error(res.message || "Failed to submit issue report.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Report a Civic Issue</h1>
              <p className="text-xs text-slate-500 mt-1">
                Follow the steps below to report an infrastructure or community issue in your city.
              </p>
            </div>

            {/* Stepper Header */}
            {!submittedIssue && (
              <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 border-t border-slate-100 pt-4">
                {STEPS.map((stepLabel, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentStep === stepNum;
                  const isCompleted = currentStep > stepNum;

                  return (
                    <div key={stepNum} className="flex items-center gap-2 shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {stepLabel}
                      </span>
                      {stepNum < STEPS.length && <span className="text-slate-300 mx-1">/</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SUCCESS SCREEN */}
          {submittedIssue ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Issue Reported Successfully!</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your ticket has been logged and assigned to the municipal department for inspection.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Issue Ticket ID:</span>
                  <span className="font-bold text-blue-600">{submittedIssue._id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Category:</span>
                  <span className="font-bold text-slate-900">{submittedIssue.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Assigned Department:</span>
                  <span className="font-bold text-indigo-600">
                    {submittedIssue.department?.name || "Automated Department Queue"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Initial Status:</span>
                  <span className="font-bold text-amber-600">{submittedIssue.status}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => navigate(`/issues/${submittedIssue._id}`)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Track Issue Details
                </button>
                <button
                  onClick={() => {
                    setSubmittedIssue(null);
                    setCurrentStep(1);
                    setFormData({
                      category: "Roads & Infrastructure",
                      location: { address: "", city: "Mumbai", latitude: 19.076, longitude: 72.8777 },
                      images: [],
                      title: "",
                      description: "",
                      priority: "Medium",
                    });
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          ) : (
            /* STEP FORM BODY */
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              {/* STEP 1: CATEGORY SELECTION */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Step 1 — Select Issue Category</h3>
                    <p className="text-xs text-slate-500">Choose the category that best describes the civic problem.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat) => {
                      const IconComponent = categoryIconMap[cat.id] || HelpCircle;
                      const isSelected = formData.category === cat.id;

                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/40 shadow-sm"
                              : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{cat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION MAP */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Step 2 — Select Location on Map</h3>
                    <p className="text-xs text-slate-500">
                      Use GPS or click directly on the interactive map to pin the issue location.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Address / Landmark Description</label>
                      <input
                        type="text"
                        value={formData.location.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: { ...formData.location, address: e.target.value },
                          })
                        }
                        placeholder="e.g. Near Bus Stop 14, MG Road, Sector 3"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="h-80 w-full rounded-2xl overflow-hidden">
                      <MapView
                        selectable={true}
                        selectedLocation={formData.location}
                        onLocationSelect={handleLocationSelect}
                        zoom={14}
                      />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">Selected Pin Coords: </span>
                        <span className="text-slate-600 font-mono">
                          Latitude: {formData.location.latitude}, Longitude: {formData.location.longitude}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EVIDENCE PHOTO */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Step 3 — Upload Evidence Photo</h3>
                    <p className="text-xs text-slate-500">Upload clear photos showing the issue to assist municipal teams.</p>
                  </div>

                  <ImageUploader
                    images={formData.images}
                    onImageUploaded={(urls) => setFormData({ ...formData, images: urls })}
                    maxFiles={3}
                  />
                </div>
              )}

              {/* STEP 4: DESCRIPTION & PRIORITY */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Step 4 — Issue Details & Priority</h3>
                    <p className="text-xs text-slate-500">Provide a clear title and description for municipal officers.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Dangerous deep pothole near school entrance"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Explain the problem, duration, hazards created, and any relevant context..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Perceived Priority Level</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRIORITY_OPTIONS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: p.value })}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                              formData.priority === p.value
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & DUPLICATE DETECTION */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Step 5 — Duplicate Check & Final Review</h3>
                    <p className="text-xs text-slate-500">Review your ticket before final dispatch to municipal system.</p>
                  </div>

                  {/* DUPLICATE ALERT CARD */}
                  {duplicateFound && (
                    <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                        <ShieldAlert className="w-5 h-5 text-amber-600" />
                        <span>Similar Issue Found Nearby!</span>
                      </div>
                      <p className="text-xs text-amber-800">
                        A report in <strong>{duplicateFound.category}</strong> already exists in this area:
                      </p>

                      <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                        <p className="font-bold text-slate-900">{duplicateFound.title}</p>
                        <p className="text-slate-600">Status: {duplicateFound.status} | Upvotes: {duplicateFound.upvoteCount || 0}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={`/issues/${duplicateFound._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          View Existing Issue
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            issueService.upvoteIssue(duplicateFound._id);
                            toast.success("Upvoted existing issue!");
                          }}
                          className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-lg"
                        >
                          Upvote Existing Instead
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Category:</span>
                      <span className="font-bold text-slate-900">{formData.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Title:</span>
                      <span className="font-bold text-slate-900">{formData.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Priority:</span>
                      <span className="font-bold text-blue-600">{formData.priority}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Location Address:</span>
                      <span className="font-bold text-slate-900">{formData.location.address || "Specified on Map"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Description:</span>
                      <p className="text-slate-800 mt-1 font-medium leading-relaxed">{formData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {submitting ? "Submitting Ticket..." : "Confirm & Submit Issue"}
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportIssue;
