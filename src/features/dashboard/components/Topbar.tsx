import React, { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaUserCog, FaChevronDown } from "react-icons/fa";

interface TopbarProps {
  activeTab: string;
  user: any; 
  onMenuClick: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ activeTab, user, onMenuClick, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-500">
          <FaBars />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-slate-900 leading-none">
            {activeTab}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">
            Portal Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="p-2.5 hover:bg-slate-50 rounded-xl relative text-slate-400 hover:text-indigo-600 transition-colors">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="User" /> : <FaUserCircle className="w-7 h-7" />}
            </div>
            
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-xs font-black text-slate-700 leading-none">{user?.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{user?.role}</span>
                <FaChevronDown className={`text-[8px] text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-20 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <FaUserCog className="text-slate-400" /> Account Settings
                </button>
                <div className="h-px bg-slate-50 my-2" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;