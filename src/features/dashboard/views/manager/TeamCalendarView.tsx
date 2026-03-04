import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendarCheck,
  FaInfoCircle,
  FaUmbrellaBeach,
  FaUserCheck,
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

  useEffect(() => {
    if (typeof managerId === 'number') {
      fetchTeamSchedule(managerId);
    }
  }, [year, month, fetchTeamSchedule, managerId]);

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
  const selectedDayLeaves = teamCalendar[selectedDateKey] || [];
  const selectedDayHoliday = PUBLIC_HOLIDAYS_2026[selectedDateKey];

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-1 md:p-0 pb-20">
      
      {/* LEFT: CALENDAR MAIN */}
      <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        
        {/* TOP TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-4 bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
              {monthName} {year}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance Overview</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
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

        {/* CALENDAR BODY */}
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
              const dailyLeaves = teamCalendar[dateKey] || [];
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
                    {dailyLeaves.slice(0, 2).map((emp, i) => (
                      <div key={i} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-black uppercase rounded-sm truncate">
                        {emp.employeeName.split(" ")[0]}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-1 sm:hidden justify-center pb-1">
                    {holiday && <div className="w-1 h-1 bg-rose-500 rounded-full" />}
                    {dailyLeaves.length > 0 && <div className="w-1 h-1 bg-indigo-500 rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR (CLEAN STYLE) */}
      <div className="w-full lg:w-80 space-y-3">
        
        {/* DETAILS CARD */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Daily Activity</p>
            <p className="text-[10px] font-black text-indigo-600 uppercase italic">{monthName.slice(0, 3)} {selectedDay}</p>
          </div>

          <div className="p-4 min-h-[300px]">
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

                {selectedDayLeaves.length > 0 ? (
                  selectedDayLeaves.map((emp) => (
                    <div key={emp.employeeId} className="border border-slate-100 p-3 rounded-sm hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-sm flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200">
                           {emp.employeeName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{emp.employeeName}</p>
                          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Out of Office</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <div className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-sm">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Balance</p>
                          <p className="text-xs font-black text-slate-700 leading-none mt-1">{emp.totalRemaining?.toFixed(1)}d</p>
                        </div>
                        <div className="flex-1 p-2 bg-rose-50/50 border border-rose-100 rounded-sm">
                          <p className="text-[8px] font-black text-rose-400 uppercase">LOP</p>
                          <p className="text-xs font-black text-rose-600 leading-none mt-1">{emp.lopPercentage}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : !selectedDayHoliday ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-sm mb-3">
                      <FaUserCheck size={18} />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Fully Present</p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* SYSTEM INFO FOOTER */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-sm">
           <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <FaInfoCircle size={12} />
              <p className="text-[9px] font-black uppercase tracking-widest">Help Center</p>
           </div>
           <p className="text-[10px] font-bold text-indigo-900/60 leading-relaxed uppercase tracking-tight italic">
             Data is updated every 24 hours from the central payroll registry.
           </p>
        </div>
      </div>
    </div>
  );
};

export default TeamCalendarView;