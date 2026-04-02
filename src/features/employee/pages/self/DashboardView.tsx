import { useEmployeeDashboard } from "@/features/dashboard/hooks";
import LeaveDetailsDrawer from "@/features/leave/components/LeaveDetailsDrawer";
import type { LeaveTypeBreakDown } from "@/features/leave/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, Divider } from "@/shared/components";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaPlus, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



interface StatItem {
  title: string;
  used: number;
  total?: number;
  pendingCount?: number;
  balance? : number;
}

const DashboardView = () => {

  const { fetchDashboard, setError } = useEmployeeDashboard();
  const { user } = useAuth();

  const [monthly, setMonthly] = useState({
    annualAllocated: 0,
    annualUsed: 0,
    annualBalance: 0,
    sickAllocated: 0,
    sickUsed: 0,
    sickBalance: 0,
    totalBalance: 0
  });

  const [stats, setStats] = useState<StatItem[]>([]);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<StatItem | null>(null);
  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {

    if (!user?.id) return;

    try {

      setLoading(true);

      const data = await fetchDashboard(user.id);

      const breakdown: LeaveTypeBreakDown[] = data.breakdown || [];

      const sick = breakdown.find(b => b.leaveTypeName?.includes("SICK"));

      const annual = breakdown.find(b => b.leaveTypeName?.includes("ANNUAL"));
      

      setMonthly({
        annualAllocated: data.monthlyAnnualAllocated || 0,
        annualUsed: data.monthlyAnnualUsed || 0,
        annualBalance: data.monthlyAnnualBalance || 0,
        sickAllocated: data.monthlySickAllocated || 0,
        sickUsed: data.monthlySickUsed || 0,
        sickBalance: data.monthlySickBalance || 0,
        totalBalance: data.monthlyTotalBalance || 0
      });

      setStats([
        {
          title: "Sick Leave",
          used: sick?.usedDays ?? 0,
          total: sick?.allocatedDays ?? 0,
          pendingCount: sick?.pendingCount ?? 0,
          balance : sick?.remainingDays ?? 0
        },
        {
          title: "Annual Leave",
          used: annual?.usedDays ?? 0,
          total: annual?.allocatedDays ?? 0,
          pendingCount: annual?.pendingCount ?? 0,
          balance : annual?.remainingDays ?? 0
        },
        {
          title: "Total Leave Count",
          used: data.yearlyUsed,
          total: data.yearlyAllocated
        },
        {
          title: "Carry Forward",
          used: (data.carryForwardTotal || 0) - (data.carryForwardRemaining || 0),
          total: data.carryForwardTotal
        },
        {
          title: "Comp Off",
          used: data.compoffBalance,
          total: data.compoffBalance
        }
      ]);

      setApproved(data.approvedCount);
      setRejected(data.rejectedCount);

    } catch (e: any) {

      setError(e.message);

    } finally {

      setLoading(false);

    }

  }, [user?.id]);


  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  const userRole = user?.role?.toUpperCase();

  const basePathMap = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    TEAM_LEADER: "/manager",
    HR: "/hr",
    ADMIN: "/manager",
    CFO: "/manager",
  };

  const basePath = basePathMap[userRole as keyof typeof basePathMap] || "/employee";
  const handleNavigate = (path: string) => {
    // 1. If the path already starts with the basePath, don't append it again
    // 2. If the path is already absolute (starts with /), just use it
    const finalPath = path.startsWith('/') ? path : `${basePath}/${path}`;

    navigate(finalPath);
  };

  if (loading) return <CustomLoader label="Loading dashboard..." />;


  return (

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto  space-y-6"
    >

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-xl font-semibold">
            Welcome, {user?.name}
          </h1>

          <p className="text-xs text-gray-500">
            Track leave balances & requests
          </p>

        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate('request-center')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-indigo-700"
        >
          <FaPlus size={12} />
          Apply Leave
        </motion.button>

      </div>


      {/* MONTHLY */}
      <div className="flex gap-2 flex-col rounded p-2" >
        <span className="font-bold text-2xl" >Monthly Stats</span>
        <div className="grid md:grid-cols-3 gap-4">

          <MiniCard
            title="Annual Leave"
            used={monthly.annualUsed}
            balance={monthly.annualBalance}
            total={monthly.annualAllocated}
            color="indigo"


          />

          <MiniCard
            title="Sick Leave"
            used={monthly.sickUsed}
            total={monthly.sickAllocated}
            balance={monthly.sickBalance}

            color="pink"
          />

          <HighlightCard
            title="Total Monthly Balance"
            value={monthly.totalBalance}
          />

        </div>
      </div>



      {/* STATUS */}

      <div className="grid md:grid-cols-3 gap-4">

        <StatCard
          title="Approved"
          value={approved}
          icon={<FaCheckCircle />}
          color="green"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon={<FaTimesCircle />}
          color="red"
        />

        {/* <StatCard
          title="LOP In Days"
          value={lopPercent}
          icon={<FaClock />}
          color="yellow"
        /> */}

      </div>



      {/* TABLE */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl border shadow-sm overflow-hidden"
      >

        <table className="w-full text-sm">

          <thead className="text-xs text-white border-b bg-gray-50">

            <tr className="bg-black">
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-center">Allocated (yearly)</th>
              <th className="p-3 text-center">Used</th>
              <th className="p-3 text-center">Balance</th>
              <th className="p-3 text-center">Pending</th>
            </tr>

          </thead>


          <tbody>


            {stats.map((s, i) => {

              return (

                <motion.tr
                  key={i}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  onClick={() => setSelectedCard(s)}
                  className="border-b cursor-pointer"
                >
                  <td className="p-3 font-medium">
                    {s.title}
                  </td>
                  <td className="text-center text-black">
                    {s.total ?? "-"}
                  </td>
                  <td className="text-center font-semibold text-indigo-600">
                    {s.used}
                  </td>
                  <td className="text-center font-semibold text-indigo-600">
                    {s.balance}
                  </td>

                  <td className="text-center">

                    {s.pendingCount ? (

                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                        {s.pendingCount}
                      </span>

                    ) : "-"}

                  </td>

                </motion.tr>

              );

            })}

          </tbody>

        </table>

      </motion.div>



      <LeaveDetailsDrawer
        open={!!selectedCard}
        stat={selectedCard}
        onClose={() => setSelectedCard(null)}
        onClick={() => handleNavigate('request-center')}
      />


      {/* {user?.role !== "EMPLOYEE" && (

        <MyFloatingActionButton
          icon={<FaPlus />}
          onClick={() => handleNavigate('request-center')}
          title="Apply Leave"
        />

      )} */}

    </motion.div>

  );

};

export default DashboardView;



// progress card
const MiniCard = ({ title, used, total, balance, color = "indigo" }: any) => {

  const percent = total ? (used / total) * 100 : 0;

  const colorMap: any = {

    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    green: "bg-green-200",
    yellow: "bg-yellow-500"

  };

  return (

    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      <p className="text-xs text-gray-500">
        {title}
      </p>
      <div className="flex justify-between mt-1 text-sm">

        <span className="text-gray-400">
          {used} used
        </span>
        <Divider />
        <span className="font-semibold">
          {total} total
        </span>
        <Divider />
        <span className="font-semibold">
          {balance} balance
        </span>



      </div>

      <div className="h-2 bg-gray-100 rounded mt-3 overflow-hidden">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8 }}
          className={`h-2 rounded ${colorMap[color]}`}
        />

      </div>

    </motion.div>

  );

};


// highlight card
const HighlightCard = ({ title, value }: any) => (

  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-white border rounded-xl p-4 shadow-sm"
  >

    <p className="text-xs opacity-80">
      {title}
    </p>

    <h2 className="text-3xl font-bold mt-1">
      {value}
    </h2>

  </motion.div>

);


// stat card
const StatCard = ({ title, value, color, icon }: any) => {

  const colorMap: any = {

    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50"

  };

  return (

    <motion.div
      whileHover={{ y: -4 }}
      className={`border rounded-xl p-4 shadow-sm ${colorMap[color]}`}
    >

      <div className="flex justify-between items-center">

        <p className="text-xs font-medium">
          {title}
        </p>

        <div className="opacity-70">
          {icon}
        </div>

      </div>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </motion.div>

  );

};