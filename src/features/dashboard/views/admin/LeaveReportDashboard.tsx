import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaBriefcase,
  FaHospital,
  FaPlane,
  FaHome,
  FaPrint,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";
import { MOCK_LEAVE_HISTORY, MOCK_TEAM_MEMBERS } from "../../../../mockData";

/* ------------------------------ COMPONENT ------------------------------ */

function LeaveReportDashboard() {
  const printRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [showMoreEmp, setShowMoreEmp] = useState(false);
  const [showMoreMgr, setShowMoreMgr] = useState(false);

  /* -------------------------- FILTER LOGIC -------------------------- */

  const filterBySearch = (list: any[]) =>
    list.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.dept.toLowerCase().includes(search.toLowerCase())
    );

  const employees = useMemo(
    () =>
      filterBySearch(
        MOCK_TEAM_MEMBERS.filter(
          (m) => !m.role.toLowerCase().includes("manager")
        )
      ),
    [search]
  );

  const managers = useMemo(
    () =>
      filterBySearch(
        MOCK_TEAM_MEMBERS.filter((m) =>
          m.role.toLowerCase().includes("manager")
        )
      ),
    [search]
  );

  /* -------------------------- LEAVE STATS -------------------------- */

  const leaveStats = useMemo(() => {
    return {
      Sick: MOCK_LEAVE_HISTORY.filter((l) => l.type === "Sick").length,
      Annual: MOCK_LEAVE_HISTORY.filter((l) => l.type === "Annual").length,
      Casual: 1,
      WFH: 1,
    };
  }, []);

  /* ---------------------------- PRINT ---------------------------- */

  const handlePrint = () => {
    if (!printRef.current) return;

    const win = window.open("", "", "width=1000,height=700");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Leave Report</title>
          <style>
            body { font-family: Arial; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  /* ------------------------------ UI ------------------------------ */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Admin Leave Report</h1>
          <p className="text-sm text-slate-500">
            Search by name, role or department
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded hover:bg-indigo-600 transition"
        >
          <FaPrint /> Print
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-3 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role, department..."
          className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div ref={printRef} className="space-y-14">
        {/* EMPLOYEES */}
        <Section
          title="Employees"
          icon={<FaUsers />}
          data={employees}
          leaveStats={leaveStats}
          showMore={showMoreEmp}
          toggleShowMore={() => setShowMoreEmp(!showMoreEmp)}
        />

        {/* MANAGERS */}
        <Section
          title="Managers"
          icon={<FaUserTie />}
          data={managers}
          leaveStats={leaveStats}
          showMore={showMoreMgr}
          toggleShowMore={() => setShowMoreMgr(!showMoreMgr)}
        />
      </div>
    </div>
  );
}

/* -------------------------- SECTION -------------------------- */

function Section({
  title,
  icon,
  data,
  leaveStats,
  showMore,
  toggleShowMore,
}: {
  title: string;
  icon: React.ReactNode;
  data: any[];
  leaveStats: any;
  showMore: boolean;
  toggleShowMore: () => void;
}) {
  const visibleData = showMore ? data : data.slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2">
        {icon} {title}
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Count" value={data.length} icon={<FaUsers />} />
        <StatCard title="Sick" value={leaveStats.Sick} icon={<FaHospital />} />
        <StatCard title="Annual" value={leaveStats.Annual} icon={<FaPlane />} />
        <StatCard title="Casual" value={leaveStats.Casual} icon={<FaBriefcase />} />
        <StatCard title="WFH" value={leaveStats.WFH} icon={<FaHome />} />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>

          <AnimatePresence>
            <tbody>
              {visibleData.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border-t"
                >
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.dept}</td>
                  <td className="p-3">{p.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">{p.email}</td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* SHOW MORE */}
      {data.length > 10 && (
        <button
          onClick={toggleShowMore}
          className="text-indigo-600 text-sm font-semibold hover:underline"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

/* -------------------------- STAT CARD -------------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-slate-300 text-xl">{icon}</div>
      </div>
    </motion.div>
  );
}

export default LeaveReportDashboard;
