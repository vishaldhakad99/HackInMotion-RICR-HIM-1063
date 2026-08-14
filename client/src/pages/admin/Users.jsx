import React, { useState, useEffect } from "react";
import { Users as UsersIcon, Shield, Search, Mail, Calendar, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { formatDate } from "../../utils/helpers";

const Users = () => {
  const { user: currentUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      let fetchedList = [];
      if (res.success && Array.isArray(res.data || res.users)) {
        fetchedList = res.data || res.users;
      }

      // Default fallback if database is empty or initial
      if (fetchedList.length === 0) {
        fetchedList = [
          {
            _id: "1",
            name: "Rahul Citizen",
            email: "citizen@example.com",
            role: "user",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            name: "Civic Admin",
            email: "admin@civic.gov.in",
            role: "admin",
            createdAt: new Date().toISOString(),
          },
        ];
      }

      // Ensure currently logged in user is included in the list
      if (currentUser && currentUser.email) {
        const exists = fetchedList.some(
          (u) =>
            (u.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            (u._id && currentUser._id && u._id === currentUser._id)
        );

        if (!exists) {
          fetchedList = [
            {
              _id: currentUser._id || "current-logged-in-user",
              name: currentUser.name || "Administrator",
              email: currentUser.email,
              role: currentUser.role || "admin",
              avatar: currentUser.avatar,
              createdAt: currentUser.createdAt || new Date().toISOString(),
            },
            ...fetchedList,
          ];
        }
      }

      setUsers(fetchedList);
    } catch {
      // If error, ensure current logged in user is displayed
      if (currentUser && currentUser.email) {
        setUsers([
          {
            _id: currentUser._id || "current-logged-in-user",
            name: currentUser.name || "Administrator",
            email: currentUser.email,
            role: currentUser.role || "admin",
            avatar: currentUser.avatar,
            createdAt: currentUser.createdAt || new Date().toISOString(),
          },
        ]);
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">User Directory</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Platform Users</h1>
              <p className="text-xs text-slate-500 mt-1">
                Overview of registered citizens and municipal administrators.
              </p>
            </div>

            {currentUser && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Current user" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {currentUser.name || "Logged In User"}
                    <span className="text-[10px] text-blue-600 font-extrabold">(You)</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">{currentUser.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name or Gmail address..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Gmail / Email Address</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => {
                    const isCurrent =
                      currentUser &&
                      ((u.email && u.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
                        (u._id && currentUser._id && u._id === currentUser._id));

                    return (
                      <tr
                        key={u._id || u.email}
                        className={`hover:bg-slate-50 transition ${
                          isCurrent ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{u.name ? u.name.charAt(0).toUpperCase() : "U"}</span>
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900">{u.name}</span>
                              {isCurrent && (
                                <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-full">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Currently Logged In
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-800 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.role === "admin"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {u.role === "admin" && <Shield className="w-3 h-3 text-emerald-600" />}
                            {u.role === "admin" ? "Administrator" : "Citizen"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatDate(u.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;