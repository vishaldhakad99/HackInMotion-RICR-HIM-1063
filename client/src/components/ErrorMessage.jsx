import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message = "Something went wrong. Please try again.", onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};


export default ErrorMessage;
