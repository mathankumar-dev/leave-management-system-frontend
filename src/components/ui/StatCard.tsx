import React, { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  used: number;
  total: number;
  color?: string; 
  period?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  used, 
  total, 
  color, 
  period = "Current Cycle", 
  icon 
}) => {
  const [progress, setProgress] = useState(0);

  // Calculate percentage for the circle
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  
  // SVG Progress Circle Math
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const ringColor = color || (title.toLowerCase().includes("sick") ? "#2563eb" : "#6366f1");

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percent > 100 ? 100 : percent), 200);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-7 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 group border-b-4" 
         style={{ borderBottomColor: ringColor }}>
      
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
          {/* Automatically use 'used' as the big display value */}
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {used}<span className="text-lg text-slate-300 ml-1">Days</span>
          </h3>
          
          <div className="pt-4">
            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 uppercase tracking-wider border border-slate-100">
              {progress}% Utilized
            </span>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full blur-xl opacity-10" style={{ backgroundColor: ringColor }} />
          
          <svg width={size} height={size} className="transform -rotate-90 relative z-10">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f8fafc"
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
                strokeDashoffset: offset,
                transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)" 
              }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-sm font-black text-slate-800 tracking-tighter">
              {used}<span className="text-slate-300 mx-0.5">/</span>{total}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Limit</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
          {period}
        </p>
      </div>
    </div>
  );
};

export default StatCard;