export const CATEGORIES = [
  { id: "Roads & Infrastructure", name: "Roads", icon: "Road", description: "Potholes, broken roads, damaged pavements, bridges" },
  { id: "Sanitation & Waste Management", name: "Sanitation", icon: "Trash2", description: "Uncollected garbage, overflowing dumpsters, street sweeping" },
  { id: "Electricity & Street Lighting", name: "Electricity", icon: "Zap", description: "Power lines, streetlights out, open transformer boxes" },
  { id: "Water Supply & Drainage", name: "Water & Drainage", icon: "Droplets", description: "Pipe leaks, low pressure, waterlogging, sewage overflow" },
  { id: "Public Property", name: "Public Property", icon: "Building", description: "Damaged benches, bus shelters, vandalized public property" },
  { id: "Parks & Recreation", name: "Parks", icon: "Trees", description: "Overgrown trees, broken playground equipment, unkept parks" },
  { id: "Illegal Dumping", name: "Illegal Dumping", icon: "AlertTriangle", description: "Unauthorized debris dumping, hazardous material, debris" },
  { id: "Streetlights", name: "Streetlights", icon: "Lightbulb", description: "Flickering lights, broken poles, dark stretches" },
  { id: "Other", name: "Other", icon: "HelpCircle", description: "Any civic complaint not listed above" },
];

export const STATUS_OPTIONS = [
  { value: "Reported", label: "Reported", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "Acknowledged", label: "Acknowledged", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "In Progress", label: "In Progress", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { value: "Resolved", label: "Resolved", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "Verified", label: "Verified", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { value: "Closed", label: "Closed", color: "bg-slate-100 text-slate-700 border-slate-300" },
  { value: "Reopened", label: "Reopened", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "Rejected", label: "Rejected", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

export const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "Medium", label: "Medium", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800 border-red-200" },
];

export const ROLES = {
  CITIZEN: "user",
  ADMIN: "admin",
};
