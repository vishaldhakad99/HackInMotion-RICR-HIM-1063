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
  Sparkles,
  Camera,
  Layers,
  Compass,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MapView from "../../components/MapView";
import ImageUploader from "../../components/ImageUploader";
import { issueService } from "../../services/issueService";
import { CATEGORIES, PRIORITY_OPTIONS } from "../../utils/constants";

const STEPS = [
  { id: 1, label: "Category", icon: Layers },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Evidence", icon: Camera },
  { id: 4, label: "Details", icon: FileText },
  { id: 5, label: "Review & Submit", icon: ShieldCheck },
];

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

const categoryColorMap = {
  "Roads & Infrastructure": "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/60",
  "Sanitation & Waste Management": "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  "Electricity & Street Lighting": "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/60",
  "Water Supply & Drainage": "from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-200/60",
  "Public Property": "from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200/60",
  "Parks & Recreation": "from-green-500/10 to-emerald-500/10 text-green-600 border-green-200/60",
  "Illegal Dumping": "from-rose-500/10 to-red-500/10 text-rose-600 border-rose-200/60",
  Streetlights: "from-amber-400/10 to-yellow-500/10 text-amber-500 border-amber-200/60",
  Other: "from-slate-500/10 to-gray-500/10 text-slate-600 border-slate-200/60",
};

const priorityBadges = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const handleStepClick = async (stepId) => {
    if (stepId === currentStep) return;

    if (stepId > 1 && !formData.category) {
      toast.error("Please select an issue category.");
      return;
    }
    if (stepId > 2 && (!formData.location.latitude || !formData.location.longitude)) {
      toast.error("Please select a location on the map.");
      return;
    }
    if (stepId === 5) {
      if (!formData.title.trim()) {
        toast.error("Please enter an issue title.");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Please enter an issue description.");
        return;
      }

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

    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header & Stepper Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-extrabold border border-blue-200/60 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Civic Redressal Portal
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Report a Civic Issue</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Follow the guided steps below to submit an issue with instant location pin and photo evidence.
                </p>
              </div>

              {!submittedIssue && (
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-600">
                  <span>Step {currentStep} of 5</span>
                </div>
              )}
            </div>

            {/* Stepper Progress Bar */}
            {!submittedIssue && (
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center justify-between min-w-[600px] relative">
                  {STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                      <div
                        key={step.id}
                        onClick={() => handleStepClick(step.id)}
                        className="flex items-center flex-1 last:flex-initial group cursor-pointer"
                        title={`Go to ${step.label} step`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-xs ${
                              isActive
                                ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/20 scale-105"
                                : isCompleted
                                ? "bg-emerald-500 text-white shadow-sm group-hover:bg-emerald-600"
                                : "bg-slate-100 text-slate-400 border border-slate-200/70 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-300"
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                          </div>
                          <div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block transition-colors ${
                                isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400 group-hover:text-blue-600"
                              }`}
                            >
                              Step 0{step.id}
                            </span>
                            <span
                              className={`text-xs font-extrabold block transition-colors ${
                                isActive ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400 group-hover:text-slate-700"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        </div>

                        {idx < STEPS.length - 1 && (
                          <div className="flex-1 mx-4 h-1 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                currentStep > step.id ? "bg-emerald-500" : "bg-slate-200"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SUCCESS SCREEN */}
          {submittedIssue ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-6 max-w-2xl mx-auto shadow-sm animate-in fade-in-50 duration-300">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                  Verified Registration
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Issue Reported Successfully!</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your ticket has been logged in the smart city registry and routed to the corresponding municipal department queue.
                </p>
              </div>

              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/90 text-left space-y-3 text-xs shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                  <span className="text-slate-500 font-semibold">Issue Ticket ID:</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">{submittedIssue._id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                  <span className="text-slate-500 font-semibold">Category:</span>
                  <span className="font-bold text-slate-900">{submittedIssue.category}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                  <span className="text-slate-500 font-semibold">Assigned Department:</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {submittedIssue.department?.name || "Automated Department Queue"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Initial Status:</span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">{submittedIssue.status}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => navigate(`/issues/${submittedIssue._id}`)}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
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
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all border border-slate-200"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          ) : (
            /* STEP FORM BODY */
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              {/* STEP 1: CATEGORY SELECTION */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-600" />
                        Step 1 — Select Issue Category
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Choose the category that best describes the civic problem in your area.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat) => {
                      const IconComponent = categoryIconMap[cat.id] || HelpCircle;
                      const isSelected = formData.category === cat.id;
                      const colorStyle = categoryColorMap[cat.id] || "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/60";

                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 group ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20 scale-[1.01]"
                              : "border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/60"
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-all duration-300 ${
                              isSelected
                                ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105"
                                : `bg-gradient-to-br ${colorStyle} border shadow-xs group-hover:scale-105`
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-xs font-black truncate ${isSelected ? "text-blue-950" : "text-slate-900"}`}>{cat.name}</h4>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">{cat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION MAP */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Step 2 — Pin Location on Map
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Use GPS or click directly on the map to pinpoint exact coordinates for municipal crews.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        Address / Landmark Landmark Description
                      </label>
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
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div className="h-84 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
                      <MapView
                        selectable={true}
                        selectedLocation={formData.location}
                        onLocationSelect={handleLocationSelect}
                        zoom={14}
                      />
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 block">Selected GPS Coordinates</span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            Lat: {formData.location.latitude} | Long: {formData.location.longitude}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-extrabold text-[10px] rounded-full">
                        Location Pinned
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: EVIDENCE PHOTO */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        Step 3 — Upload Photo Evidence
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Upload clear photos showing the issue to assist municipal inspection teams.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
                    <ImageUploader
                      images={formData.images}
                      onImageUploaded={(urls) => setFormData({ ...formData, images: urls })}
                      maxFiles={3}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: DESCRIPTION & PRIORITY */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Step 4 — Issue Title & Priority Level
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Provide clear summary details and priority for administrative assignment.</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Issue Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Deep hazardous pothole near primary school entrance"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Detailed Description *</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Explain the issue details, hazards created, duration, and any extra context..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-2">Priority Level</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRIORITY_OPTIONS.map((p) => {
                          const isSelected = formData.priority === p.value;
                          return (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, priority: p.value })}
                              className={`py-3 px-3.5 rounded-2xl text-xs font-black border transition-all duration-200 flex items-center justify-between ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]"
                                  : "bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100"
                              }`}
                            >
                              <span>{p.label}</span>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & DUPLICATE DETECTION */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        Step 5 — Final Review & Duplicate Check
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Review your complaint ticket before logging into the municipal queue.</p>
                    </div>
                  </div>

                  {/* DUPLICATE ALERT CARD */}
                  {duplicateFound && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/90 p-5 rounded-3xl space-y-3.5 shadow-sm">
                      <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>Nearby Similar Issue Detected!</span>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        A reported complaint in <strong>{duplicateFound.category}</strong> already exists in this area:
                      </p>

                      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 text-xs space-y-1.5 shadow-xs">
                        <p className="font-extrabold text-slate-900">{duplicateFound.title}</p>
                        <p className="text-slate-500">Status: <span className="font-bold text-amber-600">{duplicateFound.status}</span> | Upvotes: <span className="font-bold text-blue-600">{duplicateFound.upvoteCount || 0}</span></p>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <a
                          href={`/issues/${duplicateFound._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        >
                          View Existing Ticket
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            issueService.upvoteIssue(duplicateFound._id);
                            toast.success("Upvoted existing issue!");
                          }}
                          className="px-4 py-2 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-bold rounded-xl transition"
                        >
                          Upvote Existing Ticket Instead
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 space-y-3.5 text-xs shadow-inner">
                    <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                      <span className="text-slate-500 font-semibold">Category:</span>
                      <span className="font-extrabold text-slate-900">{formData.category}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                      <span className="text-slate-500 font-semibold">Title:</span>
                      <span className="font-extrabold text-slate-900">{formData.title}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                      <span className="text-slate-500 font-semibold">Priority Level:</span>
                      <span className={`font-extrabold px-2.5 py-0.5 rounded-full border text-[11px] ${priorityBadges[formData.priority] || "bg-blue-50 text-blue-700"}`}>
                        {formData.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/70 pb-2.5">
                      <span className="text-slate-500 font-semibold">Location Address:</span>
                      <span className="font-extrabold text-slate-900">{formData.location.address || "Specified on Map"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Description:</span>
                      <p className="text-slate-800 mt-1 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">{formData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200/70"
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    {submitting ? "Submitting Ticket..." : "Confirm & Submit Ticket"}
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
