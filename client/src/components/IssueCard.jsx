import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ThumbsUp, Calendar, ArrowRight, Building2 } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";
import { formatDate, getImageUrl, getPriorityBadgeClass } from "../utils/helpers";

const IssueCard = ({ issue, onUpvote, isUpvoted = false }) => {
  const coverImage = issue.images && issue.images.length > 0 ? getImageUrl(issue.images[0]) : getImageUrl(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={issue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = getImageUrl(null);
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <IssueStatusBadge status={issue.status} size="sm" />
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getPriorityBadgeClass(issue.priority)}`}>
            {issue.priority || "Medium"}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 mb-1.5">
            <span className="bg-blue-50 px-2 py-0.5 rounded-md">{issue.category}</span>
            {issue.department?.name && (
              <span className="flex items-center gap-1 text-slate-500">
                <Building2 className="w-3 h-3" />
                {issue.department.name}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
            {issue.description}
          </p>
        </div>

        <div>
          {/* Location & Date */}
          <div className="flex flex-col gap-1.5 text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{issue.location?.address || issue.location?.city || "Location specified on map"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Reported on {formatDate(issue.createdAt)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => onUpvote && onUpvote(issue._id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isUpvoted
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? "fill-current" : ""}`} />
              <span>{issue.upvoteCount || issue.upvotes?.length || 0} Upvotes</span>
            </button>

            <Link
              to={`/issues/${issue._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
