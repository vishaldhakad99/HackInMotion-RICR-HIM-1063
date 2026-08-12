import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
};

export default Loader;