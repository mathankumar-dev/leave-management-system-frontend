import { useCalendar } from "@/features/attendance/hooks/useCalendar";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaUserAlt,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../../../shared/auth/useAuth";
import { PUBLIC_HOLIDAYS_2026 } from "../../../shared/constants/holidays";

const TeamCalendarView: React.FC = () => {
  const { user } = useAuth();
  const id = user?.id;
  const {
    fetchTeamSchedule,
    teamCalendar,
    loading,
    fetchEmployeeCalendar,
    employeeCalendar
  } = useCalendar();
  const { fetchEmployeeName } = useEmployee();
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (typeof id === 'string') {
      fetchTeamSchedule(id);
      fetchEmployeeCalendar(id);
    }
  }, [year, month, id]);

  // ---------------- DATE FORMATTER ----------------
  const formatKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getFormattedDateKey = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // ---------------- VIEW LOGIC ----------------
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const weeklyData = useMemo(() => {
    const d = new Date(currentDate);
    const diff = d.getDate() - d.getDay();
    const start = new Date(d.setDate(diff));

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = formatKey(day);
      return {
        date: day,
        team: teamCalendar[key] || [],
        mine: employeeCalendar[key] || [],
        holiday: PUBLIC_HOLIDAYS_2026[key]
      };
    });
  }, [currentDate, teamCalendar, employeeCalendar]);

  const dailyKey = formatKey(currentDate);
  const dailyTeam = teamCalendar[dailyKey] || [];
  const dailyMine = employeeCalendar[dailyKey] || [];
  const dailyHoliday = PUBLIC_HOLIDAYS_2026[dailyKey];

  console.log(teamCalendar);



  // ---------------- NAVIGATION ----------------
  const handleMove = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() + direction);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + (direction * 7));
    else newDate.setDate(newDate.getDate() + direction);

    setCurrentDate(newDate);
    setSelectedDay(newDate.getDate());
  };

  const selectedDateKey = getFormattedDateKey(selectedDay);
  const selectedDayTeamLeaves = teamCalendar[selectedDateKey] || [];
  const selectedDayMyStatus = employeeCalendar[selectedDateKey] || [];
  const selectedDayHoliday = PUBLIC_HOLIDAYS_2026[selectedDateKey];

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-1 md:p-0 pb-20 bg-slate-50/50">
      <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">

        {/* HEADER SECTION */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              {viewMode === "month" && `${monthName} ${year}`}
              {viewMode === "week" && `Week ${currentDate.getDate()} - ${monthName}`}
              {viewMode === "day" && currentDate.toDateString()}
            </h2>
            <div className="flex gap-4 mt-1">
              <LegendItem color="bg-amber-400" label="Me" />
              <LegendItem color="bg-indigo-500" label="Team" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex border border-slate-200 rounded-sm p-1 bg-slate-50 mr-2">
              {/* View Switcher with Icon + Text */}
              <div className="flex border border-slate-200 rounded-sm p-1 bg-slate-50 mr-2 shadow-inner">
                <ViewTab
                  active={viewMode === 'month'}
                  onClick={() => setViewMode('month')}
                  icon={<FaCalendarAlt size={12} />}
                  label="Monthly"
                />
                <ViewTab
                  active={viewMode === 'week'}
                  onClick={() => setViewMode('week')}
                  icon={<FaCalendarWeek size={12} />}
                  label="Weekly"
                />
                <ViewTab
                  active={viewMode === 'day'}
                  onClick={() => setViewMode('day')}
                  icon={<FaCalendarDay size={12} />}
                  label="Daily"
                />
              </div>
            </div>

            <button onClick={() => handleMove(-1)} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all"><FaChevronLeft size={10} /></button>
            <button onClick={() => { setCurrentDate(new Date()); setViewMode('month'); }} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border border-slate-200 bg-white hover:bg-slate-50 rounded-sm shadow-sm">Today</button>
            <button onClick={() => handleMove(1)} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all"><FaChevronRight size={10} /></button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="relative flex-1">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
              <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* MONTH VIEW */}
            {viewMode === "month" && (
              <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2.5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-0">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 sm:h-32 bg-slate-50/30" />
                  ))}
                  {Array.from({ length: daysInMonthCount }).map((_, i) => {
                    const day = i + 1;
                    const key = getFormattedDateKey(day);
                    const team = teamCalendar[key] || [];
                    const mine = employeeCalendar[key] || [];
                    const holiday = PUBLIC_HOLIDAYS_2026[key];
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => { setSelectedDay(day); setCurrentDate(new Date(year, month, day)) }}
                        className={`h-20 sm:h-32 p-1.5 sm:p-2 text-left flex flex-col transition-all relative border-r border-b border-slate-100 
        ${isSelected ? "bg-indigo-50/50 ring-2 ring-inset ring-indigo-500 z-10" : "bg-white hover:bg-slate-50"} 
        ${holiday ? "bg-rose-50/20" : ""}`}
                      >
                        {/* TOP ROW: Date + Count Badges */}
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] sm:text-[11px] font-black h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-sm 
          ${isSelected ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                            {day}
                          </span>

                          <div className="flex gap-1">
                            {mine.length > 0 && <CountBadge color="amber" count={mine.length} />}
                            {team.length > 0 && <CountBadge color="indigo" count={team.length} />}
                          </div>
                        </div>

                        {/* CENTER/BOTTOM: Holiday & Employee Names */}
                        <div className="flex-1 overflow-hidden space-y-0.5 hidden sm:block">
                          {holiday && (
                            <div className="px-1 py-0.5 bg-rose-100/50 border border-rose-200 text-rose-600 text-[7px] font-black uppercase rounded-sm truncate">
                              {holiday}
                            </div>
                          )}

                          {/* MINE */}
                          {mine.length > 0 && (
                            <div className="px-1 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[7px] font-black uppercase rounded-sm truncate">
                              ME: LEAVE
                            </div>
                          )}

                          {/* TEAM NAMES (Show first 2-3 then a +count) */}
                          {team.slice(0, 2).map((emp: any, idx: number) => (
                            <div key={idx} className="px-1 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[7px] font-black uppercase rounded-sm truncate">
                              <TeamMemberName employeeId={emp.employeeId} />
                            </div>
                          ))}

                          {team.length > 2 && (
                            <p className="text-[7px] font-black text-slate-400 px-1 uppercase">
                              + {team.length - 2} MORE
                            </p>
                          )}
                        </div>

                        {/* MOBILE INDICATORS (Dots only for small screens) */}
                        <div className="mt-auto flex gap-0.5 sm:hidden justify-center">
                          {mine.length > 0 && <div className="w-1 h-1 bg-amber-400 rounded-full" />}
                          {team.length > 0 && <div className="w-1 h-1 bg-indigo-500 rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* WEEK VIEW */}
            {viewMode === "week" && (
              <motion.div key="week" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 grid grid-cols-1 md:grid-cols-7 gap-3">
                {weeklyData.map((d, i) => (
                  <div key={i} className="border border-slate-200 rounded-sm p-4 min-h-75 flex flex-col bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{d.date.toDateString().split(' ')[0]}</p>
                    <p className="text-xl font-black text-slate-900 mb-4">{d.date.getDate()}</p>
                    <div className="space-y-2 flex-1">
                      {d.holiday && <StatusBadge color="rose" label={d.holiday} />}
                      {d.mine.map((_, idx) => <StatusBadge key={idx} color="amber" label="My Leave" />)}
                      {d.team.map((r: any, idx: number) => (
                        <StatusBadge
                          key={idx}
                          color="indigo"
                          label={<TeamMemberName employeeId={r.employeeId} />}
                        />
                      ))}                      {(!d.holiday && d.mine.length === 0 && d.team.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                          <FaUserCheck size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DAY VIEW */}
            {viewMode === "day" && (
              <motion.div key="day" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-2xl mx-auto">
                <div className="bg-slate-900 text-white p-6 rounded-sm mb-6 flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                      {viewMode === 'day' ? 'Daily Schedule' : viewMode === 'week' ? 'Weekly Overview' : 'Monthly Summary'}
                    </p>
                    <h3 className="text-2xl font-black mt-1">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                  </div>
                  <FaCalendarDay className="text-slate-700 opacity-50" size={40} />
                </div>

                <div className="space-y-4">
                  {dailyHoliday && <DayRecord title="Public Holiday" content={dailyHoliday} color="rose" />}

                  {dailyMine.map((r: any, i: number) => (
                    <DayRecord
                      key={`mine-${i}`}
                      title="My Attendance"
                      content={r.leaveTypeName || "Out of Office"}
                      color="amber"
                    />
                  ))}

                  {/* UPDATED TEAM SECTION */}
                  {dailyTeam.map((r: any, i: number) => (
                    <DayRecord
                      key={`team-${i}`}
                      title={<TeamMemberName employeeId={r.employeeId} />}
                      content={r.leaveTypeName || "Team Absence"}
                      color="indigo"
                    />
                  ))}

                  {(dailyTeam.length === 0 && dailyMine.length === 0 && !dailyHoliday) && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-sm">
                      <FaUserCheck className="mx-auto text-slate-200 mb-3" size={30} />
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Full Team Presence</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SIDE DETAILS PANEL (Remains consistent across views) */}
      <div className="w-full lg:w-80 space-y-3 shrink-0">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 border-b pb-2 border-slate-100">
            Quick Detail: {selectedDay} {monthName.slice(0, 3)}
          </p>
          <div className="space-y-3 min-h-[150px]">
            {selectedDayHoliday && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-sm">
                <p className="text-[9px] font-black text-rose-500 uppercase">Holiday</p>
                <p className="text-xs font-bold text-rose-900">{selectedDayHoliday}</p>
              </div>
            )}

            {selectedDayMyStatus.map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-sm">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 flex items-center justify-center rounded-sm">
                  <FaUserAlt size={12} />
                </div>
                <p className="text-xs font-black text-slate-900 uppercase truncate">My Leave</p>
              </div>
            ))}

            {selectedDayTeamLeaves.length > 0 ? (
              selectedDayTeamLeaves.map((emp: any) => (
                <div key={emp.employeeId} className="flex items-center gap-3 p-3 border border-slate-100 rounded-sm">
                  {/* Using a generic icon because the name is fetched asynchronously */}
                  <div className="w-8 h-8 bg-slate-100 text-slate-500 flex items-center justify-center rounded-sm">
                    <FaUserAlt size={10} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-black text-slate-900 uppercase truncate">
                      <TeamMemberName employeeId={emp.employeeId} />
                    </p>
                    {/* Optional: Add a sub-label if your data includes leave types */}
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      Team Member
                    </p>
                  </div>
                </div>
              ))
            ) : (
              !selectedDayHoliday && selectedDayMyStatus.length === 0 && (
                <div className="flex flex-col items-center py-10 opacity-30">
                  <FaUserCheck size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest mt-2">No Records</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upcoming Holidays</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(PUBLIC_HOLIDAYS_2026).map(([date, name]) => (
              <div key={date} className="p-3 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-900 uppercase truncate">{name}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[7px] font-black rounded-sm border border-rose-100 uppercase tracking-tighter">Day Off</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

const ViewTab = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 transition-all rounded-sm
      ${active
        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}
    `}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
      {label}
    </span>
  </button>
);

const StatusBadge = ({ color, label }: { color: 'rose' | 'amber' | 'indigo', label: React.ReactNode }) => {
  const styles = {
    rose: "bg-rose-50 border-rose-100 text-rose-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600"
  };
  return <div className={`px-2 py-1 border text-[8px] font-black uppercase rounded-sm truncate ${styles[color]}`}>{label}</div>;
};

const DayRecord = ({ title, content, color }: { title: React.ReactNode, content: string, color: 'rose' | 'amber' | 'indigo' }) => {
  const styles = {
    rose: "bg-rose-50/50 border-rose-200",
    amber: "bg-amber-50/50 border-amber-200",
    indigo: "bg-indigo-50/50 border-indigo-200"
  };
  return (
    <div className={`p-4 border-l-4 rounded-sm shadow-sm bg-white ${styles[color]}`}>
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">{title}</p>
      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight mt-0.5">{content}</p>
    </div>
  );
};
const CountBadge = ({ color, count }: { color: 'indigo' | 'amber', count: number }) => {
  const styles = {
    indigo: "bg-indigo-600 text-white",
    amber: "bg-amber-500 text-white"
  };

  return (
    <span className={`
      text-[8px] font-black min-w-[14px] h-[14px] px-1 
      flex items-center justify-center rounded-full shadow-sm
      ${styles[color]}
    `}>
      {count}
    </span>
  );
};
const TeamMemberName = ({ employeeId }: { employeeId: string }) => {
  const [name, setName] = useState<string>("Loading...");
  const { fetchEmployeeName } = useEmployee();

  useEffect(() => {
    const getName = async () => {
      try {
        const result = await fetchEmployeeName(employeeId);

        // CHECK: If result is an object, grab the 'empName' property
        if (result && typeof result === 'object') {
          setName(result.empName || "Unknown");
        } else {
          setName(result || "Unknown");
        }
      } catch (err) {
        setName("Error");
      }
    };
    if (employeeId) getName();
  }, [employeeId, fetchEmployeeName]);

  return <>{name}</>;
};
export default TeamCalendarView;