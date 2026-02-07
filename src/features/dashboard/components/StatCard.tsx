import React, { useState, useEffect } from "react";
import { FaProcedures, FaPlaneDeparture, FaHome, FaRegCalendarAlt, FaQuestionCircle } from "react-icons/fa";

interface StatCardProps {
  title: string;
  used: number;
  total: number;
  color?: string;
  period?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  used, 
  total, 
  color, 
  period = "Current Cycle", 
  onClick,
  icon
}) => {
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  const daysLeft = total - used;
  
  // Adjusted SVG sizing for better alignment
  const size = 80; // Slightly smaller to give text more room
  const strokeWidth = 8; // Thinner stroke looks more "high-end"
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const progressLimit = Math.min(percent, 100);
    const targetOffset = circumference - (progressLimit / 100) * circumference;
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 150);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  const ringColor = color || (title.toLowerCase().includes("sick") ? "#f43f5e" : "#6366f1");

  const getFallbackIcon = () => {
    const t = title.toLowerCase();
    if (t.includes("sick") || t.includes("medical")) return <FaProcedures />;
    if (t.includes("annual") || t.includes("vacation")) return <FaPlaneDeparture />;
    if (t.includes("wfh") || t.includes("remote")) return <FaHome />;
    if (t.includes("casual")) return <FaRegCalendarAlt />;
    return <FaQuestionCircle />;
  };

  const displayIcon = icon || getFallbackIcon();

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between h-full hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          {/* Header Area */}
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: ringColor }} className="text-sm bg-slate-50 p-1.5 rounded-lg">
              {displayIcon}
            </span>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
              {title}
            </p>
          </div>

          {/* Main Stat Area */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
              {daysLeft}
            </h3>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Days</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Remaining</span>
            </div>
          </div>
          
          {/* Usage Badge */}
          <div className="mt-4">
            <span 
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide"
              style={{ 
                backgroundColor: `${ringColor}10`,
                color: ringColor, 
                borderColor: `${ringColor}20` 
              }}
            >
              Used: {used} / {total}
            </span>
          </div>
        </div>

        {/* Simplified Progress Ring (Removed % text from middle to reduce clutter) */}
        <div className="relative flex items-center justify-center shrink-0 mt-2">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              style={{ 
                strokeDashoffset: animatedOffset,
                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" 
              }}
              strokeLinecap="round"
            />
          </svg>
          {/* Small percentage label inside or omitted for cleaner look */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-3">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
          {period}
        </p>
        <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" style={{ color: ringColor }}>
          Details →
        </span>
      </div>
    </div>
  );
};

export default StatCard;