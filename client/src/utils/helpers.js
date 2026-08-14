export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

export const getImageUrl = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&auto=format&fit=crop&q=60";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "http://localhost:5000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Reported":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Acknowledged":
      return "bg-sky-100 text-sky-800 border-sky-300";
    case "In Progress":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "Resolved":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Verified":
      return "bg-teal-100 text-teal-800 border-teal-300";
    case "Closed":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Reopened":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Rejected":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 border-red-300 font-semibold";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Medium":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};
