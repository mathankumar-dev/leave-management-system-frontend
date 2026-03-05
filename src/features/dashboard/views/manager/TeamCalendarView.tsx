import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendarCheck,
  FaInfoCircle,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import { PUBLIC_HOLIDAYS_2026 } from "../../../../constants/holidays";

const TeamCalendarView: React.FC = () => {
  const { user } = useAuth();
  const managerId = user?.id;

  const { fetchTeamSchedule, teamCalendar, loading } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Fetch data with Type Guard to fix "number | undefined" error
  useEffect(() => {
    if (typeof managerId === 'number') {
      fetchTeamSchedule(managerId);
    }
  }, [year, month, fetchTeamSchedule, managerId]);

  // 2. Helper to match Backend & Holiday Keys
  const getFormattedDateKey = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // Calendar Math
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
  const selectedDayLeaves = teamCalendar[selectedDateKey] || [];
  const selectedDayHoliday = PUBLIC_HOLIDAYS_2026[selectedDateKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-6 p-2 md:p-4 pb-24"
    >
      {/* 1. CALENDAR GRID SECTION */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-xl">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {monthName} {year}
            </h2>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Team Absence Tracker
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 transition-all">
              <FaChevronLeft size={14} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 transition-all">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-slate-50 py-2 text-center text-[10px] font-black text-slate-400 uppercase">
              {d}
            </div>
          ))}

          {/* Spacers */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 md:h-28 bg-slate-50/30" />
          ))}

          {/* Days */}
          {daysArray.map((day) => {
            const dateKey = getFormattedDateKey(day);
            const holiday = PUBLIC_HOLIDAYS_2026[dateKey];
            const isSelected = selectedDay === day;
            const dailyLeaves = teamCalendar[dateKey] || [];
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-14 md:h-28 p-1 md:p-2 text-left flex flex-col transition-all relative group
                  ${isSelected ? "ring-2 ring-inset ring-indigo-500 z-10 bg-indigo-50/30" : "bg-white hover:bg-slate-50"}
                  ${holiday ? "bg-rose-50/40" : ""}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[11px] md:text-xs font-bold h-6 w-6 flex items-center justify-center rounded-lg
                    ${isToday ? "bg-indigo-600 text-white shadow-md" : isSelected ? "text-indigo-600" : "text-slate-700"}
                  `}>
                    {day}
                  </span>
                  {holiday && <FaUmbrellaBeach className="text-rose-400 mt-1 md:hidden" size={10} />}
                </div>

                {/* Holiday Label (Desktop) */}
                {holiday && (
                  <div className="mt-1 hidden md:block">
                    <p className="text-[9px] font-black text-rose-600 bg-rose-100/50 px-1 py-0.5 rounded truncate uppercase">
                      {holiday}
                    </p>
                  </div>
                )}

                {/* Employee Leaves */}
                <div className="mt-auto space-y-1 hidden md:block overflow-hidden">
                  {dailyLeaves.slice(0, 2).map((emp, idx) => (
                    <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100">
                      <div className="w-1 h-1 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-bold text-amber-800 truncate">
                        {emp.employeeName.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                  {dailyLeaves.length > 2 && (
                    <p className="text-[9px] text-slate-400 font-bold pl-1">+ {dailyLeaves.length - 2}</p>
                  )}
                </div>

                {/* Mobile Dots */}
                <div className="mt-auto flex gap-0.5 md:hidden justify-center pb-1">
                  {dailyLeaves.length > 0 && <div className="w-1 h-1 rounded-full bg-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIDEBAR SECTION */}
      <div className="w-full xl:w-80 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Details</h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
              {monthName.slice(0, 3)} {selectedDay}
            </span>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar">
            {/* Show Holiday Info in Sidebar */}
            {selectedDayHoliday && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-[10px] font-black text-rose-500 uppercase">Public Holiday</p>
                <p className="text-xs font-bold text-rose-900">{selectedDayHoliday}</p>
              </div>
            )}

            {selectedDayLeaves.length > 0 ? (
              selectedDayLeaves.map((emp) => (
                <div key={emp.employeeId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-xs font-black text-indigo-600 border border-slate-200 shadow-sm">
                      {emp.employeeName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{emp.employeeName}</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">On Leave</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black">Remaining</p>
                      <p className="text-xs font-bold text-slate-700">{emp.totalRemaining ?? 0} Days</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black">LOP Impact</p>
                      <p className="text-xs font-bold text-red-500">{emp.lopPercentage ?? 0}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : !selectedDayHoliday ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                <FaCalendarCheck className="mx-auto text-slate-200 mb-2" size={24} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Absences</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <FaInfoCircle size={14} />
            <h4 className="text-xs font-bold uppercase tracking-wider">Quick Info</h4>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            Selected dates show employee leave balances and Loss of Pay (LOP) calculations directly from the payroll system.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCalendarView;           