import React, { useState, useEffect } from "react";
import { Building2, Plus, Mail, User, CheckCircle2, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { departmentService } from "../../services/departmentService";

const Departments = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await departmentService.getDepartments();

      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load departments."
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
                Municipal Departments
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Manage departmental routing queues, contacts, and active status.
              </p>
            </div>
          </div>

          {loading ? (
            <Loader text="Loading department records..." />
          ) : error ? (
            <ErrorMessage
              message={error}
              onRetry={fetchDepartments}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <span className="px-2.5 py-1 bg-slate-100 font-mono text-[10px] font-bold text-slate-700 rounded-lg">
                      {dept.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {dept.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">
                        Department Head:
                      </span>

                      <span className="font-bold text-slate-800">
                        {dept.headName || "Unassigned"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">
                        Contact Email:
                      </span>

                      <span className="font-medium text-slate-700">
                        {dept.contactEmail ||
                          "contact@civic.gov.in"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div>
                      <p className="font-bold text-slate-900">
                        {dept.stats?.totalIssues || 0}
                      </p>

                      <p className="text-slate-400 text-[10px]">
                        Total
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-amber-600">
                        {dept.stats?.openIssues || 0}
                      </p>

                      <p className="text-slate-400 text-[10px]">
                        Pending
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-emerald-600">
                        {dept.stats?.resolvedIssues || 0}
                      </p>

                      <p className="text-slate-400 text-[10px]">
                        Resolved
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Departments;