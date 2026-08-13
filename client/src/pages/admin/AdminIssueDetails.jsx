import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Save,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import MapView from "../../components/MapView";
import ImageUploader from "../../components/ImageUploader";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { departmentService } from "../../services/departmentService";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../utils/constants";
import { formatDateTime, getImageUrl, getPriorityBadgeClass } from "../../utils/helpers";

const AdminIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Controls
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [updating, setUpdating] = useState(false);

  // Resolution Form
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [resolutionPhotos, setResolutionPhotos] = useState([]);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchIssue();
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getDepartments();
      if (res.success && res.data) setDepartments(res.data);
    } catch {}
  };

  const fetchIssue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getAdminIssueById(id);
      if (res.success && res.data) {
        setIssue(res.data);
        setSelectedStatus(res.data.status || "Reported");
        setSelectedDepartment(res.data.department?._id || "");
        setSelectedPriority(res.data.priority || "Medium");
        if (res.data.resolution) {
          setResolutionDetails(res.data.resolution.details || "");
          setResolutionPhotos(res.data.resolution.proofPhotos || []);
        }
      } else {
        setError("Issue not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issue details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusAndDept = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await issueService.updateStatus(id, {
        status: selectedStatus,
        department: selectedDepartment || undefined,
        priority: selectedPriority,
      });
      if (res.success) {
        toast.success("Issue status and assignment updated!");
        fetchIssue();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update issue.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!resolutionDetails.trim()) {
      toast.error("Please enter resolution details/notes.");
      return;
    }

    try {
      setResolving(true);
      const res = await issueService.submitResolution(id, {
        details: resolutionDetails,
        proofPhotos: resolutionPhotos,
      });

      if (res.success) {
        toast.success("Resolution submitted successfully!");
        fetchIssue();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit resolution.");
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 p-8"><Loader text="Loading issue management data..." /></main>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 p-8"><ErrorMessage message={error || "Issue not found"} onRetry={fetchIssue} /></main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/issues")}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold">#{issue._id}</span>
                <h1 className="text-xl font-extrabold">{issue.title}</h1>
              </div>
            </div>

            <IssueStatusBadge status={issue.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details & Map */}
            <div className="lg:col-span-2 space-y-6">
              {/* Evidence Images */}
              {issue.images && issue.images.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Original Evidence Photo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {issue.images.map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        <img src={getImageUrl(img)} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Information Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Issue Details</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{issue.description}</p>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold">Reported By:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{issue.reportedBy?.name || "Citizen"}</p>
                    <p className="text-slate-500 text-[11px]">{issue.reportedBy?.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Category:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{issue.category}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Location Pin
                </h3>
                <p className="text-xs text-slate-600">{issue.location?.address || issue.location?.city}</p>
                <div className="h-60 rounded-2xl overflow-hidden">
                  <MapView issues={[issue]} zoom={15} center={[issue.location?.latitude || 19.076, issue.location?.longitude || 72.8777]} />
                </div>
              </div>
            </div>

            {/* Right Column: Admin Actions */}
            <div className="space-y-6">
              {/* Status & Department Update Form */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Management & Routing
                </h3>

                <form onSubmit={handleUpdateStatusAndDept} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Status Workflow</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assign Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="">Select Department...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Set Priority</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
                  >
                    {updating ? "Saving Changes..." : "Save Management Updates"}
                  </button>
                </form>
              </div>

              {/* Submit Resolution Form */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Submit Official Resolution
                </h3>

                <form onSubmit={handleSubmitResolution} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Resolution Notes / Action Taken *</label>
                    <textarea
                      rows={3}
                      value={resolutionDetails}
                      onChange={(e) => setResolutionDetails(e.target.value)}
                      placeholder="Describe work completed by repair crew..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Upload Resolution Proof Photo</label>
                    <ImageUploader
                      images={resolutionPhotos}
                      onImageUploaded={(urls) => setResolutionPhotos(urls)}
                      maxFiles={2}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resolving}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                  >
                    {resolving ? "Submitting..." : "Mark Issue as Resolved"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminIssueDetails;
