import React from "react";
import logo from "../../assets/logo.svg";
import CalendarSVG from "../../assets/svg/calendar-svg.svg";
import moneySVG from "../../assets/svg/money-svg.svg";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LaunchPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const systems = [
    {
      title: "Leave System",
      desc: "Apply for leaves, view balances, and track approvals.",
      icon: CalendarSVG,
      color: "bg-indigo-500",
      path: "/dashboard",
    },
    {
      title: "Payroll System",
      desc: "View payslips, tax documents, and payment history.",
      icon: moneySVG,
      color: "bg-indigo-500",
      path: "/dashboard", 
    },
  ];

  const policies = [
    { title: "Leave Policy 2026", link: "/leave-policy" },
    // { title: "Remote Work Guidelines", link: "#" },
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Terms of Service", link: "/terms-of-service" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="h-10 w-10" />
            <span className="text-2xl font-black text-slate-800">
              Wenxt <span className="text-indigo-600">Technologies</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current User</p>
              <p className="text-sm font-bold text-slate-700">
                {`${user?.name} (${user?.role})`}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-sm border-2 border-white shadow-sm">
              {user?.name.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-80 hidden lg:flex flex-col gap-6">
          <div className="bg-indigo-500 p-6 rounded-xl text-white shadow-lg shadow-indigo-100">
            <p className="text-xs uppercase font-bold opacity-80 mb-2 tracking-widest">Thought of the Day</p>
            <p className="italic text-lg font-medium leading-tight">
              "Insurtech isn't just about code; it's about engineering trust."
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
              <span className="text-indigo-500">📢</span> Announcements
            </h3>
            <div className="space-y-4 text-sm">
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-bold text-slate-700">Q4 Compliance Audit</p>
                <p className="text-xs text-slate-500 font-medium">Finalize logs by Friday</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-3">
                <p className="font-bold text-slate-700">Performance Modules</p>
                <p className="text-xs text-slate-500 font-medium">New templates live</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 uppercase text-xs tracking-widest">
              ⚖️ Policy Center
            </h3>
            <ul className="space-y-2">
              {policies.map((policy, i) => (
                <li key={i}>
                  <a 
                    href={policy.link} 
                    className="flex items-center justify-between p-2 rounded-sm text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <span>{policy.title}</span>
                    {/* <span className="text-[10px] opacity-40">PDF</span> */}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <main className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 mt-1">Access your employee management tools below.</p>
          </div>

          {/* SYSTEM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systems.map((sys, idx) => (
              <div
                key={idx}
                // --- NAVIGATION TRIGGER ---
                onClick={() => navigate(sys.path)}
                className="group bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`${sys.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                  <img 
                    src={sys.icon} 
                    className="w-10 h-10 " 
                    alt={sys.title} 
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition-colors text-slate-800">
                  {sys.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {sys.desc}
                </p>
                <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm uppercase tracking-wider">
                  Launch System <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* FLASH NEWS BAR */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center gap-6 relative overflow-hidden border-b-4 border-indigo-600">
            <div className="bg-indigo-500 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest animate-pulse z-10">
              Flash
            </div>
            <div className="flex-1 z-10">
              <p className="text-sm font-medium">
                <span className="text-indigo-400 mr-2 font-bold">[MARKET WIN]</span>
                Wenxt secured the 'Global Claims Platform' contract for 2026! 🚀
              </p>
            </div>
            <div className="opacity-10 absolute -right-4 top-0 text-7xl font-black select-none">NEWS</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaunchPage;