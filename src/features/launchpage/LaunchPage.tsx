import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import CalendarSVG from "@/assets/svg/calendar-svg.svg";
import moneySVG from "@/assets/svg/money-svg.svg";
import { useAuth } from "@/shared/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useFlashNews } from "@/features/notification/hooks/useFlashNews";
import { formatTimeAgo } from "@/shared/utils/formatTimeAgo";


export interface FlashNews {
  id: number;
  priority: number;
  message: string;
  active: boolean;
  createdAt: string;
}

const LaunchPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for Flash News
  const [flashNews, setFlashNews] = useState<FlashNews[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const { fetchFlashNews } = useFlashNews();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchFlashNews();
        const sortedData = (data || []).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFlashNews(sortedData);
      } catch (err) {
        console.error("News fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchFlashNews]);

  useEffect(() => {
    if (flashNews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flashNews.length);
    }, 5000); // 5 seconds interval

    return () => clearInterval(timer);
  }, [flashNews]);
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
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Terms of Service", link: "/terms-of-service" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" className="h-10 w-10" />
            <span className="text-2xl font-black text-slate-800">
              WeNxt <span className="text-indigo-600">Technologies</span>
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
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 uppercase text-xs tracking-widest">
              ⚖️ Policy Center
            </h3>
            <ul className="space-y-2">
              {policies.map((policy, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(policy.link)}
                    className="w-full flex items-center justify-between p-2 rounded-sm text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                  >
                    <span>{policy.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* ONE NEWS AT A TIME - SLIDING/FADING */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[160px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 uppercase text-xs tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Live Updates
              </h3>
              {/* Progress Dots */}
              <div className="flex gap-1">
                {flashNews.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-3 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-indigo-500 w-5' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex-1">
              {isLoading ? (
                <div className="h-12 bg-slate-100 animate-pulse rounded-lg" />
              ) : flashNews.length > 0 ? (
                <div
                  key={currentIndex}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out"                >
                  <div className={`p-4 rounded-xl border-l-4 ${flashNews[currentIndex].priority == 1
                    ? 'bg-amber-50 border-amber-400'
                    : 'bg-slate-50 border-indigo-400'
                    }`}>
                    <p className="text-sm text-slate-800 font-semibold leading-relaxed">
                      {flashNews[currentIndex].message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
                      {formatTimeAgo(flashNews[currentIndex].createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4">No updates today.</p>
              )}
            </div>
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
                onClick={() => navigate(sys.path)}
                className="group bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`${sys.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                  <img src={sys.icon} className="w-10 h-10" alt={sys.title} />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-600 transition-colors text-slate-800">
                  {sys.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{sys.desc}</p>
                <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm uppercase tracking-wider">
                  Launch System <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>


        </main>
      </div>
    </div>
  );
};

export default LaunchPage;