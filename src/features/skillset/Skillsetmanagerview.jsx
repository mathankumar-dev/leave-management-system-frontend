// ─────────────────────────────────────────────────────────────────────────────
//  SkillSetManagerView.jsx  —  /skillset/manager route
//  Manager / Senior employee dashboard:
//   • See team progress + badges
//   • Assign courses to one or more reports
//   • Enter offline test scores
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { computeBadge, BADGE_CONFIG, SKILLSET_MODULE_CONFIG } from "../data/skillsetConfig";

// ── Subcomponents ─────────────────────────────────────────────────────────────
function Avatar({ name, color = "#2563eb" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: color + "22", color, fontWeight: 700, fontSize: 13,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function ScoreInput({ empId, courseId, existing, onSave }) {
  const [score, setScore] = useState(existing ?? "");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="number" min={0} max={100}
        value={score}
        onChange={e => { setScore(e.target.value); setSaved(false); }}
        placeholder="0–100"
        style={{
          width: 72, padding: "5px 8px", borderRadius: 7,
          border: "1px solid #d1d5db", fontSize: 13, textAlign: "center",
        }}
      />
      <button
        onClick={() => {
          // Replace with: PATCH /api/skillset/scores { empId, courseId, score: Number(score), offline: true }
          onSave(empId, courseId, Number(score));
          setSaved(true);
        }}
        disabled={score === "" || saved}
        style={{
          padding: "5px 12px", borderRadius: 7, border: "none",
          background: saved ? "#dcfce7" : "#2563eb",
          color: saved ? "#166534" : "#fff", fontSize: 12, fontWeight: 600,
          cursor: score === "" || saved ? "not-allowed" : "pointer",
        }}
      >
        {saved ? "✓ Saved" : "Save"}
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SkillSetManagerView({ currentUser }) {
  const navigate = useNavigate();
  const [tab, setTab]             = useState("team");     // team | assign | offline
  const [team, setTeam]           = useState([]);
  const [courses, setCourses]     = useState([]);
  const [selected, setSelected]   = useState([]);         // selected employee IDs
  const [selCourse, setSelCourse] = useState("");
  const [dueDate, setDueDate]     = useState("");
  const [assignMsg, setAssignMsg] = useState(null);
  const [offlineCourse, setOfflineCourse] = useState("");

  useEffect(() => {
    // Replace with: fetch(`/api/skillset/team/${currentUser.id}`)
    setTeam([
      { id: 101, name: "Arjun Sharma",    role: "Engineer",         stats: { completedCourses: 6, completedQuizzes: 5, avgScore: 80 }, color: "#7c3aed" },
      { id: 102, name: "Priya Nair",      role: "Product Manager",  stats: { completedCourses: 3, completedQuizzes: 3, avgScore: 68 }, color: "#0891b2" },
      { id: 103, name: "Kiran Patel",     role: "Designer",         stats: { completedCourses: 1, completedQuizzes: 1, avgScore: 55 }, color: "#d97706" },
      { id: 104, name: "Meera Krishnan",  role: "Analyst",          stats: { completedCourses: 8, completedQuizzes: 8, avgScore: 88 }, color: "#16a34a" },
      { id: 105, name: "Ravi Subramaniam",role: "QA Engineer",      stats: { completedCourses: 0, completedQuizzes: 0, avgScore: 0  }, color: "#e11d48" },
    ]);
    // Replace with: fetch(`/api/skillset/courses`)
    setCourses([
      { id: 1, title: "Introduction to Data Privacy", category: "Compliance" },
      { id: 2, title: "Leadership Essentials",        category: "Soft Skills" },
      { id: 3, title: "Advanced Excel for HR",        category: "Tools"       },
      { id: 4, title: "Effective Communication",      category: "Soft Skills" },
      { id: 5, title: "Python for Data Analysis",     category: "Technical"   },
      { id: 6, title: "Mental Health at Work",        category: "Wellbeing"   },
    ]);
  }, []);

  const toggleEmp = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleAssign = () => {
    if (!selCourse || selected.length === 0) return;
    // Replace with: POST /api/skillset/assign { courseId: selCourse, employeeIds: selected, dueDate, assignedBy: currentUser.id }
    setAssignMsg(`✓ Course assigned to ${selected.length} employee(s).`);
    setSelected([]); setSelCourse(""); setDueDate("");
    setTimeout(() => setAssignMsg(null), 4000);
  };

  const handleSaveScore = (empId, courseId, score) => {
    // Replace with: PATCH /api/skillset/scores { empId, courseId, score, offline: true }
    console.log("Save offline score", { empId, courseId, score });
  };

  const tabs = [
    { id: "team",    label: "Team Progress" },
    { id: "assign",  label: "Assign Courses" },
    { id: "offline", label: "Enter Offline Marks" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 600,
              letterSpacing: "0.07em", textTransform: "uppercase" }}>
              WeHRM · SkillSet · Manager
            </p>
            <h1 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, color: "#111827" }}>
              Team Learning Overview
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate("/skillset")}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #2563eb",
                background: "transparent", color: "#2563eb", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              My Learning
            </button>
            <button
              onClick={() => navigate("/portal")}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: "transparent", color: "#374151", fontSize: 13, cursor: "pointer" }}
            >
              ← Portal
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28,
          background: "#f1f5f9", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13, transition: "all 0.15s",
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#2563eb" : "#6b7280",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── TEAM PROGRESS ── */}
        {tab === "team" && (
          <div>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>
              {team.length} direct reports
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {team.map(emp => {
                const badge = computeBadge(emp.stats);
                const pct = emp.stats.completedCourses > 0
                  ? Math.min(Math.round((emp.stats.completedCourses / 12) * 100), 100) : 0;
                return (
                  <div key={emp.id} style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 14, padding: "18px 22px",
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <Avatar name={emp.name} color={emp.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {emp.name}
                        </p>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{emp.role}</span>
                        {badge && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px",
                            borderRadius: 20, background: badge.colorBg, color: badge.color,
                          }}>
                            {badge.icon} {badge.label}
                          </span>
                        )}
                        {!badge && (
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>No badge yet</span>
                        )}
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: "#e5e7eb",
                          borderRadius: 4, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${pct}%`,
                            background: emp.color, borderRadius: 4,
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                          {emp.stats.completedCourses} courses · {emp.stats.avgScore}% avg
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/skillset/employee/${emp.id}`)}
                      style={{
                        padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                        background: "transparent", color: "#374151", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ASSIGN COURSES ── */}
        {tab === "assign" && (
          <div style={{ maxWidth: 700 }}>
            {assignMsg && (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                color: "#166534", fontWeight: 600, fontSize: 13 }}>
                {assignMsg}
              </div>
            )}

            {/* Step 1: Pick course */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827", fontSize: 14 }}>
                1. Select a course
              </p>
              <select
                value={selCourse}
                onChange={e => setSelCourse(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8,
                  border: "1px solid #d1d5db", fontSize: 13, color: "#111827", background: "#fff" }}
              >
                <option value="">— Choose a course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
                ))}
              </select>

              <div style={{ marginTop: 14 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                  Due date (optional)
                </p>
                <input
                  type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
                    fontSize: 13, color: "#111827", background: "#fff" }}
                />
              </div>
            </div>

            {/* Step 2: Pick employees */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 12 }}>
                <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: 14 }}>
                  2. Select employees
                </p>
                <button
                  onClick={() => setSelected(
                    selected.length === team.length ? [] : team.map(e => e.id)
                  )}
                  style={{ fontSize: 12, color: "#2563eb", background: "none",
                    border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  {selected.length === team.length ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {team.map(emp => (
                  <label key={emp.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                    background: selected.includes(emp.id) ? "#eff6ff" : "#f9fafb",
                    border: `1.5px solid ${selected.includes(emp.id) ? "#93c5fd" : "#e5e7eb"}`,
                    transition: "all 0.15s",
                  }}>
                    <input
                      type="checkbox" checked={selected.includes(emp.id)}
                      onChange={() => toggleEmp(emp.id)}
                      style={{ width: 16, height: 16, accentColor: "#2563eb" }}
                    />
                    <Avatar name={emp.name} color={emp.color} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>
                        {emp.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>{emp.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Assign button */}
            <button
              onClick={handleAssign}
              disabled={!selCourse || selected.length === 0}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
                background: (!selCourse || selected.length === 0) ? "#e5e7eb" : "#2563eb",
                color: (!selCourse || selected.length === 0) ? "#9ca3af" : "#fff",
                fontSize: 15, fontWeight: 700, cursor:
                  (!selCourse || selected.length === 0) ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              Assign to {selected.length > 0 ? `${selected.length} employee(s)` : "…"}
            </button>
          </div>
        )}

        {/* ── OFFLINE MARKS ── */}
        {tab === "offline" && SKILLSET_MODULE_CONFIG.managerCanEnterOfflineMarks && (
          <div style={{ maxWidth: 800 }}>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>
              Enter marks from offline / physical tests for your team members.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                Select course / test
              </label>
              <select
                value={offlineCourse}
                onChange={e => setOfflineCourse(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db",
                  fontSize: 13, color: "#111827", background: "#fff", minWidth: 300 }}
              >
                <option value="">— Choose a course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {offlineCourse && (
              <div style={{ background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                      {["Employee", "Role", "Score (0–100)", ""].map(h => (
                        <th key={h} style={{ padding: "12px 18px", textAlign: "left",
                          fontSize: 12, fontWeight: 600, color: "#6b7280",
                          textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((emp, i) => (
                      <tr key={emp.id} style={{
                        borderBottom: i < team.length - 1 ? "1px solid #f1f5f9" : "none"
                      }}>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar name={emp.name} color={emp.color} />
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                              {emp.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 13, color: "#6b7280" }}>
                          {emp.role}
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <ScoreInput
                            empId={emp.id}
                            courseId={offlineCourse}
                            existing={null}
                            onSave={handleSaveScore}
                          />
                        </td>
                        <td style={{ padding: "14px 18px", fontSize: 11,
                          color: "#9ca3af", fontStyle: "italic" }}>
                          offline
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}