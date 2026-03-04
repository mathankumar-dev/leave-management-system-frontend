import React from "react";
import { FaPlaneDeparture, FaRegCalendarAlt, FaClock, FaUsers, FaCheck } from "react-icons/fa";

interface ManagerStatCardProps {
    label: string;
    value: string | number;
    iconType: 'leave' | 'calendar' | 'pending' | 'team' | 'processed';
    colorClass?: string;
}
const ManagerStatCard: React.FC<ManagerStatCardProps> = ({
    label,
    value,
    iconType,
    colorClass = "text-slate-900"
}) => {
    const icons = {
        leave: <FaPlaneDeparture />,
        calendar: <FaRegCalendarAlt />,
        pending: <FaClock />,
        team: <FaUsers />,
        processed: <FaCheck />
    };
    return (
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-400 transition-all group cursor-pointer relative overflow-hidden">
            {/* 1. Data Section */}
            <div className="relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">
                    {label}
                </p>
                <p className={`text-2xl font-black ${colorClass} tracking-tight italic transition-transform group-hover:-translate-y-0.5`}>
                    {value}
                </p>
            </div>

            <div className="text-slate-200 group-hover:text-slate-300 transition-all duration-300 text-3xl absolute right-4 opacity-40 group-hover:opacity-100 group-hover:scale-110">
                {icons[iconType]}
            </div>
        </div>
    );
};

export default ManagerStatCard;