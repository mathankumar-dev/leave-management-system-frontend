import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSpinner,
  FaCalendarCheck,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

const TeamCalendarView: React.FC = () => {
  const { fetchTeamSchedule, loading } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [leaveData, setLeaveData] = useState<Record<number, any[]>>({});
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTeamSchedule(year, month);
      if (data) {
        setLeaveData(data.calendar);
        setTeamMembers(data.members);
      }
    };
    loadData();
  }, [year, month, fetchTeamSchedule]);

  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysArray = useMemo(() => Array.from({ length: daysInMonthCount }, (_, i) => i + 1), [daysInMonthCount]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-6 p-4"
    >
      {/* 1. CALENDAR SECTION */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-xl">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        )}

        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{monthName} {year}</h2>
            <p className="text-xs font-medium text-slate-500">Team Availability Overview</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* CALENDAR GRID - Responsive Scrollable Area */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] lg:min-w-0 grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-slate-50 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {d}
              </div>
            ))}

            {/* Empty spacers */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28 bg-slate-50/50" />
            ))}

            {/* Day Cells */}
            {daysArray.map((day) => {
              const isSelected = selectedDate === day;
              const dailyLeaves = leaveData[day] || [];
              const isToday = new Date().getDate() === day && new Date().getMonth() === month;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-28 p-2 text-left flex flex-col transition-all relative group bg-white hover:bg-slate-50
                    ${isSelected ? "ring-2 ring-inset ring-indigo-500 z-10" : ""}
                  `}
                >
                  <span className={`text-xs font-bold ${isToday ? "bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-slate-700"}`}>
                    {day}
                  </span>
                  
                  <div className="mt-2 space-y-1">
                    {dailyLeaves.slice(0, 2).map((leave, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-medium text-indigo-700 truncate">{leave.name.split(' ')[0]}</span>
                      </div>
                    ))}
                    {dailyLeaves.length > 2 && (
                      <p className="text-[10px] text-slate-400 font-bold pl-1">
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

      {/* 2. SIDEBAR SECTION */}
      <div className="w-full xl:w-80 space-y-6">
        {/* Selected Day Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Day Details</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {monthName.slice(0, 3)} {selectedDate}
            </span>
          </div>
          
          <div className="space-y-3">
            {leaveData[selectedDate]?.length > 0 ? (
              leaveData[selectedDate].map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-xs font-bold text-indigo-600 border border-slate-200 shadow-sm">
                    {l.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{l.name}</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">{l.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg">
                <FaCalendarCheck className="mx-auto text-slate-200 mb-2" size={20} />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Strength</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <FaPlus size={10} /> Request Leave
          </button>
        </div>

        {/* Team List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Team Availability</h3>
          <div className="space-y-4">
            {teamMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border border-slate-200">
                      {m.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${m.onLeave ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{m.name}</p>
                    <p className="text-[10px] font-medium text-slate-500">{m.onLeave ? 'Away' : 'Available'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCalendarView;