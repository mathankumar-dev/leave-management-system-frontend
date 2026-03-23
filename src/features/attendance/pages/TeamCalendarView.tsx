import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaUserCheck,
  FaUserAlt,
} from "react-icons/fa";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
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
  } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (typeof id === 'number') {
      fetchTeamSchedule(id);
      fetchEmployeeCalendar(id);
    }
  }, [year, month, fetchTeamSchedule, fetchEmployeeCalendar, id]);

  const getFormattedDateKey = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysArray = useMemo(
    () => Array.from({ length: daysInMonthCount }, (_, i) => i + 1),
    [daysInMonthCount]
  );

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  const selectedDateKey = getFormattedDateKey(selectedDay);

  const selectedDayTeamLeaves = teamCalendar[selectedDateKey] || [];
  const selectedDayMyStatus = employeeCalendar[selectedDateKey] || [];
  const selectedDayHoliday = PUBLIC_HOLIDAYS_2026[selectedDateKey];

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-1 md:p-0 pb-20">
      <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-4 bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase   tracking-tighter">
              {monthName} {year}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Me</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Team</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all active:scale-90">
              <FaChevronLeft size={10} className="text-slate-600" />
            </button>
            <button onClick={() => { setCurrentDate(new Date()); setSelectedDay(new Date().getDate()); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-slate-200 bg-white hover:bg-slate-50 rounded-sm shadow-sm">
              Current
            </button>
            <button onClick={nextMonth} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all active:scale-90">
              <FaChevronRight size={10} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
              <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
          )}

          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-0">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200 border-b border-slate-200">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-24 md:h-32 bg-slate-50/30" />
            ))}

            {daysArray.map((day) => {
              const dateKey = getFormattedDateKey(day);
              const holiday = PUBLIC_HOLIDAYS_2026[dateKey];
              const isSelected = selectedDay === day;

              const teamDailyLeaves = teamCalendar[dateKey] || [];
              const myDailyStatus = employeeCalendar[dateKey] || [];

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 sm:h-24 md:h-32 p-1 sm:p-2 text-left flex flex-col transition-all relative
                    ${isSelected ? "bg-indigo-50/50 ring-2 ring-inset ring-indigo-500 z-10" : "bg-white hover:bg-slate-50"}
                    ${holiday ? "bg-rose-50/30" : ""}
                    ${myDailyStatus.length > 0 ? "bg-amber-50/30" : ""}
                  `}
                >
                  <span className={`
                    text-[11px] sm:text-xs font-black h-5 w-5 sm:h-7 sm:w-7 flex items-center justify-center rounded-sm
                    ${isToday ? "bg-slate-900 text-white shadow-md" : isSelected ? "text-indigo-600" : "text-slate-400"}
                  `}>
                    {day}
                  </span>

                  <div className="mt-1 hidden sm:block space-y-1 overflow-hidden">
                    {holiday && (
                      <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-sm truncate border border-rose-100">
                        {holiday}
                      </div>
                    )}

                    {/* Render Personal Leave/Status (Yellow) */}
                    {myDailyStatus.map((status, i) => (
                      <div key={`my-${i}`} className="px-1.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[8px] font-black uppercase rounded-sm truncate">
                        ME: Leave
                      </div>
                    ))}

                    {/* Render Team Leaves (Indigo) */}
                    {teamDailyLeaves.slice(0, 1).map((emp, i) => (
                      <div key={`team-${i}`} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-red-600 text-[8px] font-black uppercase rounded-sm truncate">
                        {emp.employeeName}
                      </div>
                    ))}
                  </div>

                  {/* Mobile View Indicators */}
                  <div className="mt-auto flex gap-1 sm:hidden justify-center pb-1">
                    {holiday && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                    {myDailyStatus.length > 0 && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                    {teamDailyLeaves.length > 0 && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* Side Details Panel */}
      <div className="w-full lg:w-80 space-y-3">

        {/* 1. DAILY ACTIVITY SECTION */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Daily Activity</p>
            <p className="text-[10px] font-black text-indigo-600 uppercase  ">{monthName.slice(0, 3)} {selectedDay}</p>
          </div>

          <div className="p-4 min-h-62.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDateKey}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {selectedDayHoliday && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-sm">
                    <p className="text-[9px] font-black text-rose-500 uppercase mb-1">Public Holiday</p>
                    <p className="text-xs font-bold text-rose-900 uppercase tracking-tight leading-none">{selectedDayHoliday}</p>
                  </div>
                )}

                {/* PERSONAL STATUS */}
                {selectedDayMyStatus.map((_, i) => (
                  <div key={`me-${i}`} className="border border-amber-200 p-3 rounded-sm bg-amber-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-sm flex items-center justify-center text-amber-600 border border-amber-200">
                        <FaUserAlt size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">My Attendance</p>
                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Out of Office</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* TEAM LEAVES */}
                {selectedDayTeamLeaves.length > 0 ? (
                  selectedDayTeamLeaves.map((emp) => (
                    <div key={emp.employeeId} className="border border-slate-100 p-3 rounded-sm bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-sm flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">
                          {emp.employeeName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{emp.employeeName}</p>
                          <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Team Member</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (!selectedDayHoliday && selectedDayMyStatus.length === 0) ? (
                  <div className="py-16 text-center flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-sm mb-3">
                      <FaUserCheck size={18} />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Presence</p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 2. YEARLY HOLIDAYS SECTION */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Upcoming Holidays 2026
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(PUBLIC_HOLIDAYS_2026).map(([date, name]) => (
              <div key={date} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">
                    {name}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      weekday: "short"
                    })}
                  </p>
                </div>
                <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[7px] font-black uppercase rounded-sm border border-rose-100">
                  Holiday
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamCalendarView;