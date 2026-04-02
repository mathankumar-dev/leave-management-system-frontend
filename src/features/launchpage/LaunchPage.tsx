import logo from "@/assets/images/wenxt-W-only-logo.png";
import CalendarSVG from "@/assets/svg/calendar-svg.svg";
import moneySVG from "@/assets/svg/money-svg.svg";
import { useAuth } from "@/shared/auth/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const LaunchPage: React.FC = () => {

  const { user, contextLogout: logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  // const [flashNews, setFlashNews] = useState<FlashNews[]>([]);
  const userRole = user?.role;
  const basePathMap = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    TEAM_LEADER: "/manager",
    HR: "/hr",
    ADMIN: "/admin",
    CFO: "/admin",
  };

  const basePath = basePathMap[userRole as keyof typeof basePathMap] || "/employee";

  const handleNavigate = (path: string) => {
    navigate(`${basePath}/${path}`);
  };
  const goToProfile = () => {
    handleNavigate("profile");
    setIsProfileOpen(false);
  };
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchFlashNews();
  //       const sortedData = (data || []).sort((a, b) =>
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //       setFlashNews(sortedData);
  //     } catch (err) {
  //       console.error("News fetch failed", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadData();
  // }, [fetchFlashNews]);

  // useEffect(() => {
  //   if (flashNews.length <= 1) return;
  //   const timer = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % flashNews.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [flashNews]);

  const systems = [
    {
      title: "Leave System",
      desc: "Apply for leaves, view balances, and track approvals.",
      icon: CalendarSVG,
      color: "bg-brand/10",
      path: `${basePath}/dashboard`,
    },
    {
      title: "Payroll System",
      desc: "View payslips, tax documents, and payment history.",
      icon: moneySVG,
      color: "bg-emerald-500/10",
      path: `${basePath}/dashboard`,
    },
  ];

  const policies = [
    { title: "Leave Policy 2026", link: "/leave-policy" },
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Terms of Service", link: "/terms-of-service" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans selection:bg-brand selection:text-white overflow-hidden relative">

      {/* BACKGROUND BLOBS - CONSISTENCY */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-160 h-160 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-100 h-100 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO SECTION */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="logo" className="h-10 w-10 object-contain transition-transform group-hover:scale-110" />
            <span className="text-xl font-black text-slate-800 tracking-tight">
              WeNxt <span className="text-brand">Technologies</span>
            </span>
          </div>

          {/* RIGHT SECTION: USER INFO & DROPDOWN */}
          <div className="flex items-center space-x-6">

            {/* USER DETAILS */}
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Logged in as</p>
              <p className="text-sm font-black text-slate-700">
                {user?.name} <span className="text-brand/40 font-medium ml-1">({user?.role})</span>
              </p>
            </div>

            {/* PROFILE DROPDOWN WRAPPER */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-300 ${isProfileOpen ? "bg-white shadow-md" : "hover:bg-white/50"
                  }`}
              >
                {/* AVATAR STYLE MATCHING YOUR PREVIOUS CARDS */}
                <div className="w-10 h-10 bg-brand text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-lg shadow-brand/20">
                  {user?.name.charAt(0) || "U"}
                </div>

                <FaChevronDown
                  className={`text-[10px] text-slate-400 transition-transform duration-500 mr-1 ${isProfileOpen ? "rotate-180 text-brand" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* INVISIBLE OVERLAY TO CLOSE */}
                    <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)} />

                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 p-2 z-50 border border-white"
                    >
                      <div className="px-4 py-3 mb-2 border-b border-slate-50 lg:hidden">
                        <p className="text-xs font-black text-slate-800">{user?.name}</p>
                        <p className="text-[10px] text-brand font-bold">{user?.role}</p>
                      </div>

                      <button
                        onClick={goToProfile}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-brand/5 hover:text-brand rounded-2xl transition-all"
                      >
                        <FaUserCog className="text-lg opacity-70" />
                        Account Settings
                      </button>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-1"
                      >
                        <FaSignOutAlt className="text-lg opacity-70" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8 relative z-10">
        {/* LEFT SIDEBAR */}
        <aside className="w-80 hidden lg:flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand p-6 rounded-2xl text-white shadow-xl shadow-brand/20"
          >
            <p className="text-[10px] uppercase font-bold opacity-70 mb-2 tracking-widest">Thought of the Day</p>
            <p className="italic text-lg font-medium leading-tight">
              "Insurtech isn't just about code; it's about engineering trust."
            </p>
          </motion.div>

          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase text-[10px] tracking-widest">
              ⚖️ Policy Center
            </h3>
            <ul className="space-y-1">
              {policies.map((policy, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(policy.link)}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white hover:text-brand transition-all text-left"
                  >
                    <span>{policy.title}</span>
                    <span className="opacity-0 group-hover:opacity-100">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWS SECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-40 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-400 uppercase text-[10px] tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                Live Updates
              </h3>
              {/* <div className="flex gap-1">
                {flashNews.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-brand w-4' : 'bg-slate-200 w-2'}`}
                  />
                ))}
              </div> */}
            </div>

            {/* <div className="relative flex-1">
              {isLoading ? (
                <div className="h-12 bg-slate-50 animate-pulse rounded-lg" />
              ) : flashNews.length > 0 ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl border border-slate-50 bg-slate-50/50"
                >
                  <p className="text-sm text-slate-800 font-bold leading-relaxed">
                    {flashNews[currentIndex].message}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
                    {formatTimeAgo(flashNews[currentIndex].createdAt)}
                  </p>
                </motion.div>
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4">No updates today.</p>
              )}
            </div> */}
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <main className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className="text-brand">{user?.name.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Which system would you like to access today?</p>
          </motion.div>

          {/* SYSTEM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systems.map((sys, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(sys.path)}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

                <div className={`${sys.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <img src={sys.icon} className="w-8 h-8" alt={sys.title} />
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-brand transition-colors">
                  {sys.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{sys.desc}</p>
                <div className="mt-8 flex items-center text-brand font-bold text-xs uppercase tracking-widest">
                  Launch System <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaunchPage;