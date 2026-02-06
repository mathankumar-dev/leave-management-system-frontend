import React, { useState, useEffect } from "react";

interface StatCardProps {
  title: string;
  used: number;
  total: number;
  color?: string; 
  period?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  used, 
  total, 
  color, 
  period = "Current Cycle", 
  onClick 
}) => {
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  const daysLeft = total - used;
  
  const size = 72;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const progressLimit = Math.min(percent, 100);
    const targetOffset = circumference - (progressLimit / 100) * circumference;
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 150);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  // High-end fallback logic: Uses prop color, then logic, then default indigo
  const ringColor = color || (title.toLowerCase().includes("sick") ? "#f43f5e" : "#6366f1");

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all cursor-pointer group relative overflow-hidden shadow-sm"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 z-20" 
        style={{ backgroundColor: ringColor }} 
      />

      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{daysLeft}</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Days Left</span>
          </div>
          
          <div className="pt-2">
            <span 
              className="text-[9px] font-black px-2 py-0.5 rounded-sm border uppercase tracking-tight"
              style={{ 
                backgroundColor: `${ringColor}15`,
                color: ringColor, 
                borderColor: `${ringColor}30` 
              }}
            >
              {used} / {total} Total
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center shrink-0">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-black text-slate-800">{percent}%</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-3">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{period}</p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[9px] font-bold" style={{ color: ringColor }}>Details →</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;