import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSpinner,
  FaCalendarCheck,
  FaUsers,
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
      className="flex flex-col xl:flex-row gap-6 p-2 md:p-4 pb-24" // Extra bottom padding for mobile
    >
      {/* 1. CALENDAR SECTION */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl md:rounded-xl p-4 md:p-6 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-xl">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
          </div>
        )}

        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{monthName} {year}</h2>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Team Availability</p>
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

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="bg-slate-50 py-2 text-center text-[10px] font-black text-slate-400 uppercase">
              {d}
            </div>
          ))}

          {/* Empty spacers */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 md:h-28 bg-slate-50/30" />
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
                className={`h-14 md:h-28 p-1 md:p-2 text-left flex flex-col transition-all relative group bg-white
                  ${isSelected ? "ring-2 ring-inset ring-indigo-500 z-10 bg-indigo-50/30" : "hover:bg-slate-50"}
                `}
              >
                <span className={`text-[11px] md:text-xs font-bold h-6 w-6 flex items-center justify-center rounded-lg transition-colors
                  ${isToday ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : isSelected ? "text-indigo-600" : "text-slate-700"}
                `}>
                  {day}
                </span>

                {/* Dot Indicators for Mobile (Saves Space) */}
                <div className="mt-auto flex flex-wrap gap-0.5 justify-center pb-1 md:hidden">
                  {dailyLeaves.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  ))}
                  {dailyLeaves.length > 3 && <div className="w-1 h-1 rounded-full bg-slate-300" />}
                </div>

                {/* Desktop Labels */}
                <div className="mt-2 space-y-1 hidden md:block">
                  {dailyLeaves.slice(0, 2).map((leave, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-medium text-indigo-700 truncate">{leave.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {dailyLeaves.length > 2 && (
                    <p className="text-[10px] text-slate-400 font-bold pl-1">+ {dailyLeaves.length - 2} more</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIDEBAR SECTION (Becomes Bottom Details on Mobile) */}
      <div className="w-full xl:w-80 space-y-4">
        {/* Selected Day Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Who's Away?</h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
              {monthName.slice(0, 3)} {selectedDate}
            </span>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar">
            {leaveData[selectedDate]?.length > 0 ? (
              leaveData[selectedDate].map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-xs font-black text-indigo-600 border border-slate-200 shadow-sm">
                    {l.name.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{l.name}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">{l.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                <FaCalendarCheck className="mx-auto text-slate-200 mb-2" size={24} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Strength</p>
              </div>
            )}
          </div>
        </div>

        {/* Team List Card - Collapsible or scrollable on mobile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers size={14} className="text-slate-400" />
            <h3 className="font-bold text-slate-800 text-sm">Team Roster</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {teamMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[11px] font-black text-slate-500 border border-slate-200">
                      {m.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${m.onLeave ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{m.name}</p>
                    <p className={`text-[10px] font-bold uppercase ${m.onLeave ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {m.onLeave ? 'On Leave' : 'Available'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center z-30">
        <FaPlus size={20} />
      </button>
    </motion.div>
  );
};

export default TeamCalendarView;