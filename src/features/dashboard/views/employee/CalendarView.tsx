import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendarCheck,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

/* ================= TYPES ================= */

export type CalendarScope = "SELF" | "TEAM" | "ALL";

interface CalendarViewProps {
  scope?: CalendarScope;
}

/* ================= COMPONENT ================= */

const CalendarView: React.FC<CalendarViewProps> = ({ scope = "SELF" }) => {
  const { fetchCalendar, loading } = useDashboard();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );
  const [leaveData, setLeaveData] = useState<Record<number, any[]>>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  /* ---------- FETCH CALENDAR ---------- */
  useEffect(() => {
    const loadCalendar = async () => {
      const data = await fetchCalendar(year, month, scope);
      if (data) setLeaveData(data);
    };
    loadCalendar();
  }, [year, month, scope, fetchCalendar]);

  /* ---------- DATE UTILS ---------- */
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysArray = useMemo(
    () => Array.from({ length: daysInMonthCount }, (_, i) => i + 1),
    [daysInMonthCount]
  );

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  /* ================= UI ================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col xl:flex-row gap-6 p-4 bg-slate-50 min-h-screen"
    >
      {/* LEFT: CALENDAR */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 -mt-2.5">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
          )}

          {/* HEADER */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {monthName} {year}
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {scope === "ALL"
                  ? "Organization Availability"
                  : "Availability Overview"}
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={prevMonth} className="p-2 rounded-md">
                <FaChevronLeft size={12} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1 text-xs font-bold"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 rounded-md">
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* DAY LABELS */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="bg-slate-50 py-3 text-center text-[11px] font-bold text-slate-400 uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-50/50" />
            ))}

            {daysArray.map((day) => {
              const dailyLeaves = leaveData[day] || [];
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`h-20 bg-white p-2 text-left ${
                    isSelected
                      ? "ring-2 ring-indigo-500 bg-indigo-50/20"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-bold">{day}</span>

                  <div className="mt-2 space-y-1">
                    {dailyLeaves.slice(0, 2).map((l, i) => (
                      <div
                        key={i}
                        className="text-[10px] truncate font-semibold text-slate-600"
                      >
                        • {l.name}
                      </div>
                    ))}
                    {dailyLeaves.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-bold">
                        +{dailyLeaves.length - 2} more
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <aside className="w-full xl:w-80 space-y-5 shrink-0">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">
            Attendance · {monthName} {selectedDate}
          </h3>

          {leaveData[selectedDate]?.length ? (
            leaveData[selectedDate].map((l, i) => (
              <div key={i} className="flex gap-3 p-2 bg-slate-50 rounded">
                <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center text-xs font-bold">
                  {l.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-xs font-bold">{l.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">
                    {l.type || "On Leave"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border-dashed border-2 rounded">
              <FaCalendarCheck className="mx-auto text-slate-300 mb-2" />
              <p className="text-[11px] font-bold text-slate-400 uppercase">
                Full Strength
              </p>
            </div>
          )}
        </div>
      </aside>
    </motion.div>
  );
};

export default CalendarView;
