import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Tiny ring ──────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 52 }: { pct: number; color: string; size?: number }) {
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

// ── Types ──────────────────────────────────────────────────────────────────
interface SkillsetStats {
  techToolCombined: number;   // from getMyBadges
  interpersonalCount: number;
  coursesPending: number;     // from getMyCourses / assigned+not_started
}

interface BadgeMeta {
  name: string;
  icon: string;
  color: string;
  colorBg: string;
  skillsRequired: number;
}

const TECH_BADGES: BadgeMeta[] = [
  { name: "Associate",  icon: "🛡", color: "#2977d0", colorBg: "#e6f1fb", skillsRequired: 5  },
  { name: "Specialist", icon: "⚙️", color: "#6f42c1", colorBg: "#ede9fe", skillsRequired: 12 },
  { name: "Authority",  icon: "💻", color: "#b8860b", colorBg: "#faeeda", skillsRequired: 20 },
];

function currentBadge(count: number): BadgeMeta | null {
  return [...TECH_BADGES].reverse().find((b) => count >= b.skillsRequired) ?? null;
}

function nextBadge(count: number): BadgeMeta | null {
  return TECH_BADGES.find((b) => count < b.skillsRequired) ?? null;
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  basePath: string;
}

const SkillsetLaunchSection: React.FC<Props> = ({ basePath }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SkillsetStats | null>(null);

  useEffect(() => {
    Promise.all([
      skillsetService.getMyBadges(),
      // courses pending = count of ASSIGNED + NOT_STARTED courses
      skillsetService.getMyCourses().catch(() => ({ data: [] })),
    ])
      .then(([badgeRes, courseRes]) => {
        const techTool     = badgeRes.data?.techToolCombined ?? 0;
        const interpersonal = badgeRes.data?.interpersonalCount ?? 0;
        const pendingCourses = (courseRes.data ?? []).filter(
          (c: any) => c.status === "ASSIGNED" || c.status === "NOT_STARTED"
        ).length;
        setStats({ techToolCombined: techTool, interpersonalCount: interpersonal, coursesPending: pendingCourses });
      })
      .catch(() => {
        setStats({ techToolCombined: 0, interpersonalCount: 0, coursesPending: 0 });
      });
  }, []);

  const badge   = stats ? currentBadge(stats.techToolCombined) : null;
  const next    = stats ? nextBadge(stats.techToolCombined) : null;
  const nextPct = next && stats
    ? Math.round((stats.techToolCombined / next.skillsRequired) * 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Section label */}
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
        Learning & Development
      </p>

      <div
        onClick={() => navigate(`${basePath}/skillset/home`)}
        className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden p-8"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />

        <div className="flex flex-col sm:flex-row sm:items-start gap-6 relative">
          {/* Icon + badge */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
              style={{
                background: badge
                  ? `linear-gradient(135deg, ${badge.color}cc, ${badge.color})`
                  : "linear-gradient(135deg, #001d3d, #2977d0)",
              }}
            >
              {badge ? badge.icon : "🎓"}
            </div>

            {badge && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
                style={{ background: badge.colorBg, color: badge.color }}
              >
                {badge.icon} {badge.name}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-1">
              SkillSet
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-4">
              Track skills, take courses, earn badges, and grow your professional profile.
            </p>

            {/* Stats row */}
            {stats && (
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xl font-black text-slate-800">{stats.techToolCombined}</p>
                  <p className="text-xs text-slate-400">Tech &amp; Tool skills</p>
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">{stats.interpersonalCount}</p>
                  <p className="text-xs text-slate-400">Interpersonal skills</p>
                </div>
                {stats.coursesPending > 0 && (
                  <div>
                    <p className="text-xl font-black text-red-500">{stats.coursesPending}</p>
                    <p className="text-xs text-slate-400">Courses pending</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress ring to next badge */}
          {next && stats && (
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="relative">
                <Ring pct={nextPct} color={next.color} size={56} />
                <div className="absolute inset-0 flex items-center justify-center text-sm">
                  {next.icon}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold text-center leading-tight">
                {next.skillsRequired - stats.techToolCombined} to<br />{next.name}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center text-blue-600 font-black text-xs uppercase tracking-widest">
          Launch System{" "}
          <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsetLaunchSection;