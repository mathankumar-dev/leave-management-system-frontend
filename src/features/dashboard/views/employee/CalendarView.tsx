import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendarCheck,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

const CalendarView: React.FC = () => {
  const { fetchCalendar, loading } = useDashboard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [leaveData, setLeaveData] = useState<Record<number, any[]>>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const loadCalendar = async () => {
      const data = await fetchCalendar(year, month);
      if (data) setLeaveData(data);
    };
    loadCalendar();
  }, [year, month, fetchCalendar]);

  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysArray = useMemo(() => Array.from({ length: daysInMonthCount }, (_, i) => i + 1), [daysInMonthCount]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-6 p-4 bg-slate-50 min-h-screen"
    >
      {/* 1. LEFT COLUMN: NOTE + CALENDAR */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Developmental Note: Moved here so it doesn't break the flex-row layout */}
        {/* <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          System Note: Mapping real-time leave data to calendar grid...
        </div> */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
          )}

          {/* Structured Header */}
          <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 bg-white">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {monthName} {year}
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Availability Overview</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
                <FaChevronLeft size={12} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Day Labels Row */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 border-b border-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-slate-50 py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {d.charAt(0)}
                <span className="hidden md:inline">{d.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 md:h-28 bg-slate-50/50" />
            ))}

            {daysArray.map((day) => {
              const isSelected = selectedDate === day;
              const dailyLeaves = leaveData[day] || [];
              const isToday = new Date().getDate() === day && new Date().getMonth() === month;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-16 md:h-28 p-1.5 md:p-2 text-left flex flex-col transition-all relative group bg-white
                    ${isSelected ? "ring-2 ring-inset ring-indigo-500 z-10 bg-indigo-50/20" : "hover:bg-slate-50"}
                  `}
                >
                  <span className={`text-[11px] md:text-xs font-bold w-6 h-6 flex items-center justify-center rounded transition-all
                    ${isToday ? "bg-indigo-600 text-white shadow-sm" : isSelected ? "text-indigo-600" : "text-slate-700"}
                  `}>
                    {day}
                  </span>
                  
                  {/* Mobile Dots */}
                  <div className="mt-auto flex flex-wrap gap-0.5 justify-center pb-1 md:hidden">
                    {dailyLeaves.slice(0, 3).map((l, i) => (
                      <div key={i} className={`w-1 h-1 rounded-full ${l.color?.replace('text-', 'bg-') || 'bg-indigo-500'}`} />
                    ))}
                  </div>

                  {/* Desktop Tags */}
                  <div className="mt-2 space-y-1 hidden md:block overflow-hidden">
                    {dailyLeaves.slice(0, 2).map((leave, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-100 bg-slate-50/80">
                        <div className={`w-1 h-3 rounded-full ${leave.color?.replace('text-', 'bg-') || 'bg-indigo-500'}`} />
                        <span className="text-[10px] font-semibold text-slate-600 truncate">{leave.name}</span>
                      </div>
                    ))}
                    {dailyLeaves.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-bold pl-1 uppercase tracking-tighter">
                        + {dailyLeaves.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: SIDEBAR */}
      <aside className="w-full xl:w-80 space-y-5 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Attendance List</h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {monthName.slice(0, 3)} {selectedDate}
            </span>
          </div>
          
          <div className="space-y-2">
            {leaveData[selectedDate]?.length > 0 ? (
              leaveData[selectedDate].map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-slate-200 shadow-sm uppercase">
                    {l.name.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{l.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">{l.type || 'On Leave'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                <FaCalendarCheck className="mx-auto text-slate-200 mb-2" size={20} />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Strength</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-widest">Legend</h3>
          <div className="space-y-3">
            {[
              { label: "Annual Leave", color: "bg-indigo-500" },
              { label: "Sick Leave", color: "bg-rose-500" },
              { label: "Casual Leave", color: "bg-amber-500" }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                <span className="text-xs font-medium text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </motion.div>
  );
};

export default CalendarView;