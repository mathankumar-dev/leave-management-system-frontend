// src/features/launchpage/LaunchPage.tsx
// Skillset is now its own system card alongside Leave & Payroll.

import logo from "@/assets/images/LogoWeHRM2.png";
import CalendarSVG from "@/assets/svg/calendar-svg.svg";
import moneySVG from "@/assets/svg/money-svg.svg";
import { useNotifications } from "@/features/notification/hooks/useNotification";
import type { FlashNews } from "@/features/notification/types";
import { useAuth } from "@/shared/auth/useAuth";
import { useAuthenticatedImage } from "@/shared/hooks/useAuthenticatedImage";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Tiny animated ring (for skillset card badge progress) ─────────────────────
function Ring({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

const LaunchPage: React.FC = () => {
  const { user, contextLogout: logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { imageUrl, isLoading: imageLoading } = useAuthenticatedImage(user?.passportPhotoPath);

  const { fetchFlashNews } = useNotifications();
  const [flashNews, setFlashNews] = useState<FlashNews[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingNews, setLoadingNews] = useState(true);

  // Skillset stats for the card
  const [skillStats, setSkillStats] = useState<{
    techToolCombined: number;
    interpersonalCount: number;
    coursesPending: number;
  } | null>(null);

  const userRole = user?.role;
  const basePathMap: Record<string, string> = {
    EMPLOYEE:    "/employee",
    MANAGER:     "/manager",
    TEAM_LEADER: "/manager",
    HR:          "/hr",
    ADMIN:       "/admin",
    CFO:         "/cfo",
    CTO:         "/manager",
    COO:         "/manager",
    CEO:         "/manager",
  };
  const basePath = basePathMap[userRole ?? ""] || "/employee";

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60)    return "Just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const goToProfile = () => { navigate("/profile"); setIsProfileOpen(false); };

  // ── Load flash news ───────────────────────────────────────────────────────
  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      try {
        const response = await fetchFlashNews();
        if (response && Array.isArray(response)) {
          const sorted = [...response].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setFlashNews(sorted);
        } else setFlashNews([]);
      } catch { /* silent */ }
      finally { setLoadingNews(false); }
    };
    loadNews();
  }, [fetchFlashNews]);

  useEffect(() => {
    if (flashNews.length <= 1) return;
    const t = setInterval(() => setCurrentIndex(p => (p + 1) % flashNews.length), 5000);
    return () => clearInterval(t);
  }, [flashNews]);

  // ── Load skillset stats ───────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      skillsetService.getMyBadges(),
      skillsetService.getMyCourses().catch(() => ({ data: [] })),
    ])
      .then(([badgeRes, courseRes]) => {
        const tech        = badgeRes.data?.techToolCombined ?? 0;
        const interp      = badgeRes.data?.interpersonalCount ?? 0;
        const pending     = (courseRes.data ?? []).filter(
          (c: any) => c.status === "ASSIGNED" || c.status === "NOT_STARTED"
        ).length;
        setSkillStats({ techToolCombined: tech, interpersonalCount: interp, coursesPending: pending });
      })
      .catch(() => setSkillStats({ techToolCombined: 0, interpersonalCount: 0, coursesPending: 0 }));
  }, []);

  // Next badge threshold for the ring
  const NEXT_BADGE_THRESHOLDS = [5, 12, 20];
  const NEXT_BADGE_NAMES      = ["Associate", "Specialist", "Authority"];
  const NEXT_BADGE_ICONS      = ["🛡", "⚙️", "💻"];
  const count = skillStats?.techToolCombined ?? 0;
  const nextIdx  = NEXT_BADGE_THRESHOLDS.findIndex(t => count < t);
  const nextBadge = nextIdx !== -1 ? {
    name: NEXT_BADGE_NAMES[nextIdx],
    icon: NEXT_BADGE_ICONS[nextIdx],
    threshold: NEXT_BADGE_THRESHOLDS[nextIdx],
    pct: Math.round((count / NEXT_BADGE_THRESHOLDS[nextIdx]) * 100),
    color: ["#2977d0", "#6f42c1", "#b8860b"][nextIdx],
  } : null;

  const policies = [
    { title: "Leave Policy 2026", link: "/leave-policy" },
    { title: "Privacy Policy",    link: "/privacy-policy" },
    { title: "Terms of Service",  link: "/terms-of-service" },
  ];

  // ── System cards ─────────────────────────────────────────────────────────
  const systems = [
    {
      title: "Leave System",
      desc: "Apply for leaves, view balances, and track approvals.",
      icon: <img src={CalendarSVG} className="w-8 h-8" alt="Leave" />,
      accent: "#2977d0",
      accentBg: "rgba(41,119,208,0.08)",
      path: `${basePath}/dashboard`,
      badge: null,
    },
    {
      title: "Payroll System",
      desc: "View payslips, tax documents, and payment history.",
      icon: <img src={moneySVG} className="w-8 h-8" alt="Payroll" />,
      accent: "#16a34a",
      accentBg: "rgba(22,163,74,0.08)",
      path: `${basePath}/dashboard`,
      badge: null,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-brand-bg text-slate-900 font-sans selection:bg-brand selection:text-white overflow-hidden relative"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-160 h-160 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-100 h-100 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* ── Announcement banner ── */}
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-brand overflow-hidden relative z-60 shadow-lg shadow-brand/20 py-2.5 border-b border-white/10"
        >
          <div className="flex whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex items-center gap-12 min-w-full"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 text-white">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <p className="text-[11px] md:text-xs font-black tracking-[0.15em]">
                    IMPORTANT UPDATE:
                    <span className="opacity-90 font-medium ml-2">
                      Users can edit profile details from
                      <span className="bg-white/20 px-2 py-0.5 rounded mx-1 text-white">06.04.2026</span>
                      to
                      <span className="bg-white/20 px-2 py-0.5 rounded mx-1 text-white">22.04.2026</span>.
                    </span>
                  </p>
                  <button onClick={goToProfile} className="bg-white text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase hover:bg-slate-100 transition-colors">
                    Edit Now
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 transition-all border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" className="h-15 w-15 object-contain transition-transform group-hover:scale-110" />
            <span className="text-xl font-black text-slate-800 tracking-tight">
              WeNxt <span className="text-brand">Technologies</span>
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Logged in as</p>
              <p className="text-sm font-black text-slate-700">
                {user?.name}{" "}
                <span className="text-brand/40 font-medium ml-1">({user?.role})</span>
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-300 ${isProfileOpen ? "bg-white shadow-md" : "hover:bg-white/50"}`}
              >
                <div className="w-10 h-10 min-w-10 rounded-full bg-brand text-white flex items-center justify-center font-black shadow-lg shadow-brand/20 overflow-hidden">
                  {imageLoading ? (
                    <div className="w-full h-full animate-pulse bg-white/20" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </div>
                <FaChevronDown className={`text-[10px] text-slate-400 transition-transform duration-500 mr-1 ${isProfileOpen ? "rotate-180 text-brand" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl p-2 z-50 border border-slate-100"
                    >
                      <button onClick={goToProfile} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-brand/5 hover:text-brand rounded-2xl transition-all">
                        <FaUserCog className="text-lg opacity-70" /> Profile
                      </button>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-1">
                        <FaSignOutAlt className="text-lg opacity-70" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8 relative z-10">
        {/* Sidebar */}
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
                    className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white hover:text-brand transition-all text-left group"
                  >
                    <span>{policy.title}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Updates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-48 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-400 uppercase text-[10px] tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                </span>
                Live Updates
              </h3>
              <div className="flex gap-1">
                {flashNews.slice(0, 5).map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "bg-brand w-4" : "bg-slate-200 w-1"}`} />
                ))}
              </div>
            </div>
            <div className="relative flex-1">
              {loadingNews ? (
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
                </div>
              ) : flashNews.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <p className="text-sm text-slate-800 font-bold leading-relaxed">{flashNews[currentIndex].message}</p>
                    <p className="text-[9px] text-slate-400 mt-4 font-black uppercase tracking-wider">
                      {formatTimeAgo(flashNews[currentIndex].createdAt)}
                    </p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <p className="text-sm text-slate-400 italic text-center py-4">No updates today.</p>
              )}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className="text-brand">{user?.name.split(" ")[0]}!</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Which system would you like to access today?</p>
          </motion.div>

          {/* ── Leave & Payroll cards ── */}
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
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: sys.accentBg }}
                >
                  {sys.icon}
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-brand transition-colors">
                  {sys.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{sys.desc}</p>
                <div className="mt-8 flex items-center font-bold text-xs uppercase tracking-widest" style={{ color: sys.accent }}>
                  Launch System <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── SkillSet card — same visual weight as Leave & Payroll ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
              Learning & Development
            </p>

            <div
              onClick={() => navigate(`${basePath}/skillset/home`)}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden p-8"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-500"
                style={{ background: "rgba(41,119,208,0.06)" }} />

              <div className="flex flex-col sm:flex-row sm:items-start gap-6 relative">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #001d3d, #2977d0)" }}
                >
                  🎓
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                    SkillSet
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-5">
                    Track your skills, attend courses, take quizzes, earn milestone badges, and grow your professional profile.
                  </p>

                  {/* Stats row */}
                  {skillStats && (
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-2xl font-black text-slate-800">{skillStats.techToolCombined}</p>
                        <p className="text-xs text-slate-400">Tech &amp; Tool skills</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-800">{skillStats.interpersonalCount}</p>
                        <p className="text-xs text-slate-400">Interpersonal skills</p>
                      </div>
                      {skillStats.coursesPending > 0 && (
                        <div>
                          <p className="text-2xl font-black text-red-500">{skillStats.coursesPending}</p>
                          <p className="text-xs text-slate-400">Courses pending</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress ring to next badge */}
                {nextBadge && (
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="relative">
                      <Ring pct={nextBadge.pct} color={nextBadge.color} size={60} />
                      <div className="absolute inset-0 flex items-center justify-center text-base">
                        {nextBadge.icon}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center leading-tight">
                      {nextBadge.threshold - count} to<br />{nextBadge.name}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center text-blue-600 font-black text-xs uppercase tracking-widest">
                Launch SkillSet <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LaunchPage;