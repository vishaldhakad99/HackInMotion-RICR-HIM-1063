import React from "react";
import { CheckCircle2, Clock, FileCheck, ShieldCheck, CheckCheck } from "lucide-react";
import { formatDateTime } from "../utils/helpers";

const STEPS = [
  { status: "Reported", label: "Reported", icon: Clock },
  { status: "Acknowledged", label: "Acknowledged", icon: FileCheck },
  { status: "In Progress", label: "In Progress", icon: Clock },
  { status: "Resolved", label: "Resolved", icon: CheckCircle2 },
  { status: "Verified", label: "Verified", icon: ShieldCheck },
  { status: "Closed", label: "Closed", icon: CheckCheck },
];

const IssueTimeline = ({ currentStatus, statusHistory = [] }) => {
  // Determine index of current status
  let currentIndex = STEPS.findIndex((s) => s.status.toLowerCase() === currentStatus?.toLowerCase());
  if (currentIndex === -1) {
    if (currentStatus === "Reopened") currentIndex = 2; // In Progress equivalent
    else currentIndex = 0;
  }

  return (
    <div className="w-full py-4">
      <h4 className="text-sm font-semibold text-slate-800 mb-6">Issue Progression Timeline</h4>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        {/* Connection line for desktop */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          ></div>
        </div>

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          // Search history entry for timestamp
          const historyEntry = statusHistory.find(
            (h) => h.status?.toLowerCase() === step.status.toLowerCase()
          );

          return (
            <div
              key={step.status}
              className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center w-full md:w-auto"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 shadow-md"
                    : isCompleted
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-slate-400 border-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isCurrent ? "text-blue-600" : isCompleted ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {historyEntry && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatDateTime(historyEntry.date)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssueTimeline;
