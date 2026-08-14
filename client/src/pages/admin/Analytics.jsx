import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  RefreshCw,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import MapView from "../../components/MapView";
import { analyticsService } from "../../services/analyticsService";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

const Analytics = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [overview, setOverview] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [hotspotsData, setHotspotsData] = useState([]);
  const [resolutionTimeData, setResolutionTimeData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        ovRes,
        catRes,
        stRes,
        deptRes,
        hotRes,
        resTimeRes,
      ] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getCategories(),
        analyticsService.getStatus(),
        analyticsService.getDepartments(),
        analyticsService.getHotspots(),
        analyticsService.getResolutionTime(),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (catRes.success) setCategoriesData(catRes.data || []);
      if (stRes.success) setStatusData(stRes.data?.breakdown || []);
      if (deptRes.success) setDeptData(deptRes.data || []);
      if (hotRes.success) setHotspotsData(hotRes.data || []);
      if (resTimeRes.success) {
        setResolutionTimeData(resTimeRes.data || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load analytics metrics."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() =>
          setMobileSidebarOpen(!mobileSidebarOpen)
        }
      />

      <div className="flex-1 flex w-full">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                City Analytics & Performance
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Data-driven insights on complaint volume, category
                resolution rates, and departmental turnaround.
              </p>
            </div>

            <button
              onClick={fetchAllAnalytics}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
              title="Refresh Analytics"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <Loader text="Computing city analytics and Recharts visualizations..." />
          ) : error ? (
            <ErrorMessage
              message={error}
              onRetry={fetchAllAnalytics}
            />
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Total City Reports
                  </span>

                  <p className="text-3xl font-black text-slate-900">
                    {overview?.totalIssues || 0}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Resolution Rate
                  </span>

                  <p className="text-3xl font-black text-emerald-600">
                    {overview?.resolutionRate || 0}%
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Avg Turnaround (Hours)
                  </span>

                  <p className="text-3xl font-black text-blue-600">
                    {overview?.avgResolutionTimeHours || 0} hrs
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Total Upvotes
                  </span>

                  <p className="text-3xl font-black text-indigo-600">
                    {overview?.totalUpvotes || 0}
                  </p>
                </div>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issues by Category Bar Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Issues by Category
                  </h3>

                  <div className="h-72 w-full">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={categoriesData}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />

                        <YAxis tick={{ fontSize: 10 }} />

                        <Tooltip />

                        <Bar
                          dataKey="totalIssues"
                          fill="#3b82f6"
                          name="Total Issues"
                          radius={[4, 4, 0, 0]}
                        />

                        <Bar
                          dataKey="resolvedIssues"
                          fill="#10b981"
                          name="Resolved Issues"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution Pie Chart */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Issue Status Distribution
                  </h3>

                  <div className="h-72 w-full flex items-center justify-center">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={50}
                          paddingAngle={3}
                          label={({ status, count }) =>
                            `${status}: ${count}`
                          }
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Department Performance Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Department Performance Breakdown
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">
                          Department
                        </th>

                        <th className="py-3 px-4">
                          Total Issues
                        </th>

                        <th className="py-3 px-4">
                          Resolved
                        </th>

                        <th className="py-3 px-4">
                          Pending
                        </th>

                        <th className="py-3 px-4">
                          Resolution Rate
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 font-medium">
                      {deptData.map((dept) => (
                        <tr
                          key={dept.departmentId}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {dept.name} ({dept.code})
                          </td>

                          <td className="py-3 px-4 font-bold">
                            {dept.totalIssues}
                          </td>

                          <td className="py-3 px-4 text-emerald-600 font-bold">
                            {dept.resolvedIssues}
                          </td>

                          <td className="py-3 px-4 text-amber-600 font-bold">
                            {dept.openIssues}
                          </td>

                          <td className="py-3 px-4 font-bold text-blue-600">
                            {dept.resolutionRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;