import React, { useState, useEffect, useMemo } from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
 
} from "react-icons/fa";

import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import { PUBLIC_HOLIDAYS_2026 } from "../../../../constants/holidays";

const TeamCalendarView: React.FC = () => {
  const { user } = useAuth();
  const employeeId = user?.id;

  const { fetchEmployeeCalendar, employeeCalendar, loading } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
  if (employeeId) {
    fetchEmployeeCalendar(employeeId);
  }
}, [employeeId]);

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

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden lg:flex-row gap-4 p-1 md:p-0 pb-20">

      <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-4 bg-slate-50/30">

          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
              {monthName} {year}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Attendance Overview
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">

            <button
              onClick={prevMonth}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all active:scale-90"
            >
              <FaChevronLeft size={10} className="text-slate-600" />
            </button>

            <button
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDay(new Date().getDate());
              }}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-slate-200 bg-white hover:bg-slate-50 rounded-sm shadow-sm"
            >
              Current
            </button>

            <button
              onClick={nextMonth}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all active:scale-90"
            >
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

          {/* Week Days */}

          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-0"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}

          <div className="grid grid-cols-7 gap-px bg-slate-200 border-b border-slate-200">

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-16 sm:h-24 md:h-32 bg-slate-50/30"
              />
            ))}

            {daysArray.map((day) => {

              const dateKey = getFormattedDateKey(day);
              const holiday = PUBLIC_HOLIDAYS_2026[dateKey];
              const isSelected = selectedDay === day;

              const dailyLeaves = employeeCalendar[dateKey] || [];

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

                  <span
                    className={`text-[11px] sm:text-xs font-black h-5 w-5 sm:h-7 sm:w-7 flex items-center justify-center rounded-sm
                      ${isToday ? "bg-slate-900 text-white shadow-md" : isSelected ? "text-indigo-600" : "text-slate-400"}
                    `}
                  >
                    {day}
                  </span>

                  <div className="mt-1 hidden sm:block space-y-1 overflow-hidden">

                    {holiday && (
                      <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-sm truncate border border-rose-100">
                        {holiday}
                      </div>
                    )}

                    {dailyLeaves.slice(0, 2).map((emp: any, i: number) => (
                      <div
                        key={i}
                        className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-black uppercase rounded-sm truncate"
                      >
                        {emp.employeeName?.split(" ")[0]}
                      </div>
                    ))}

                  </div>

                  <div className="mt-auto flex gap-1 sm:hidden justify-center pb-1">

                    {holiday && (
                      <div className="w-1 h-1 bg-rose-500 rounded-full" />
                    )}

                    {dailyLeaves.length > 0 && (
                      <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    )}

                  </div>

                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeamCalendarView;