import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

const TeamCalendarView: React.FC = () => {
  const { fetchTeamSchedule, loading, error } = useDashboard();

  // State for dynamic data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [leaveData, setLeaveData] = useState<Record<number, any[]>>({});
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Fetch data on month change
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

  // 2. Calendar Logic
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const daysArray = useMemo(() => Array.from({ length: daysInMonthCount }, (_, i) => i + 1), [daysInMonthCount]);

  // 3. Navigation
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-6 p-2 md:p-4 max-w-[1400px] mx-auto"
    >
      {/* 1. CALENDAR SECTION */}
      <div className="flex-1 bg-white border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-sm relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{monthName}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{year} Schedule</p>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={nextMonth} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-7 gap-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase pb-2 tracking-widest">{d}</div>
          ))}

          {/* Spacers for first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 bg-slate-50/30 rounded-[1.5rem]" />
          ))}

          {daysArray.map((day) => {
            const isSelected = selectedDate === day;
            const dailyLeaves = leaveData[day] || [];
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`h-24 p-3 rounded-[1.5rem] border-2 text-left flex flex-col justify-between transition-all ${isSelected ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white border-slate-50 hover:border-slate-200 text-slate-900"
                  }`}
              >
                <span className="font-black text-sm">{day}</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {dailyLeaves.slice(0, 3).map((leave, idx) => (
                    <div key={idx} className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-slate-900' : 'border-white'} ${leave.color || 'bg-indigo-500'} flex items-center justify-center text-[7px] font-black text-white`}>
                      {leave.name.charAt(0)}
                    </div>
                  ))}
                  {dailyLeaves.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[7px] font-black text-slate-500">
                      +{dailyLeaves.length - 3}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIDEBAR SECTION */}
      <div className="w-full lg:w-96 space-y-6">
        {/* Active Team Status */}
        <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-7 shadow-sm">
          <h3 className="font-black text-slate-900 tracking-tight">Team Members</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Availability Status</p>

          <div className="space-y-3 mt-6">
            {teamMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-900 border border-slate-100">
                      {m.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${m.onLeave ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{m.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.onLeave ? 'On Leave' : 'Active'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden">
          <h3 className="font-black text-slate-900 mb-6 tracking-tight">Daily Breakdown: Jan {selectedDate}</h3>
          <div className="space-y-4">
            {leaveData[selectedDate]?.length > 0 ? (
              leaveData[selectedDate].map((l, i) => (
                <div key={i} className="flex gap-4 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">{l.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{l.name}</p>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">{l.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Strength Team</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2">
            <FaPlus size={10} /> Plan Your Leave
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCalendarView;