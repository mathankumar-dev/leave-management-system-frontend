import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  User,
  LayoutDashboard,
  Users,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";

import DashboardView from "../../employee/DashboardView";
import ManagerDashboardView from "../../manager/ManagerDashboardView";
import TeamCalendarView from "../../manager/TeamCalendarView";

/* ================= TYPES ================= */

interface Admin {
  name: string;
  role: string;
  email: string;
  leaveBalance: number;
}

interface LeaveStats {
  totalApplied: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface Leave {
  id: number;
  type: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

interface TabButtonProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface ProfileCardProps {
  admin: Admin;
}

interface BalanceCardProps {
  leaveBalance: number;
}

interface TotalAppliedCardProps {
  total: number;
}

interface StatusCardProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: number;
  bg: string;
}

/* ================= MAIN COMPONENT ================= */

const AdminDashboardView = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const admin: Admin = {
    name: "Admin User",
    role: "System Administrator",
    email: "admin@company.com",
    leaveBalance: 14,
  };

  const leaveStats: LeaveStats = {
    totalApplied: 12,
    approved: 7,
    pending: 3,
    rejected: 2,
  };

  const recentLeaves: Leave[] = [
    { id: 1, type: "Sick Leave", status: "Approved", date: "2025-01-10" },
    { id: 2, type: "Casual Leave", status: "Pending", date: "2025-02-02" },
    { id: 3, type: "Annual Leave", status: "Rejected", date: "2025-02-15" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 p-8 max-w-7xl mx-auto"
      >
      

        {/* 🔷 TABS */}
        <div className="flex gap-4 flex-wrap">
          <TabButton

            icon={LayoutDashboard}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            icon={Users}
            label="Employee"
            active={activeTab === "employee"}
            onClick={() => setActiveTab("employee")}
          />
          <TabButton
            icon={Briefcase}
            label="Manager"
            active={activeTab === "manager"}
            onClick={() => setActiveTab("manager")}
          />
          <TabButton
            icon={CalendarDays}
            label="Calendar"
            active={activeTab === "calendar"}
            onClick={() => setActiveTab("calendar")}
          />
        </div>

        {/* ================= TAB CONTENT ================= */}

        {activeTab === "overview" && (
          <>
            {/* Profile Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <ProfileCard admin={admin} />
              <BalanceCard leaveBalance={admin.leaveBalance} />
              <TotalAppliedCard total={leaveStats.totalApplied} />
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatusCard
                icon={CheckCircle}
                label="Approved"
                value={leaveStats.approved}
                bg="bg-green-500"
              />
              <StatusCard
                icon={Clock}
                label="Pending"
                value={leaveStats.pending}
                bg="bg-amber-500"
              />
              <StatusCard
                icon={XCircle}
                label="Rejected"
                value={leaveStats.rejected}
                bg="bg-red-500"
              />
            </div>

            {/* Recent Leaves */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="font-semibold mb-4 text-gray-700">
                Recent Leave Requests
              </h2>

              <div className="space-y-4">
                {recentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-none"
                  >
                    <div>
                      <p className="font-medium">{leave.type}</p>
                      <p className="text-xs text-gray-400">{leave.date}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : leave.status === "Pending"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "employee" && <DashboardView scope="ALL" />}
        {activeTab === "manager" && <ManagerDashboardView />}
        {activeTab === "calendar" && <TeamCalendarView />}
      </motion.div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const TabButton = ({
  icon: Icon,
  label,
  active,
  onClick,
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const ProfileCard = ({ admin }: ProfileCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
    <div className="flex items-center gap-4">
      <div className="bg-blue-600 text-white p-3 rounded-full">
        <User size={26} />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{admin.name}</h2>
        <p className="text-gray-500 text-sm">{admin.role}</p>
        <p className="text-gray-400 text-xs">{admin.email}</p>
      </div>
    </div>
  </div>
);

const BalanceCard = ({ leaveBalance }: BalanceCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition flex flex-col justify-center">
    <p className="text-sm text-gray-500">Leave Balance</p>
    <h2 className="text-3xl font-bold text-blue-600">
      {leaveBalance} Days
    </h2>
  </div>
);

const TotalAppliedCard = ({ total }: TotalAppliedCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">Total Applied</p>
      <h2 className="text-2xl font-bold">{total}</h2>
    </div>
    <CalendarDays className="text-blue-600" size={26} />
  </div>
);

const StatusCard = ({
  icon: Icon,
  label,
  value,
  bg,
}: StatusCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className={`${bg} p-3 rounded-full text-white`}>
      <Icon size={20} />
    </div>
  </div>
);

export default AdminDashboardView;