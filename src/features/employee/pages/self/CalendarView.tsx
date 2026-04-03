import React, { useState, useEffect, useMemo } from "react";
import { useCalendar } from "@/features/attendance/hooks/useCalendar";
import { useAuth } from "@/shared/auth/useAuth";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";

const EmployeeCalendarView: React.FC = () => {

  const { user } = useAuth();
  const employeeId = user?.id;

  const { fetchEmployeeCalendar, employeeCalendar, loading } = useCalendar();

  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeCalendar(employeeId);
    }
  }, [employeeId]);


  // date formatter
  const formatKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };


  // ---------------- MONTH DATA ----------------

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthDays = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );


  // ---------------- WEEK DATA ----------------

  const startOfWeek = (date: Date) => {

    const d = new Date(date);

    const diff = d.getDate() - d.getDay();

    return new Date(d.setDate(diff));

  };

  const weeklyData = useMemo(() => {

    const start = startOfWeek(currentDate);

    return Array.from({ length: 7 }).map((_, i) => {

      const day = new Date(start);

      day.setDate(start.getDate() + i);

      const key = formatKey(day);

      return {
        date: day,
        records: employeeCalendar?.[key] || []
      };

    });

  }, [currentDate, employeeCalendar]);


  // ---------------- DAILY DATA ----------------

  const dailyKey = formatKey(currentDate);

  const dailyData = employeeCalendar?.[dailyKey] || [];


  // ---------------- NAVIGATION ----------------

  const prev = () => {

    const newDate = new Date(currentDate);

    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    }
    else {
      newDate.setDate(newDate.getDate() - 1);
    }

    setCurrentDate(newDate);

  };


  const next = () => {

    const newDate = new Date(currentDate);

    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    }
    else {
      newDate.setDate(newDate.getDate() + 1);
    }

    setCurrentDate(newDate);

  };


  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });


  // ---------------- UI ----------------

  return (

    <div className="w-full p-4 bg-white border rounded shadow-sm">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <div className="flex gap-2">

          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1 text-xs font-bold border rounded
            ${viewMode === "month" ? "bg-indigo-600 text-white" : ""}
            `}
          >
            MONTH
          </button>

          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1 text-xs font-bold border rounded
            ${viewMode === "week" ? "bg-indigo-600 text-white" : ""}
            `}
          >
            WEEK
          </button>

          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-1 text-xs font-bold border rounded
            ${viewMode === "day" ? "bg-indigo-600 text-white" : ""}
            `}
          >
            DAY
          </button>

        </div>


        <div className="flex items-center gap-2">

          <button onClick={prev} className="p-2 border rounded">
            <FaChevronLeft />
          </button>

          <p className="font-bold text-sm">

            {viewMode === "month" && `${monthName} ${year}`}
            {viewMode === "week" && "Weekly View"}
            {viewMode === "day" && currentDate.toDateString()}

          </p>

          <button onClick={next} className="p-2 border rounded">
            <FaChevronRight />
          </button>

        </div>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="flex justify-center py-10">

          <FaSpinner className="animate-spin text-indigo-600 text-xl" />

        </div>

      )}



      {/* ---------------- MONTH VIEW ---------------- */}

      {!loading && viewMode === "month" && (

        <div>

          <div className="grid grid-cols-7 text-center text-xs font-bold mb-2">

            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (

              <div key={d}>{d}</div>

            ))}

          </div>


          <div className="grid grid-cols-7 gap-1">

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (

              <div key={`empty-${i}`} />

            ))}


            {monthDays.map(day => {

              const date = new Date(year, month, day);

              const key = formatKey(date);

              const records = employeeCalendar?.[key] || [];

              return (

                <div
                  key={day}
                  className="border rounded p-1 min-h-[80px]"
                >

                  <p className="text-xs font-bold">
                    {day}
                  </p>


                  {records.slice(0,2).map((r:any,i:number)=>(

                    <div
                      key={i}
                      className="text-[9px] bg-indigo-50 mt-1 p-1 rounded"
                    >
                      {r.leaveType || "Present"}
                    </div>

                  ))}

                </div>

              );

            })}

          </div>

        </div>

      )}



      {/* ---------------- WEEK VIEW ---------------- */}

      {!loading && viewMode === "week" && (

        <div className="grid grid-cols-7 gap-2">

          {weeklyData.map((d, i) => (

            <div key={i} className="border rounded p-2">

              <p className="text-xs font-bold mb-1">
                {d.date.toDateString()}
              </p>

              {d.records.length === 0 && (

                <p className="text-[10px] text-gray-400">
                  No records
                </p>

              )}

              {d.records.map((r:any,idx:number)=>(

                <div
                  key={idx}
                  className="text-[10px] bg-indigo-50 p-1 rounded mt-1"
                >

                  {r.leaveType || "Present"}

                </div>

              ))}

            </div>

          ))}

        </div>

      )}



      {/* ---------------- DAY VIEW ---------------- */}

      {!loading && viewMode === "day" && (

        <div>

          {dailyData.length === 0 && (

            <p className="text-gray-400">
              No records
            </p>

          )}

          {dailyData.map((r:any,i:number)=>(

            <div key={i} className="border p-3 rounded mb-2">

              <p className="font-semibold">

                {r.leaveType || "Present"}

              </p>

              <p className="text-xs text-gray-500">

                {r.employeeName}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default EmployeeCalendarView;