// src/features/skillset/pages/Progression.tsx
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { skillsetService } from "@/features/skillset/skillsetService";

type Category = "tech" | "tool" | "soft";

interface SkillEntry { name: string; rating: number; }
interface SkillsData { tech: SkillEntry[]; tools: SkillEntry[]; soft: SkillEntry[]; }

// ── Rich sample data ───────────────────────────────────────────────────────
const SAMPLE_SKILLS: SkillsData = {
  tech: [
    { name: "React",       rating: 5 },
    { name: "TypeScript",  rating: 4 },
    { name: "Spring Boot", rating: 4 },
    { name: "SQL",         rating: 3 },
    { name: "Python",      rating: 3 },
    { name: "GraphQL",     rating: 2 },
    { name: "Java",        rating: 5 },
  ],
  tools: [
    { name: "Docker",      rating: 4 },
    { name: "Git",         rating: 5 },
    { name: "Jira",        rating: 3 },
    { name: "Figma",       rating: 2 },
    { name: "AWS",         rating: 3 },
  ],
  soft: [
    { name: "Communication",    rating: 4 },
    { name: "Leadership",       rating: 3 },
    { name: "Time Management",  rating: 4 },
    { name: "Public Speaking",  rating: 2 },
    { name: "Critical Thinking",rating: 5 },
  ],
};

interface QuizAttempt {
  id: number;
  courseTitle: string;
  category: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  totalAttempts: number;
  submittedAt: string;
  timeTaken: string;
  totalQuestions: number;
  correctAnswers: number;
  offline: boolean;
}

const SAMPLE_QUIZ_HISTORY: QuizAttempt[] = [
  { id: 1,  courseTitle: "Introduction to GDPR Compliance",  category: "Compliance",  score: 82, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-04-15", timeTaken: "14 min", totalQuestions: 10, correctAnswers: 9,  offline: false },
  { id: 2,  courseTitle: "Advanced React Patterns",          category: "Technical",   score: 91, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-04-10", timeTaken: "32 min", totalQuestions: 12, correctAnswers: 11, offline: false },
  { id: 3,  courseTitle: "Leadership Essentials",            category: "Soft Skills", score: 55, passed: false, attemptNumber: 1, totalAttempts: 3, submittedAt: "2026-04-08", timeTaken: "20 min", totalQuestions: 8,  correctAnswers: 4,  offline: false },
  { id: 4,  courseTitle: "Leadership Essentials",            category: "Soft Skills", score: 68, passed: true,  attemptNumber: 2, totalAttempts: 3, submittedAt: "2026-04-09", timeTaken: "18 min", totalQuestions: 8,  correctAnswers: 6,  offline: false },
  { id: 5,  courseTitle: "Docker Fundamentals",              category: "Tools",       score: 78, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-04-05", timeTaken: "25 min", totalQuestions: 10, correctAnswers: 8,  offline: false },
  { id: 6,  courseTitle: "Python for Data Analysis",         category: "Technical",   score: 87, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-04-01", timeTaken: "38 min", totalQuestions: 15, correctAnswers: 13, offline: false },
  { id: 7,  courseTitle: "Effective Communication",          category: "Soft Skills", score: 95, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-03-28", timeTaken: "10 min", totalQuestions: 5,  correctAnswers: 5,  offline: false },
  { id: 8,  courseTitle: "Offline Safety Assessment",        category: "Compliance",  score: 73, passed: true,  attemptNumber: 1, totalAttempts: 1, submittedAt: "2026-03-20", timeTaken: "—",      totalQuestions: 20, correctAnswers: 15, offline: true  },
];

const SCORE_TREND = [
  { month: "Jan", avg: 71 },
  { month: "Feb", avg: 74 },
  { month: "Mar", avg: 80 },
  { month: "Apr", avg: 84 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function avg(arr: SkillEntry[]) {
  if (!arr.length) return 0;
  return arr.reduce((s, x) => s + x.rating, 0) / arr.length;
}

const COLORS: Record<Category, string> = { tech: "#2977d0", tool: "#6f42c1", soft: "#0aa4c8" };
const LEVEL_NAMES = ["Novice", "Adv. Beginner", "Competent", "Proficient", "Expert"];
const CAT_CONFIG: Record<Category, { label: string; icon: string }> = {
  tech: { label: "Technical Stack", icon: "💻" },
  tool: { label: "Tools & Platforms", icon: "🛠" },
  soft: { label: "Interpersonal Skills", icon: "🤝" },
};

function StatCard({ count, label, sub, color }: { count: number | string; label: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4" style={{ borderLeft: `4px solid ${color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div className="text-3xl font-black leading-none" style={{ color, minWidth: 48, textAlign: "center" }}>{count}</div>
      <div>
        <div className="font-bold text-slate-700 text-sm">{label}</div>
        <div className="text-xs text-slate-400">{sub}</div>
      </div>
    </div>
  );
}

// ── Quiz Score Card ────────────────────────────────────────────────────────
function QuizAttemptRow({ attempt }: { attempt: QuizAttempt }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = attempt.score >= 75 ? "#16a34a" : attempt.score >= 65 ? "#d97706" : "#dc2626";
  const scoreBg    = attempt.score >= 75 ? "#dcfce7" : attempt.score >= 65 ? "#fef3c7" : "#fee2e2";

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 px-4 py-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-800 truncate">{attempt.courseTitle}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {attempt.category} · {attempt.submittedAt}
            {attempt.offline && <span className="ml-2 italic">(offline)</span>}
            {attempt.totalAttempts > 1 && (
              <span className="ml-2 font-semibold text-slate-500">
                Attempt {attempt.attemptNumber}/{attempt.totalAttempts}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-black px-3 py-1 rounded-full" style={{ background: scoreBg, color: scoreColor }}>
            {attempt.score}%
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: attempt.passed ? "#dcfce7" : "#fee2e2", color: attempt.passed ? "#166534" : "#dc2626" }}>
            {attempt.passed ? "✓ PASS" : "✗ FAIL"}
          </span>
          <span className="text-slate-300 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Correct answers",  val: `${attempt.correctAnswers}/${attempt.totalQuestions}` },
            { label: "Time taken",       val: attempt.timeTaken },
            { label: "Score",            val: `${attempt.score}%` },
            { label: "Passing score",    val: "65%" },
          ].map(({ label, val }) => (
            <div key={label} className="text-center bg-white rounded-lg py-2.5 px-2 border border-slate-100">
              <p className="text-base font-black text-slate-800">{val}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Deep Dive Card ─────────────────────────────────────────────────────────
function DeepDiveCard({ cat, label, icon, skills, active, onClick }: {
  cat: Category; label: string; icon: string; skills: SkillEntry[]; active: boolean; onClick: () => void;
}) {
  const color = COLORS[cat];
  const avgVal = avg(skills);
  return (
    <div onClick={onClick}
      className="relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      style={{
        boxShadow: active ? `0 0 0 3px ${color}33, 0 8px 24px ${color}22` : "0 2px 10px rgba(0,0,0,0.07)",
        border: active ? `2.5px solid ${color}` : "1.5px solid #e4e8ef",
        background: active ? `${color}08` : "white",
      }}>
      {active && (
        <span className="absolute top-2.5 right-2.5 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}22`, color }}>Viewing</span>
      )}
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-bold text-[#001d3d] text-sm mb-0.5">{label}</div>
      <div className="text-xs text-slate-400 mb-3">{skills.length} skill{skills.length !== 1 ? "s" : ""}</div>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Avg Proficiency</div>
      <div className="text-2xl font-black" style={{ color }}>{avgVal.toFixed(1)}/5</div>
      <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${avgVal * 20}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Progression() {
  const [skillsData, setSkillsData] = useState<SkillsData>(SAMPLE_SKILLS);
  const [loading, setLoading]       = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [timelineCategory, setTimelineCategory] = useState<Category>("tech");
  const [activeTab, setActiveTab]   = useState<"overview" | "quizzes" | "timeline">("overview");
  const [quizFilter, setQuizFilter] = useState<"all" | "passed" | "failed">("all");
  const [quizHistory]               = useState<QuizAttempt[]>(SAMPLE_QUIZ_HISTORY);

  const techCount  = skillsData.tech.length;
  const toolCount  = skillsData.tools.length;
  const softCount  = skillsData.soft.length;
  const totalCount = techCount + toolCount + softCount;

  const avgMap = { tech: avg(skillsData.tech), tool: avg(skillsData.tools), soft: avg(skillsData.soft) };

  const allScores = quizHistory.map(q => q.score);
  const avgQuizScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  const passRate = allScores.length ? Math.round((quizHistory.filter(q => q.passed).length / quizHistory.length) * 100) : 0;
  const bestScore = allScores.length ? Math.max(...allScores) : 0;

  const filteredQuizzes = quizHistory.filter(q =>
    quizFilter === "all" ? true : quizFilter === "passed" ? q.passed : !q.passed
  );

  const pieData = [
    { name: "Technical", value: techCount, color: "#2977d0" },
    { name: "Tools",     value: toolCount, color: "#6f42c1" },
    { name: "Interpers.", value: softCount, color: "#0aa4c8" },
  ];

  const barData = [
    { cat: "Technical", avg: +avgMap.tech.toFixed(1), color: "#2977d0" },
    { cat: "Tools",     avg: +avgMap.tool.toFixed(1), color: "#6f42c1" },
    { cat: "Interpers.",avg: +avgMap.soft.toFixed(1), color: "#0aa4c8" },
  ];

  const sorted = (Object.entries(avgMap) as [Category, number][]).sort(([, a], [, b]) => b - a);
  const bestCat = sorted[0];
  const weakCat = sorted[sorted.length - 1];
  const catNames: Record<Category, string> = { tech: "Technical Stack", tool: "Tools & Platforms", soft: "Interpersonal" };

  const milestones: Record<Category, { date: string; title: string; desc: string; unlocked: boolean }[]> = {
    tech: [
      { date: techCount + toolCount >= 5 ? "✓ Earned" : "Goal", title: "🎖 Associate Badge", desc: "Reach 5 technical & tool skills", unlocked: techCount + toolCount >= 5 },
      { date: "Next Goal", title: "📍 Specialist Badge", desc: `Reach 12 tech+tool skills (${Math.max(0, 12 - techCount - toolCount)} more)`, unlocked: techCount + toolCount >= 12 },
      { date: "Ultimate", title: "👑 Authority Badge", desc: "Reach 20 tech+tool skills", unlocked: techCount + toolCount >= 20 },
    ],
    tool: [
      { date: toolCount >= 3 ? "✓ Earned" : "Goal", title: "🎖 Tool Starter", desc: "Add 3 tools to your profile", unlocked: toolCount >= 3 },
      { date: "Next Goal", title: "📍 Platform Expert", desc: `Reach 8 tool skills (${Math.max(0, 8 - toolCount)} more)`, unlocked: toolCount >= 8 },
      { date: "Ultimate", title: "👑 DevOps Authority", desc: "Master 12+ tools & platforms", unlocked: toolCount >= 12 },
    ],
    soft: [
      { date: softCount >= 3 ? "✓ Earned" : "Goal", title: "🎖 Professional Core Badge", desc: "Reach 3 interpersonal skills", unlocked: softCount >= 3 },
      { date: "Next Goal", title: "📍 Collaborator Badge", desc: `Reach 10 interpersonal skills (${Math.max(0, 10 - softCount)} more)`, unlocked: softCount >= 10 },
      { date: "Ultimate", title: "👑 Strategic Lead Badge", desc: "Reach 15 interpersonal skills", unlocked: softCount >= 15 },
    ],
  };

  const tabs = [
    { id: "overview", label: "📊 Skill Overview" },
    { id: "quizzes",  label: `📝 Quiz History (${quizHistory.length})` },
    { id: "timeline", label: "📅 Milestone Timeline" },
  ] as const;

  const activeCatSkills = activeCategory === "tech" ? skillsData.tech : activeCategory === "tool" ? skillsData.tools : skillsData.soft;

  const FilterBtn = ({ cat, label }: { cat: Category; label: string }) => {
    const color = COLORS[cat];
    const active = timelineCategory === cat;
    return (
      <button onClick={() => setTimelineCategory(cat)}
        className="rounded-full px-4 py-1.5 text-sm font-semibold border-2 transition-all"
        style={{ background: active ? color : "white", borderColor: active ? color : "#e0e0e0", color: active ? "white" : "#555" }}>
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f0f2f6", fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <div className="container mx-auto px-4 mt-6 pb-12">

        {/* Header */}
        <div className="text-center py-8 mb-6 rounded-2xl"
          style={{ background: "rgba(0,29,61,0.04)", border: "2px solid rgba(0,53,102,0.1)" }}>
          <div className="text-5xl mb-3">📈</div>
          <h1 className="text-3xl font-black text-[#001d3d] mb-2">Your Learning Progression</h1>
          <p className="text-slate-500 text-sm">Skills, quiz performance, and milestone tracking</p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100" style={{ width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: activeTab === t.id ? "#001d3d" : "transparent",
                color: activeTab === t.id ? "white" : "#64748b",
                boxShadow: activeTab === t.id ? "0 2px 8px rgba(0,29,61,0.25)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard count={totalCount} label="Total Skills" sub="All categories" color="#003566" />
              <StatCard count={avgQuizScore + "%"} label="Avg Quiz Score" sub={`${quizHistory.length} attempts`} color="#d97706" />
              <StatCard count={passRate + "%"} label="Pass Rate" sub="All quiz attempts" color="#16a34a" />
              <StatCard count={bestScore + "%"} label="Best Score" sub="Personal record" color="#7c3aed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Skill breakdown */}
              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ borderTop: "4px solid #003566" }}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Skill Breakdown</div>
                <div className="flex flex-col gap-3 mb-4">
                  {[
                    { count: techCount, label: "Technical Skills", sub: "Stack & Languages", color: "#2977d0" },
                    { count: toolCount, label: "Tools & Platforms", sub: "DevOps & Infrastructure", color: "#6f42c1" },
                    { count: softCount, label: "Interpersonal", sub: "People & Leadership", color: "#0aa4c8" },
                  ].map(s => <StatCard key={s.label} {...s} />)}
                </div>
              </div>

              {/* Pie chart */}
              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ borderTop: "4px solid #003566" }}>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Skill Distribution</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {pieData.filter(d => d.value > 0).map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 flex-wrap pt-2 border-t border-slate-100">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-sm" style={{ background: d.color }} /> {d.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>           


            {/* Deep dive */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6" style={{ borderTop: "4px solid #003566" }}>
              <h3 className="text-[#001d3d] font-bold text-base flex items-center gap-2 mb-5">
                <span>⚡</span> Category Deep Dive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {(["tech", "tool", "soft"] as Category[]).map(cat => {
                  const skills = cat === "tech" ? skillsData.tech : cat === "tool" ? skillsData.tools : skillsData.soft;
                  return (
                    <DeepDiveCard key={cat} cat={cat} label={CAT_CONFIG[cat].label} icon={CAT_CONFIG[cat].icon}
                      skills={skills} active={activeCategory === cat}
                      onClick={() => setActiveCategory(prev => prev === cat ? null : cat)} />
                  );
                })}
              </div>

              {activeCategory && (
                <div className="rounded-2xl p-5 bg-white shadow-sm" style={{ borderLeft: `5px solid ${COLORS[activeCategory]}` }}>
                  <div className="font-bold text-[#001d3d] flex items-center gap-2 mb-0.5">
                    <span>{CAT_CONFIG[activeCategory].icon}</span>
                    {CAT_CONFIG[activeCategory].label} — Proficiency Breakdown
                  </div>
                  <div className="text-xs text-slate-400 mb-5">
                    {activeCatSkills.length} skills · Average: {avg(activeCatSkills).toFixed(1)}/5.0
                  </div>
                  {[...activeCatSkills].sort((a, b) => b.rating - a.rating).map((s, i) => {
                    const levelColors: Record<number, string> = { 1: "#b8860b", 2: "#cc6600", 3: "#b23c17", 4: "#303f9f", 5: "#1a6e1a" };
                    const levelBgs:    Record<number, string> = { 1: "rgba(255,193,7,0.15)", 2: "rgba(255,152,0,0.15)", 3: "rgba(255,87,34,0.15)", 4: "rgba(63,81,181,0.15)", 5: "rgba(0,128,0,0.12)" };
                    return (
                      <div key={i} className="flex items-center gap-3 mb-4">
                        <div className="text-sm font-semibold text-[#001d3d] min-w-[130px]">{s.name}</div>
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${s.rating * 20}%`, background: COLORS[activeCategory] }} />
                        </div>
                        <div className="text-xs text-slate-400 min-w-[32px] text-right">{s.rating}/5</div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full min-w-[90px] text-center"
                          style={{ background: levelBgs[s.rating], color: levelColors[s.rating] }}>
                          {LEVEL_NAMES[s.rating - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quiz score trend */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6" style={{ borderTop: "4px solid #d97706" }}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Quiz Score Trend</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={SCORE_TREND} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip formatter={(v: any) => [`${v}%`, "Avg score"]} />
                  <Line type="monotone" dataKey="avg" stroke="#d97706" strokeWidth={3} dot={{ r: 5, fill: "#d97706" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Key insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ borderTop: "4px solid #003566" }}>
              <h3 className="text-[#001d3d] font-bold text-base flex items-center gap-2 mb-4"><span>💡</span> Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "🔥", title: "Strongest Area", text: bestCat[1] > 0 ? `${catNames[bestCat[0]]} leads with avg ${bestCat[1].toFixed(1)}/5` : "Add skills to see insights." },
                  { icon: "🎯", title: "Focus Area",     text: weakCat[1] > 0 ? `${catNames[weakCat[0]]} has lowest avg (${weakCat[1].toFixed(1)}/5). Add 2–3 skills here.` : "Add skills across categories." },
                  { icon: "📝", title: "Quiz Health",    text: `${passRate}% pass rate across ${quizHistory.length} attempts. Average score: ${avgQuizScore}%.` },
                ].map((ins, i) => (
                  <div key={i} className="rounded-xl px-4 py-4"
                    style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.9),rgba(240,240,240,0.9))", borderLeft: "4px solid #003566" }}>
                    <h4 className="text-[#001d3d] font-bold text-sm flex items-center gap-2 mb-1"><span>{ins.icon}</span>{ins.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{ins.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: QUIZ HISTORY ── */}
        {activeTab === "quizzes" && (
          <>
            {/* Summary strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard count={quizHistory.length}       label="Total Attempts"  sub="All quizzes"    color="#003566" />
              <StatCard count={quizHistory.filter(q => q.passed).length} label="Passed" sub="Successful"   color="#16a34a" />
              <StatCard count={avgQuizScore + "%"}        label="Average Score"  sub="All attempts"   color="#d97706" />
              <StatCard count={bestScore + "%"}           label="Best Score"     sub="Personal record" color="#7c3aed" />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
              {(["all", "passed", "failed"] as const).map(f => (
                <button key={f} onClick={() => setQuizFilter(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize"
                  style={{
                    background: quizFilter === f ? "#003566" : "white",
                    color: quizFilter === f ? "white" : "#64748b",
                    borderColor: quizFilter === f ? "#003566" : "#e2e8f0",
                  }}>
                  {f === "all" ? `All (${quizHistory.length})` : f === "passed" ? `Passed (${quizHistory.filter(q => q.passed).length})` : `Failed (${quizHistory.filter(q => !q.passed).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No quiz attempts in this filter.</div>
              ) : filteredQuizzes.map(q => <QuizAttemptRow key={q.id} attempt={q} />)}
            </div>
          </>
        )}

        {/* ── TAB: TIMELINE ── */}
        {activeTab === "timeline" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ borderTop: "4px solid #003566" }}>
            <h3 className="text-[#001d3d] font-bold text-lg flex items-center gap-2 mb-4"><span>📅</span> Milestone Timeline</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <FilterBtn cat="tech" label="Technical Stack" />
              <FilterBtn cat="tool" label="Tools & Platforms" />
              <FilterBtn cat="soft" label="Interpersonal" />
            </div>

            {/* Timeline */}
            <div className="relative pl-14">
              <div className="absolute left-5 top-0 bottom-0 w-0.5"
                style={{ background: "linear-gradient(180deg,#003566,transparent)" }} />
              {milestones[timelineCategory].map((item, i) => (
                <div key={i} className="relative mb-6">
                  <div className="absolute left-[-34px] top-1.5 w-4 h-4 rounded-full border-2 z-10 transition-all"
                    style={{ background: item.unlocked ? "#003566" : "white", borderColor: "#003566", boxShadow: item.unlocked ? "0 0 10px rgba(0,53,102,0.4)" : "none" }} />
                  <div className="bg-white rounded-xl p-4" style={{ borderLeft: `3px solid ${item.unlocked ? "#003566" : "#cbd5e1"}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-slate-400">{item.date}</div>
                      {item.unlocked && <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Achieved</span>}
                    </div>
                    <div className="font-semibold text-[#001d3d] text-sm mb-0.5">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}