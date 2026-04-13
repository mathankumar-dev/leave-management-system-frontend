import { useCalendar } from "@/features/attendance/hooks/useCalendar";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import DetailedRequestModal from "@/features/leave/components/DetailedRequestModal";
import { useLeaveAction } from "@/features/leave/hooks/useLeaveActions";
import type { LeaveDecision } from "@/features/leave/types";
import { notify } from "@/features/notification/utils/notifications";
import { CommentDialog } from "@/shared/components";
import StatusBadge2 from "@/shared/components/StatusBadge";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaCheckCircle,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaUserAlt,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../../../shared/auth/useAuth";
import { PUBLIC_HOLIDAYS_2026 } from "../../../shared/constants/holidays";

// --- COLOR LOGIC HELPER ---
type StatusTheme = "rose" | "amber" | "indigo";

const getStatusColor = (status?: string): StatusTheme => {
  if (!status) return "indigo";
  const s = status.toUpperCase();
  if (s.includes("REJECTED")) return "rose";
  if (s.includes("PENDING")) return "amber";
  if (s.includes("APPROVED")) return "indigo";
  return "indigo";
};

const TeamCalendarView: React.FC = () => {
  const { user } = useAuth();
  const id = user?.id;
  const {
    fetchTeamSchedule,
    teamCalendar,
    fetchEmployeeCalendar,
    fetchAttendanceCalendar,
    employeeCalendar,
    attendance: attendanceCalendar,
    loading
  } = useCalendar();

  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isAttendanceExpanded, setIsAttendanceExpanded] = useState(false);
  // Inside TeamCalendarView component
  const [detailModalReq, setDetailModalReq] = useState<any | null>(null);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    req: any;
    status: LeaveDecision | null;
  }>({ isOpen: false, req: null, status: null });
  const { processApproval } = useLeaveAction();
  // Helper to execute the final decision after the comment dialog
  const executeDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
    const targetId = req.leaveId || req.id || req.employeeId; // Ensure you have the correct ID
    const success = await processApproval({
      leaveId: targetId,
      approverId: user!.id,
      decision: status,
      comments: commentText
    });

    if (success) {
      notify.leaveAction(status, req.employeeName || "Employee");
      setDialogConfig({ isOpen: false, req: null, status: null });
      loadAllData(); // Refresh your calendar/stats
    }
  };
  const calendarStats = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const d = currentDate.getDate();

    return {
      daysInMonthCount: new Date(y, m + 1, 0).getDate(),
      firstDayOfMonth: new Date(y, m, 1).getDay(),
      monthName: currentDate.toLocaleString("default", { month: "long" }),
      shortMonth: currentDate.toLocaleString("default", { month: "short" }), // Add this
      year: y,
      month: m,
      day: d
    };
  }, [currentDate]);

  const { daysInMonthCount, firstDayOfMonth, monthName, year, month } = calendarStats;

  useEffect(() => {
    if (typeof id === "string") {
      fetchTeamSchedule(id);
      fetchEmployeeCalendar(id);
      fetchAttendanceCalendar(id, year, month);
    }
  }, [id, year, month, fetchTeamSchedule, fetchEmployeeCalendar, fetchAttendanceCalendar]);

  const formatKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getFormattedDateKey = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };


  const weeklyData = useMemo(() => {
    const d = new Date(currentDate);
    const diff = d.getDate() - d.getDay();
    const start = new Date(d.setDate(diff));

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = formatKey(day);
      return {
        date: day,
        team: teamCalendar[key] || [],
        mine: employeeCalendar[key] || [],
        attendance: attendanceCalendar[key],
        holiday: PUBLIC_HOLIDAYS_2026[key]
      };
    });
  }, [currentDate, teamCalendar, employeeCalendar, attendanceCalendar]);

  const dailyKey = formatKey(currentDate);
  const dailyTeam = teamCalendar[dailyKey] || [];
  const dailyMine = employeeCalendar[dailyKey] || [];
  const dailyHoliday = PUBLIC_HOLIDAYS_2026[dailyKey];



  const handleMove = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() + direction);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + (direction * 7));
    else newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    setSelectedDay(newDate.getDate());
  };

  const selectedDateKey = getFormattedDateKey(selectedDay);
  const selectedDayTeamLeaves = teamCalendar[selectedDateKey] || [];
  const selectedDayHoliday = PUBLIC_HOLIDAYS_2026[selectedDateKey];



  return (
    <div className="flex flex-col lg:flex-row gap-4 p-1 md:p-0 pb-20 bg-slate-50/50">
      {/* 1. The Main Detailed View Modal */}
      <DetailedRequestModal
        isOpen={!!detailModalReq}
        leaveId={detailModalReq?.leaveId || detailModalReq?.id}
        onClose={() => setDetailModalReq(null)}
        onAction={(status) => {
          const currentReq = detailModalReq;
          setDetailModalReq(null); // Close this modal
          setDialogConfig({ isOpen: true, req: currentReq, status }); // Open comment dialog
        }}
      />

      {/* 2. The Final Approval/Rejection Dialog */}
      <CommentDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
        title={dialogConfig.status === 'REJECTED' ? 'Reject Leave Request' : 'Approve Request'}
        onSubmit={(comment: string) => executeDecision(dialogConfig.req, dialogConfig.status!, comment)}
      />
      <div className="flex-1 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
        {/* HEADER SECTION */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900   tracking-tighter">
              {viewMode === "month" && `${monthName} ${year}`}
              {viewMode === "week" && `Week ${currentDate.getDate()} - ${monthName}`}
              {viewMode === "day" && currentDate.toDateString()}
            </h2>
            <div className="flex gap-4 mt-1">
              <LegendItem color="bg-amber-400" label="Me" />
              <LegendItem color="bg-indigo-500" label="Team" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-slate-200 rounded-sm p-1 bg-slate-50 mr-2 shadow-inner">
              <ViewTab active={viewMode === 'month'} onClick={() => setViewMode('month')} icon={<FaCalendarAlt size={12} />} label="Monthly" />
              <ViewTab active={viewMode === 'week'} onClick={() => setViewMode('week')} icon={<FaCalendarWeek size={12} />} label="Weekly" />
              <ViewTab active={viewMode === 'day'} onClick={() => setViewMode('day')} icon={<FaCalendarDay size={12} />} label="Daily" />
            </div>
            <button onClick={() => handleMove(-1)} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all"><FaChevronLeft size={10} /></button>
            <button onClick={() => { setCurrentDate(new Date()); setViewMode('month'); setSelectedDay(new Date().getDate()); }} className="px-3 py-1.5 text-[10px] font-black   tracking-wider border border-slate-200 bg-white hover:bg-slate-50 rounded-sm shadow-sm">Today</button>
            <button onClick={() => handleMove(1)} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-sm transition-all"><FaChevronRight size={10} /></button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="relative flex-1">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
              <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === "month" && (
              <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2.5 text-center text-[9px] font-black text-slate-400   tracking-widest border-r border-slate-200 last:border-0">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 sm:h-32 bg-slate-50/30" />
                  ))}
                  {Array.from({ length: daysInMonthCount }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(year, month, day);
                    const dayOfWeek = dateObj.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const key = getFormattedDateKey(day);
                    const team = teamCalendar[key] || [];
                    const mine = employeeCalendar[key] || [];
                    const attendance = attendanceCalendar[key];
                    const holiday = PUBLIC_HOLIDAYS_2026[key];
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDay(day);
                          setCurrentDate(new Date(year, month, day));
                        }}
                        className={`h-20 sm:h-32 p-1.5 sm:p-2 text-left flex flex-col transition-all relative border-r border-b border-slate-100 
                          ${isSelected ? "bg-indigo-50/50 ring-2 ring-inset ring-indigo-500 z-10" : "bg-white hover:bg-slate-50"} 
                          ${isWeekend && !isSelected ? "bg-slate-100/50" : ""} 
                          ${holiday ? "bg-rose-50/30" : ""}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] sm:text-[11px] font-black h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-sm 
                            ${isSelected ? "bg-indigo-600 text-white" : "text-slate-400"}`}>
                            {day}
                          </span>
                          <div className="flex gap-1">
                            {mine.length > 0 && <CountBadge color="amber" count={mine.length} />}
                            {team.length > 0 && <CountBadge color="indigo" count={team.length} />}
                          </div>
                        </div>

                        <div className="flex-1 overflow-hidden space-y-0.5 hidden sm:block">
                          {holiday ? (
                            <div className="px-1 py-0.5 bg-rose-100/50 border border-rose-200 text-rose-600 text-[7px] font-black   rounded-sm truncate">{holiday}</div>
                          ) : isWeekend ? (
                            <div className="px-1 py-0.5 bg-slate-200/50 border border-slate-300 text-slate-500 text-[7px] font-black   rounded-sm truncate">Weekend Holiday</div>
                          ) : null}

                          {attendance && (
                            attendance.checkIn && attendance.checkOut ? (
                              <div className="px-1 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[7px] font-black rounded-sm truncate">
                                {attendance.checkIn.slice(0, 5)} - {attendance.checkOut.slice(0, 5)}
                              </div>
                            ) : (!isWeekend && !holiday && (
                              <div className="px-1 py-0.5 bg-red-50 border border-red-200 text-red-700 text-[7px] font-black rounded-sm truncate">ABSENT</div>
                            ))
                          )}

                          {team.slice(0, 2).map((emp: any, idx: number) => (
                            <div key={idx} className="px-1 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[7px] font-black   rounded-sm truncate">
                              <TeamMemberName employeeId={emp.employeeId} />
                            </div>
                          ))}
                          {team.length > 2 && <p className="text-[7px] font-black text-slate-400 px-1  ">+ {team.length - 2} MORE</p>}
                        </div>
                        <div className="mt-auto flex gap-0.5 sm:hidden justify-center">
                          {mine.length > 0 && <div className="w-1 h-1 bg-amber-400 rounded-full" />}
                          {team.length > 0 && <div className="w-1 h-1 bg-indigo-500 rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {viewMode === "week" && (
              <motion.div
                key="week"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="p-6 flex flex-col gap-4 bg-slate-50/50"
              >
                {weeklyData.map((d, i) => {
                  const isToday = new Date().toDateString() === d.date.toDateString();
                  const isWeekend = d.date.getDay() === 0 || d.date.getDay() === 6;

                  return (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                      className={`relative flex flex-col md:flex-row items-stretch gap-6 p-4 rounded-3xl border transition-all duration-300
                      ${isToday
                          ? "bg-white border-indigo-500 shadow-[0_10px_40px_rgba(79,70,229,0.1)] ring-1 ring-indigo-500/20"
                          : "bg-white/80 border-slate-100 hover:border-slate-200 shadow-sm"
                        }
                      ${isWeekend && !isToday ? "bg-slate-50/50 opacity-90" : ""}
                    `}
                    >
                      {/* Left Side: Date Anchor (Horizontal fixed width) */}
                      <div className="flex md:flex-col items-center justify-center md:w-24 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                        <p className={`text-[10px] font-black uppercase tracking-widest md:mb-1 mr-3 md:mr-0
                            ${isToday ? "text-indigo-600" : "text-slate-400"}`}>
                          {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className={`text-4xl font-black tracking-tighter leading-none
                            ${isToday ? "text-slate-900" : "text-slate-700"}`}>
                          {d.date.getDate()}
                        </p>
                        {isToday && (
                          <span className="ml-3 md:ml-0 md:mt-2 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Middle: Shift/Main Info */}
                      <div className="flex-1 flex flex-col md:flex-row gap-4 py-2">
                        {/* My Shift Section */}
                        <div className="md:w-64">
                          {d.attendance ? (
                            <div className={`h-full p-4 rounded-2xl border flex flex-col justify-center
                  ${d.attendance.checkIn ? "bg-emerald-50/40 border-emerald-100" : "bg-rose-50/40 border-rose-100"}`}>
                              <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <FaUserAlt size={10} className={isToday ? "text-indigo-500" : ""} />
                                <span className="text-[9px] font-black uppercase tracking-wider">My Shift</span>
                              </div>
                              {d.attendance.checkIn ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-black text-slate-800">{d.attendance.checkIn.slice(0, 5)}</span>
                                  <span className="text-slate-300 font-bold">—</span>
                                  <span className="text-xl font-black text-slate-800">{d.attendance.checkOut?.slice(0, 5) || '--:--'}</span>
                                  <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-100">
                                    {d.attendance.workingHours}h
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-black text-rose-500 uppercase tracking-widest">Absent</span>
                              )}
                            </div>
                          ) : d.holiday ? (
                            <div className="h-full p-4 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col justify-center">
                              <span className="text-[9px] font-black text-rose-500 uppercase mb-1">Public Holiday</span>
                              <p className="text-sm font-black text-rose-900 uppercase italic truncate">{d.holiday}</p>
                            </div>
                          ) : (
                            <div className="h-full flex items-center px-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 italic text-xs font-medium">
                              No activity logged
                            </div>
                          )}
                        </div>

                        {/* Team Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Team Out</span>
                            <div className="h-[1px] flex-1 bg-slate-100" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {d.team.length > 0 ? (
                              d.team.map((r: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-slate-100/50 hover:bg-indigo-50 p-1.5 pr-3 rounded-full transition-all cursor-default border border-transparent hover:border-indigo-100 group/item">
                                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-indigo-500 shadow-sm">
                                    {r.employeeId.slice(-2)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-700 leading-none">
                                      <TeamMemberName employeeId={r.employeeId} />
                                    </span>
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">
                                      {r.leaveTypeName || 'Leave'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-2 text-slate-300 py-1 px-1">
                                <FaCheckCircle size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Full Team Present</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                  );
                })}
              </motion.div>
            )}

            {viewMode === "day" && (
              <motion.div key="day" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-2xl mx-auto">
                <div className="bg-slate-900 text-white p-6 rounded-sm mb-6 flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-[10px] font-black   tracking-[0.2em] text-indigo-400">Daily Schedule</p>
                    <h3 className="text-2xl font-black mt-1">{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                  </div>
                  <FaCalendarDay className="text-slate-700 opacity-50" size={40} />
                </div>
                <div className="space-y-4">
                  {dailyHoliday && <DayRecord title="Public Holiday" content={dailyHoliday} color="rose" />}
                  {attendanceCalendar[dailyKey] && (
                    <DayRecord
                      title="My Attendance"
                      content={`IN ${attendanceCalendar[dailyKey].checkIn?.slice(0, 5)} | OUT ${attendanceCalendar[dailyKey].checkOut?.slice(0, 5)} | ${attendanceCalendar[dailyKey].workingHours} hrs`}
                      color="amber"
                    />
                  )}
                  {dailyTeam.map((r: any, i: number) => (
                    <DayRecord key={`team-${i}`} title={<TeamMemberName employeeId={r.employeeId} />} content={r.leaveTypeName || "Team Absence"} status={r.status} />
                  ))}
                  <div className="ml-11 pt-2 mt-1 border-t border-emerald-200/50 space-y-3 animate-in fade-in slide-in-from-top-1">


                    <div className="pt-2 border-t border-emerald-100">
                      <p className="text-[8px] font-black text-emerald-800 tracking-widest mb-2">Punching Logs</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {/* Use optional chaining here to prevent the crash */}
                        {attendanceCalendar[selectedDateKey]?.punchRecords ? (
                          attendanceCalendar[selectedDateKey].punchRecords
                            .split(",")
                            .filter((r: string) => r.trim().length > 0)
                            .map((record: string, idx: number) => {
                              const parts = record.split(":");
                              const time = `${parts[0]}:${parts[1]}`;
                              const isCheckIn = record.toLowerCase().includes(":in");
                              return (
                                <div key={idx} className={`flex items-center justify-between px-2 py-1 rounded-sm border ${isCheckIn ? "bg-white border-emerald-200 shadow-sm" : "bg-slate-50 border-slate-200"}`}>
                                  <span className={`text-[9px] font-black ${isCheckIn ? "text-emerald-700" : "text-slate-500"}`}>{time}</span>
                                  <span className={`text-[7px] font-bold tracking-tighter ${isCheckIn ? "text-emerald-500" : "text-rose-400"}`}>{isCheckIn ? "● IN" : "○ OUT"}</span>
                                </div>
                              );
                            })
                        ) : (
                          /* This now correctly shows when the date doesn't exist in your calendar object */
                          <span className="col-span-2 text-[8px] italic text-slate-400">No logs available</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {(dailyTeam.length === 0 && dailyMine.length === 0 && !dailyHoliday) && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-sm">
                      <FaUserCheck className="mx-auto text-slate-200 mb-3" size={30} />
                      <p className="text-slate-400 font-bold  text-xs tracking-widest">Full Team Presence</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SIDE DETAILS PANEL */}
      <div className="w-full lg:w-80 space-y-3 shrink-0">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-4">
          <p className="text-[10px] font-black tracking-widest text-slate-500 mb-4 border-b pb-2 border-slate-100 uppercase">
            Quick Detail: {selectedDay} {monthName.slice(0, 3)}
          </p>
          <div className="space-y-3 min-h-37.5">
            {/* 1. HOLIDAY SECTION */}
            {selectedDayHoliday && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-sm">
                <p className="text-[9px] font-black text-rose-500">Holiday</p>
                <p className="text-xs font-bold text-rose-900">{selectedDayHoliday}</p>
              </div>
            )}

            {/* 2. ATTENDANCE OR ABSENCE SECTION */}
            {attendanceCalendar[selectedDateKey] ? (
              attendanceCalendar[selectedDateKey].checkIn ? (
                /* PRESENT STATE */
                <div className="flex flex-col gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-sm transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-sm shrink-0">
                        <FaUserAlt size={12} />
                      </div>
                      <p className="text-xs font-black text-slate-900">Attendance</p>
                    </div>
                    <p className="text-[14px] font-bold text-slate-700 pt-1">
                      {attendanceCalendar[selectedDateKey].checkIn?.slice(0, 5)} → {attendanceCalendar[selectedDateKey].checkOut?.slice(0, 5)}
                    </p>
                  </div>

                  <div className="text-[10px] text-black ml-11">
                    <span className="font-medium opacity-80">Actual Working Hours: </span>
                    <span className="font-bold">{attendanceCalendar[selectedDateKey].workingHours} hrs</span>
                  </div>

                  {isAttendanceExpanded && (
                    <div className="ml-11 pt-2 mt-1 border-t border-emerald-200/50 space-y-3 animate-in fade-in slide-in-from-top-1">
                      <div className="pt-2 border-t border-emerald-100">
                        <p className="text-[8px] font-black text-emerald-800 tracking-widest mb-2">Punching Logs</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {attendanceCalendar[selectedDateKey].punchRecords ? (
                            attendanceCalendar[selectedDateKey].punchRecords
                              .split(",")
                              .filter((r: string) => r.trim().length > 0)
                              .map((record: string, idx: number) => {
                                const parts = record.split(":");
                                const time = `${parts[0]}:${parts[1]}`;
                                const isCheckIn = record.toLowerCase().includes(":in");
                                return (
                                  <div key={idx} className={`flex items-center justify-between px-2 py-1 rounded-sm border ${isCheckIn ? "bg-white border-emerald-200 shadow-sm" : "bg-slate-50 border-slate-200"}`}>
                                    <span className={`text-[9px] font-black ${isCheckIn ? "text-emerald-700" : "text-slate-500"}`}>{time}</span>
                                    <span className={`text-[7px] font-bold tracking-tighter ${isCheckIn ? "text-emerald-500" : "text-rose-400"}`}>{isCheckIn ? "● IN" : "○ OUT"}</span>
                                  </div>
                                );
                              })
                          ) : (
                            <span className="col-span-2 text-[8px] italic text-slate-400">No logs available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsAttendanceExpanded(!isAttendanceExpanded)}
                    className="ml-11 mt-1 flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition-colors w-fit"
                  >
                    <span className="text-[9px] font-black tracking-wider">{isAttendanceExpanded ? 'Show Less' : 'See Punch Logs'}</span>
                    <FaChevronDown size={8} className={`transition-transform duration-300 ${isAttendanceExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                /* ABSENT STATE (Record exists but no Check-In) */
                <div className="flex flex-col gap-2 p-3 bg-rose-50 border border-rose-100 rounded-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-100 text-rose-600 flex items-center justify-center rounded-sm shrink-0">
                        <FaUserAlt size={12} className="opacity-50" />
                      </div>
                      <p className="text-xs font-black text-rose-900">Attendance</p>
                    </div>
                    <div className="px-1.5 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded-sm uppercase tracking-tighter">
                      Absent
                    </div>
                  </div>
                  <div className="text-[10px] text-rose-800 ml-11">
                    <span className="font-medium opacity-80">Actual Working Hours: </span>
                    <span className="font-bold">0 hrs</span>
                  </div>
                </div>
              )
            ) : null}

            {/* 3. TEAM LEAVES SECTION */}
            {selectedDayTeamLeaves.length > 0 ? (
              selectedDayTeamLeaves.map((emp: any) => (
                <div
                  key={emp.employeeId}
                  onClick={() => setDetailModalReq({ ...emp, id: emp.leaveId || emp.id })}
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-sm cursor-pointer hover:bg-slate-50 transition-all"
                >
                  <div className="w-8 h-8 bg-slate-100 text-slate-500 flex items-center justify-center rounded-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <FaUserAlt size={10} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate group-hover:text-indigo-700">
                      <TeamMemberName employeeId={emp.employeeId} />
                    </p>
                    <div className="flex items-center text-xs text-slate-500">
                      <span>Status: </span>
                      <div className="ml-1 scale-75 origin-left">
                        <StatusBadge2 status={emp.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* 4. FALLBACK: ONLY SHOW "NO RECORDS" IF LITERALLY NOTHING IS HAPPENING */
              !selectedDayHoliday && !attendanceCalendar[selectedDateKey] && (
                <div className="flex flex-col items-center py-10 opacity-30">
                  <FaUserCheck size={20} />
                  <p className="text-[9px] font-black tracking-widest mt-2 uppercase">No Activity</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* UPCOMING HOLIDAYS PANEL (unchanged) */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-black tracking-widest text-slate-500">Upcoming Holidays</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(PUBLIC_HOLIDAYS_2026)
              .filter(([date]) => new Date(date).getTime() >= new Date().setHours(0, 0, 0, 0))
              .map(([date, name]) => (
                <div key={date} className="p-3 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-900 truncate">{name}</p>
                    <p className="text-[8px] font-bold text-slate-400">
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })}
                    </p>
                  </div>
                  <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[7px] font-black rounded-sm border border-rose-100">Day Off</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    <p className="text-[9px] font-black text-slate-500   tracking-widest">{label}</p>
  </div>
);

const ViewTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 transition-all rounded-sm ${active ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}>
    {icon}<span className="text-[10px] font-black   tracking-widest leading-none">{label}</span>
  </button>
);


const DayRecord = ({ title, content, color, status }: { title: React.ReactNode, content: string, color?: StatusTheme, status?: string }) => {
  const finalColor = color || getStatusColor(status || content);
  const styles = { rose: "bg-rose-50/50 border-rose-200 border-l-rose-500", amber: "bg-amber-50/50 border-amber-200 border-l-amber-500", indigo: "bg-indigo-50/50 border-indigo-200 border-l-indigo-500" };
  return (
    <div className={`p-4 border-l-4 rounded-sm shadow-sm bg-white ${styles[finalColor]}`}>
      <p className="text-[9px] font-black text-gray-600   tracking-[0.1em]">{title}</p>
      <p className="text-sm font-bold text-slate-900   tracking-tight mt-0.5 whitespace-pre-line">{content}</p>
    </div>
  );
};

const CountBadge = ({ color, count }: { color: 'indigo' | 'amber', count: number }) => {
  const styles = { indigo: "bg-indigo-600 text-white", amber: "bg-amber-500 text-white" };
  return <span className={`text-[8px] font-black min-w-[14px] h-[14px] px-1 flex items-center justify-center rounded-full shadow-sm ${styles[color]}`}>{count}</span>;
};

const TeamMemberName = ({ employeeId }: { employeeId: string }) => {
  const [name, setName] = useState<string>("Loading...");
  const { fetchEmployeeName } = useEmployee();
  useEffect(() => {
    const getName = async () => {
      try {
        const result = await fetchEmployeeName(employeeId);
        setName(result?.empName || result || "Unknown");
      } catch (err) { setName("Error"); }
    };
    if (employeeId) getName();
  }, [employeeId, fetchEmployeeName]);
  return <>{name}</>;
};

export default TeamCalendarView;

function loadAllData() {
  throw new Error("Function not implemented.");
}
