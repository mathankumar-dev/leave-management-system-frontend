import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  FaChartLine,
  FaCheckCircle,
  FaClock, 
  FaPlus,
  FaTimesCircle,
} from "react-icons/fa";

import StatCard from "../../components/StatCard";
import RecentLeavePopup from "../../components/popup";
import LeaveDetailsDrawer from "../../components/LeaveDetailsDrawer";

import { useDashboard } from "../../hooks/useDashboard";


// ✅ MOCK DATA IMPORT
import {
  MOCK_CHART_DATA,
  MOCK_DASHBOARD_STATS,
  MOCK_LEAVE_HISTORY,
} from "../../../../mockData";

import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import ActivityCard from "../../../../components/ui/ActivityCard";


export type DashboardScope = "SELF" | "TEAM" | "ALL";

interface DashboardViewProps {
  scope?: DashboardScope;
  onNavigate?: (tab: string) => void;
}



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const statusConfig: Record<
  string,
  { type: "success" | "warning" | "danger"; icon: React.ReactNode }
> = {
  Approved: { type: "success", icon: <FaCheckCircle /> },
  Pending: { type: "warning", icon: <FaClock /> },
  Rejected: { type: "danger", icon: <FaTimesCircle /> },
};



const DashboardView: React.FC<DashboardViewProps> = ({
  scope = "SELF",
  onNavigate,
}) => {

  const { fetchStats, setError } = useDashboard();


  // ✅ USE MOCK DATA AS DEFAULT
  const [stats, setStats] = useState<any[]>(MOCK_DASHBOARD_STATS);

  const [chartData, setChartData] = useState<any[]>(MOCK_CHART_DATA);

  const [recentLeaves, setRecentLeaves] = useState<any[]>(MOCK_LEAVE_HISTORY);



  const [fetching, setFetching] = useState(true);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);




  const loadDashboardData = useCallback(async () => {

    try {

      setFetching(true);

      const data = await fetchStats(scope);


      // ✅ ONLY REPLACE IF API RETURNS DATA

      if (data?.summaryStats)
        setStats(data.summaryStats);

      if (data?.chartData)
        setChartData(data.chartData);

      if (data?.recentLeaves)
        setRecentLeaves(data.recentLeaves);


    } catch (err: any) {

      console.log("API Failed → Using MOCK DATA");

      setError(err?.message || "Mock Data Used");

    } finally {

      setFetching(false);

    }

  }, [fetchStats, scope, setError]);



  useEffect(() => {

    loadDashboardData();

  }, [loadDashboardData]);




  if (fetching) {

    return (

      <div className="flex flex-col items-center justify-center h-screen space-y-4">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full"
        />

        <p className="text-slate-400 font-bold animate-pulse text-xs">

          Loading Dashboard...

        </p>

      </div>

    );

  }



  const handleAdd = () => {

    onNavigate?.("Apply Leave");

  };


  const handleSelectLeave = (id: number) => {

    console.log("Selected Leave:", id);

  };



  return (

    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 max-w-7xl mx-auto"
    >



      {/* RECENT LEAVES */}

      {recentLeaves.map((req) => {

        const config = statusConfig[req.status];

        return (

          <ActivityCard
            key={req.id}
            title={req.type}
            subtitle={req.range}
            label={`${req.days} Days`}
            statusText={req.status}
            statusType={config?.type}
            icon={config?.icon}
            description={req.comment}
            onClick={() => handleSelectLeave(req.id)}
          />

        );

      })}




      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {stats.map((stat, i) => (

          <motion.div
            key={i}
            variants={itemVariants}
            onClick={() => setSelectedCard(stat.title)}
          >

            <StatCard
              title={stat.title}
              used={stat.used}
              total={stat.total}
              color={stat.color}
              period="ANNUAL CYCLE 2026"
            />

          </motion.div>

        ))}

      </div>




      {/* CHART */}

      <div className="bg-white border rounded-md p-5 shadow-sm">

        <div className="flex justify-between mb-4">

          <h4 className="text-xs font-bold text-slate-400">

            Monthly Utilization

          </h4>

          <FaChartLine className="text-slate-300" />

        </div>


        <div className="h-48">

          <ResponsiveContainer>

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />


              <Bar dataKey="Casual">

                <LabelList dataKey="Casual" position="top" />

              </Bar>


              <Bar dataKey="Sick">

                <LabelList dataKey="Sick" position="top" />

              </Bar>


            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>




      {/* POPUP */}

      <RecentLeavePopup latestLeave={recentLeaves[0]} />




      {/* DRAWER */}

      <LeaveDetailsDrawer
        open={!!selectedCard}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />




      {/* FLOAT BUTTON */}

      <MyFloatingActionButton
        icon={<FaPlus />}
        onClick={handleAdd}
        title="New Leave Request"
        tooltipLabel="Apply Leave"
      />



    </motion.div>

  );

};


export default DashboardView;
