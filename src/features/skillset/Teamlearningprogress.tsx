import React, { useState, useEffect } from "react";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Types ──────────────────────────────────────────────────────────────────
interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  coursesCompleted: number;
  coursesAssigned: number;
  avgScore: number | null;
  lastActivity: string | null;
}

interface CourseOption {
  id: number;
  title: string;
  category: string;
}

interface MemberProgress {
  courseId: number;
  courseTitle: string;
  status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
  score: number | null;
  offline: boolean;
  dueDate: string | null;
  completedAt: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#FBEAF0", color: "#72243E" },
  { bg: "#EEEDFE", color: "#3C3489" },
];

const avatarStyle = (i: number) => AVATAR_PALETTE[i % AVATAR_PALETTE.length];

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// ── Score Input (offline mark entry) ──────────────────────────────────────
function OfflineScoreInput({
  empId, courseId, existing, onSave,
}: {
  empId: number;
  courseId: number;
  existing: number | null;
  onSave: (empId: number, courseId: number, score: number) => void;
}) {
  const [val, setVal] = useState<string>(existing != null ? String(existing) : "");
  const [saved, setSaved] = useState(existing != null);

  const handleSave = () => {
    if (!val || isNaN(Number(val))) return;
    onSave(empId, courseId, Number(val));
    setSaved(true);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={100}
        value={val}
        onChange={(e) => { setVal(e.target.value); setSaved(false); }}
        placeholder="0–100"
        className="w-16 text-center border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
      />
      <button
        onClick={handleSave}
        disabled={!val || saved}
        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed"
        style={{
          background: saved ? "#dcfce7" : "#003566",
          color: saved ? "#166534" : "white",
        }}
      >
        {saved ? "✓" : "Save"}
      </button>
    </div>
  );
}

// ── Member Row ─────────────────────────────────────────────────────────────
function MemberRow({
  member,
  index,
  onViewProgress,
}: {
  member: TeamMember;
  index: number;
  onViewProgress: () => void;
}) {
  const av = avatarStyle(index);
  const completionPct =
    member.coursesAssigned > 0
      ? Math.round((member.coursesCompleted / member.coursesAssigned) * 100)
      : 0;

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
        style={{ background: av.bg, color: av.color }}
      >
        {getInitials(member.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm text-slate-800">{member.name}</p>
          <span className="text-xs text-slate-400">{member.role}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden" style={{ maxWidth: 160 }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${completionPct}%`, background: "linear-gradient(90deg, #003566, #2977d0)" }}
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {member.coursesCompleted}/{member.coursesAssigned} completed
            {member.avgScore != null ? ` · avg ${member.avgScore}%` : ""}
          </span>
        </div>
      </div>

      <button
        onClick={onViewProgress}
        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
      >
        View
      </button>
    </div>
  );
}

// ── Member Progress Detail ─────────────────────────────────────────────────
function MemberProgressDetail({
  member,
  progress,
  courses,
  onBack,
  onSaveOfflineScore,
}: {
  member: TeamMember;
  progress: MemberProgress[];
  courses: CourseOption[];
  onBack: () => void;
  onSaveOfflineScore: (empId: number, courseId: number, score: number) => void;
}) {
  const STATUS_LABEL: Record<string, string> = {
    ASSIGNED: "Assigned", IN_PROGRESS: "In Progress", COMPLETED: "Completed", NOT_STARTED: "Not Started",
  };
  const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
    ASSIGNED:    { bg: "#dbeafe", color: "#1e40af" },
    IN_PROGRESS: { bg: "#fef3c7", color: "#92400e" },
    COMPLETED:   { bg: "#dcfce7", color: "#166534" },
    NOT_STARTED: { bg: "#f3f4f6", color: "#6b7280" },
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-bold text-blue-600 mb-5 hover:opacity-75 transition-opacity"
      >
        ← Back to team
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <p className="font-black text-base text-slate-800 mb-0.5">{member.name}</p>
        <p className="text-xs text-slate-400">{member.role} · {member.department}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { val: member.coursesCompleted, label: "Completed" },
            { val: member.coursesAssigned, label: "Assigned" },
            { val: member.avgScore != null ? `${member.avgScore}%` : "—", label: "Avg Score" },
          ].map((s) => (
            <div key={s.label} className="text-center bg-slate-50 rounded-xl py-3">
              <p className="text-xl font-black text-slate-800">{s.val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course progress table */}
      {progress.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8">No courses assigned yet.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Course", "Status", "Score / Offline Entry"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {progress.map((p, i) => {
                const sc = STATUS_COLOR[p.status] ?? STATUS_COLOR.NOT_STARTED;
                return (
                  <tr key={p.courseId} className={i < progress.length - 1 ? "border-b border-slate-100" : ""}>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800 text-sm">{p.courseTitle}</p>
                      {p.dueDate && (
                        <p className="text-xs text-slate-400">Due: {p.dueDate}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                      {p.score != null && !p.offline && (
                        <p className="text-xs text-slate-500 mt-1">Online: <strong>{p.score}%</strong></p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {p.offline ? (
                        <OfflineScoreInput
                          empId={member.id}
                          courseId={p.courseId}
                          existing={p.score}
                          onSave={onSaveOfflineScore}
                        />
                      ) : p.score != null ? (
                        <span className="text-sm font-bold" style={{ color: p.score >= 65 ? "#16a34a" : "#dc2626" }}>
                          {p.score}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Assign Panel ───────────────────────────────────────────────────────────
function AssignPanel({
  team,
  courses,
  onAssigned,
}: {
  team: TeamMember[];
  courses: CourseOption[];
  onAssigned: () => void;
}) {
  const [courseId, setCourseId] = useState<number | "">("");
  const [selected, setSelected] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const toggle = (id: number) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const handleAssign = async () => {
    if (!courseId || selected.length === 0) return;
    setAssigning(true);
    try {
      await skillsetService.assignCourse({
        courseId: Number(courseId),
        employeeIds: selected,
        dueDate: dueDate || undefined,
      });
      setSuccess(`✓ Course assigned to ${selected.length} employee(s).`);
      setSelected([]);
      setCourseId("");
      setDueDate("");
      onAssigned();
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      alert("Assignment failed. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {success && (
        <div className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      {/* Step 1: course */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          1. Select course
        </p>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : "")}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors"
        >
          <option value="">— Choose a course —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
          ))}
        </select>

        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 block mb-1">
            Due date <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {/* Step 2: employees */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            2. Select employees
          </p>
          <button
            onClick={() => setSelected(selected.length === team.length ? [] : team.map((e) => e.id))}
            className="text-xs font-bold text-blue-600 hover:opacity-75"
          >
            {selected.length === team.length ? "Deselect all" : "Select all"}
          </button>
        </div>
        <div className="space-y-2">
          {team.map((member, i) => {
            const av = avatarStyle(i);
            const isSelected = selected.includes(member.id);
            return (
              <label
                key={member.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isSelected ? "#eff6ff" : "#f9fafb",
                  border: `1.5px solid ${isSelected ? "#93c5fd" : "#e5e7eb"}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(member.id)}
                  className="accent-blue-600 w-4 h-4"
                />
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: av.bg, color: av.color }}
                >
                  {getInitials(member.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleAssign}
        disabled={!courseId || selected.length === 0 || assigning}
        className="w-full py-3 rounded-xl text-sm font-black text-white transition-all disabled:cursor-not-allowed"
        style={{
          background: !courseId || selected.length === 0 ? "#e5e7eb" : "linear-gradient(135deg, #001d3d, #2977d0)",
          color: !courseId || selected.length === 0 ? "#9ca3af" : "white",
        }}
      >
        {assigning ? "Assigning..." : `Assign to ${selected.length > 0 ? `${selected.length} employee(s)` : "…"}`}
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const TeamLearningProgress: React.FC = () => {
  const [team, setTeam]             = useState<TeamMember[]>([]);
  const [courses, setCourses]       = useState<CourseOption[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<"progress" | "assign">("progress");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberProgress, setMemberProgress] = useState<MemberProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    Promise.all([
      skillsetService.getTeamLearningProgress(),
      skillsetService.getCourseCatalog(),
    ])
      .then(([teamRes, courseRes]) => {
        setTeam((teamRes.data ?? []).map((d: any): TeamMember => ({
          id: d.id ?? d.empId,
          name: d.name ?? d.employeeName ?? "",
          role: d.role ?? d.designation ?? "",
          department: d.department ?? "",
          coursesCompleted: d.coursesCompleted ?? 0,
          coursesAssigned: d.coursesAssigned ?? 0,
          avgScore: d.avgScore ?? null,
          lastActivity: d.lastActivity ?? null,
        })));
        setCourses((courseRes.data ?? []).map((d: any): CourseOption => ({
          id: d.id,
          title: d.title ?? "",
          category: d.category ?? "",
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMemberProgress = async (member: TeamMember) => {
    setSelectedMember(member);
    setProgressLoading(true);
    try {
      const { data } = await skillsetService.getEmployeeLearningProgress(member.id);
      setMemberProgress((data ?? []).map((d: any): MemberProgress => ({
        courseId: d.courseId,
        courseTitle: d.courseTitle ?? "",
        status: d.status ?? "NOT_STARTED",
        score: d.score ?? null,
        offline: d.offline ?? false,
        dueDate: d.dueDate ?? null,
        completedAt: d.completedAt ?? null,
      })));
    } catch {
      setMemberProgress([]);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleOfflineScore = async (empId: number, courseId: number, score: number) => {
    try {
      await skillsetService.submitOfflineScore({ empId, courseId, score });
      setMemberProgress((prev) =>
        prev.map((p) => (p.courseId === courseId ? { ...p, score, offline: true } : p))
      );
    } catch {
      alert("Failed to save score. Please try again.");
    }
  };

  const filtered = search
    ? team.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
    : team;

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading team data...</div>;
  }

  // ── Member detail view ────────────────────────────────────────────────────
  if (selectedMember) {
    if (progressLoading) {
      return (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading {selectedMember.name}'s progress...
        </div>
      );
    }
    return (
      <MemberProgressDetail
        member={selectedMember}
        progress={memberProgress}
        courses={courses}
        onBack={() => setSelectedMember(null)}
        onSaveOfflineScore={handleOfflineScore}
      />
    );
  }

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalAssigned  = team.reduce((s, m) => s + m.coursesAssigned, 0);
  const totalCompleted = team.reduce((s, m) => s + m.coursesCompleted, 0);
  const avgTeamScore   = team.filter((m) => m.avgScore != null).reduce((s, m, _, a) => s + (m.avgScore ?? 0) / a.length, 0);

  return (
    <div className="font-sans" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { val: team.length,                                   label: "Team members",  color: "#2977d0" },
          { val: `${totalCompleted}/${totalAssigned}`,          label: "Completions",   color: "#16a34a" },
          { val: avgTeamScore > 0 ? `${Math.round(avgTeamScore)}%` : "—", label: "Team avg score", color: "#d97706" },
        ].map(({ val, label, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl px-5 py-4" style={{ borderTop: `3px solid ${color}` }}>
            <p className="text-2xl font-black" style={{ color }}>{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: "2px solid #e2e8f0" }}>
        {(["progress", "assign"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-4 pb-2 text-sm font-bold transition-colors"
            style={{
              borderBottom: activeTab === t ? "2px solid #003566" : "2px solid transparent",
              color: activeTab === t ? "#001d3d" : "#94a3b8",
              marginBottom: "-2px",
            }}
          >
            {t === "progress" ? "Team Progress" : "Assign Courses"}
          </button>
        ))}
      </div>

      {/* Progress tab */}
      {activeTab === "progress" && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No team members found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((member, i) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  index={i}
                  onViewProgress={() => loadMemberProgress(member)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assign tab */}
      {activeTab === "assign" && (
        <AssignPanel
          team={team}
          courses={courses}
          onAssigned={() => {
            // Optionally refresh team data
            skillsetService.getTeamLearningProgress()
              .then(({ data }) => setTeam((data ?? []).map((d: any): TeamMember => ({
                id: d.id ?? d.empId,
                name: d.name ?? d.employeeName ?? "",
                role: d.role ?? "",
                department: d.department ?? "",
                coursesCompleted: d.coursesCompleted ?? 0,
                coursesAssigned: d.coursesAssigned ?? 0,
                avgScore: d.avgScore ?? null,
                lastActivity: d.lastActivity ?? null,
              }))))
              .catch(() => {});
          }}
        />
      )}
    </div>
  );
};

export default TeamLearningProgress;