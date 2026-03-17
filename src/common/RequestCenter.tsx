import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineClock, HiOutlineHome, HiOutlineBriefcase,
  HiOutlineUserGroup, HiOutlineMoon, HiOutlineChevronRight,
  HiChevronDoubleLeft, HiChevronDoubleRight
} from "react-icons/hi2";

import LeaveApplicationForm from "./forms/LeaveApplicationForm";
import ODRequestForm from "./forms/ODRequestForm";
import MeetingRequestForm from "./forms/MeetingRequestForm";

type RequestType = "LEAVE" | "OD" | "WFH" | "MEETING" | "OVERTIME";

const RequestCenter = () => {
  const [activeTab, setActiveTab] = useState<RequestType>("LEAVE");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "LEAVE", label: "Leave Form", icon: <HiOutlineClock size={20} />, description: "Annual, Sick, Comp-off" },
    { id: "OD", label: "OD Form", icon: <HiOutlineBriefcase size={20} />, description: "On-Duty / Field Work" },
    { id: "MEETING", label: "Meeting", icon: <HiOutlineUserGroup size={20} />, description: "Conference Room" },
    { id: "WFH", label: "WFH Request", icon: <HiOutlineHome size={20} />, description: "Work from Home" },
    { id: "OVERTIME", label: "Overtime", icon: <HiOutlineMoon size={20} />, description: "Extra Hours Credit" },
  ];

  return (
    <div className="max-w-350 mx-auto">
      {/* MAIN GRID CONTAINER */}
      <div className="grid grid-cols-[auto_1fr] gap-8 items-start">

        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? "84px" : "300px" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-24 z-50" // Increased Z-index
        >
          {/* REMOVED overflow-hidden HERE and replaced with overflow-visible */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm overflow-visible relative">

            {/* Toggle Header */}
            <div className={`flex items-center mb-6 px-4 pt-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!isCollapsed && (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</span>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-sm hover:bg-slate-100 text-slate-400 transition-colors flex items-center"
              >
                {isCollapsed ? <HiChevronDoubleRight size={16} /> : <HiChevronDoubleLeft size={18} />}
              </button>
            </div>

            <nav className="space-y-1.5 relative">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as RequestType)}
                    className={`w-full flex items-center p-3.5 rounded-xl transition-all relative group ${isCollapsed ? "justify-center" : "justify-start"
                      } ${isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "hover:bg-slate-50 text-slate-600"
                      }`}
                  >
                    {/* Icon & Label */}
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"} min-w-0`}>
                      <div className={`shrink-0 ${isActive ? "text-white" : "text-indigo-500"}`}>
                        {item.icon}
                      </div>

                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-left overflow-hidden"
                        >
                          <p className="text-sm font-bold truncate">{item.label}</p>
                          <p className="text-[9px] font-medium opacity-70 truncate">{item.description}</p>
                        </motion.div>
                      )}
                    </div>

                    {/* --- TOOLTIP (Now safe from clipping) --- */}
                    {isCollapsed && (
                      <div
                        className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 
                px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold 
                rounded-md opacity-0 group-hover:opacity-100 
                pointer-events-none transition-all duration-200
                -translate-x-2.5 group-hover:translate-x-0 
                whitespace-nowrap z-999 shadow-2xl"
                      >
                        {/* Arrow */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 
                    border-[5px] border-transparent border-r-slate-900" />
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.aside>

        {/* CONTENT AREA - Column 2 */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "circOut" }}
            >
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm min-h-[600px] overflow-hidden">
                {/* Internal form routing */}
                {activeTab === "LEAVE" && <LeaveApplicationForm />}
                {activeTab === "OD" && <ODRequestForm />}
                {activeTab === "MEETING" && <MeetingRequestForm />}

                {/* Placeholders for new forms */}
                {(activeTab === "WFH" || activeTab === "OVERTIME") && (
                  <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <HiOutlineMoon size={32} className="opacity-20" />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-[10px]">Development in progress</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default RequestCenter;