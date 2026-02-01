import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaCircle } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

const CalendarView: React.FC = () => {
  const { fetchCalendar, loading } = useDashboard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveData, setLeaveData] = useState<Record<number, any[]>>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Fetch data whenever the month/year changes
  useEffect(() => {
    const loadCalendar = async () => {
      const data = await fetchCalendar(year, month);
      if (data) setLeaveData(data);
    };
    loadCalendar();
  }, [year, month, fetchCalendar]);

  // Calendar Logic
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  const days = [];
  // Previous month spacers
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/30 border border-slate-100/50" />);
  }

  // Active days
  for (let d = 1; d <= daysInMonth(year, month); d++) {
    const dayLeaves = leaveData[d] || [];
    days.push(
      <div key={d} className="h-32 bg-white border border-slate-100 p-2 group hover:bg-slate-50 transition-colors relative">
        <span className="text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors">{d}</span>
        
        <div className="mt-2 space-y-1">
          {dayLeaves.map((leave, idx) => (
            <div 
              key={idx} 
              className={`${leave.color || 'bg-indigo-500'} text-white text-[9px] font-black px-2 py-1 rounded-lg truncate shadow-sm`}
            >
              {leave.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner relative">
            <FaCalendarAlt />
            {loading && <div className="absolute inset-0 bg-white/50 rounded-2xl animate-pulse" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{monthName} {year}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Availability Schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
          <button onClick={prevMonth} className="p-3 bg-white border border-slate-200 rounded-xl hover:text-indigo-600 transition-all shadow-sm active:scale-90">
            <FaChevronLeft size={12} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900">
            Today
          </button>
          <button onClick={nextMonth} className="p-3 bg-white border border-slate-200 rounded-xl hover:text-indigo-600 transition-all shadow-sm active:scale-90">
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* The Grid with Loading Overlay */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-7 bg-slate-900 text-white py-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 px-4">
        {[
          { label: "Annual Leave", color: "text-indigo-500" },
          { label: "Sick Leave", color: "text-rose-500" },
          { label: "Casual Leave", color: "text-amber-500" }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <FaCircle className={`${item.color} text-[8px]`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;