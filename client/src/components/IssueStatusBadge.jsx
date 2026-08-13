import React from "react";
import { getStatusBadgeClass } from "../utils/helpers";

const IssueStatusBadge = ({ status, size = "md" }) => {
  const badgeClass = getStatusBadgeClass(status);
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${badgeClass} ${
        sizeClasses[size] || sizeClasses.md
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {status || "Reported"}
    </span>
  );
};

export default IssueStatusBadge;
