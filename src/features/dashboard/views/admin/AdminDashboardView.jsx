import { motion } from "framer-motion";
import DashboardView from "../../dashboard/views/DashboardView";
import ManagerDashboardView from "../../dashboard/views/ManagerDashboardView";
import TeamCalendarView from "../../calendar/TeamCalendarView";

const AdminDashboardView = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 p-4 max-w-7xl mx-auto"
    >
      {/* EMPLOYEE OVERVIEW */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
          Employee Dashboard (All Employees)
        </h2>
        <DashboardView scope="ALL" />
      </section>

      {/* MANAGER OVERVIEW */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
          Manager Dashboard (All Teams)
        </h2>
        <ManagerDashboardView scope="ALL" />
      </section>

      {/* ORGANIZATION CALENDAR */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
          Organization Calendar
        </h2>
        <TeamCalendarView />
      </section>
    </motion.div>
  );
};

export default AdminDashboardView;
