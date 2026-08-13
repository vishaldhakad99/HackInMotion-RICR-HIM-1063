import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  ThumbsUp,
  Building2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  User,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import IssueTimeline from "../../components/IssueTimeline";
import MapView from "../../components/MapView";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { issueService } from "../../services/issueService";
import { formatDate, formatDateTime, getImageUrl, getPriorityBadgeClass } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / Form States
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopening, setReopening] = useState(false);

  const [verifyComment, setVerifyComment] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchIssueDetails();
  }, [id]);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issueService.getIssueById(id);
      if (res.success && res.data) {
        setIssue(res.data);
      } else {
        setError(res.message || "Issue not found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issue details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await issueService.upvoteIssue(id);
      if (res.success) {
        toast.success(res.message);
        fetchIssueDetails();
      }
    } catch (err) {
      toast.error("Failed to process upvote.");
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      toast.error("Please provide a reason for reopening.");
      return;
    }

    try {
      setReopening(true);
      const res = await issueService.reopenIssue(id, reopenReason);
      if (res.success) {
        toast.success("Issue reopened successfully!");
        setReopenModalOpen(false);
        setReopenReason("");
        fetchIssueDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reopen failed.");
    } finally {
      setReopening(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const res = await issueService.verifyIssue(id, {
        status: "verified",
        comment: verifyComment || "Citizen confirmed issue status.",
      });
      if (res.success) {
        toast.success("Community verification submitted!");
        setVerifyComment("");
        fetchIssueDetails();
      }
    } catch (err) {
      toast.error("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 p-8">
            <Loader text="Loading detailed issue records..." />
          </main>
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
          <main className="flex-1 p-8">
            <ErrorMessage message={error || "Issue not found"} onRetry={fetchIssueDetails} />
          </main>
        </div>
      </div>
    );
  }

  const isReporter = user?._id === issue.reportedBy?._id;
  const isUpvoted = issue.upvotes?.some((u) => (typeof u === "object" ? u._id : u) === user?._id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <span>{issue.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <IssueStatusBadge status={issue.status} size="lg" />
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityBadgeClass(issue.priority)}`}>
                  {issue.priority || "Medium"} Priority
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">{issue.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Reported by {issue.reportedBy?.name || "Citizen"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Submitted {formatDateTime(issue.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Department: {issue.department?.name || "Automated Routing"}</span>
              </div>
            </div>
          </div>

          {/* Issue Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <IssueTimeline currentStatus={issue.status} />
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Issue Content & Photos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Evidence Images */}
              {issue.images && issue.images.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Reported Evidence Photos
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

              {/* Description */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Issue Description</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                  {issue.description}
                </p>
              </div>

              {/* RESOLUTION DETAILS CARD (If resolved) */}
              {issue.resolution && issue.resolution.details && (
                <div className="bg-emerald-50/70 border-2 border-emerald-300 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>Resolution Report & Proof</span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {issue.resolution.details}
                  </p>

                  {issue.resolution.proofPhotos && issue.resolution.proofPhotos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-emerald-900">Resolution Proof Photo:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {issue.resolution.proofPhotos.map((photo, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-white">
                            <img src={getImageUrl(photo)} alt="Resolution Proof" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-emerald-800 font-medium pt-2 border-t border-emerald-200/80">
                    Resolved by {issue.resolution.resolvedBy?.name || "Municipal Team"} on{" "}
                    {formatDate(issue.resolution.resolvedAt)}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Map & Actions */}
            <div className="space-y-6">
              {/* Location Map */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Issue Location
                </h3>
                <p className="text-xs text-slate-600">{issue.location?.address || issue.location?.city}</p>

                <div className="h-60 rounded-2xl overflow-hidden">
                  <MapView issues={[issue]} zoom={15} center={[issue.location?.latitude || 19.076, issue.location?.longitude || 72.8777]} />
                </div>
              </div>

              {/* Citizen Actions */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Citizen Actions</h3>

                <button
                  onClick={handleUpvote}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                    isUpvoted
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isUpvoted ? "fill-current" : ""}`} />
                  <span>{issue.upvoteCount || 0} Upvotes</span>
                </button>

                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Confirm Status / Verify</span>
                </button>

                {(issue.status === "Resolved" || issue.status === "Verified") && (
                  <button
                    onClick={() => setReopenModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4 text-purple-600" />
                    <span>Reopen Issue</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* REOPEN MODAL */}
          {reopenModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Reopen Issue Ticket</h3>
                <p className="text-xs text-slate-500">
                  Please explain why this issue is not satisfactorily resolved.
                </p>

                <textarea
                  rows={4}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Provide specific details..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setReopenModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={reopening}
                    onClick={handleReopen}
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow"
                  >
                    {reopening ? "Reopening..." : "Submit Reopen Request"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default IssueDetails;
