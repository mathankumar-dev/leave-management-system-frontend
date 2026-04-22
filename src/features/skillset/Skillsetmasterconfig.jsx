// ─────────────────────────────────────────────────────────────────────────────
//  SkillSetMasterConfig.jsx  —  /skillset/admin/config route
//  HR/Admin configures badge thresholds and module-level settings.
//  On save → PUT /api/skillset/admin/config
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BADGE_CONFIG, SKILLSET_MODULE_CONFIG } from "../data/skillsetConfig";
import skillSVG from "@/assets/svg/skill-svg.svg"; 

function Toggle({ value, onChange, label, description }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid #f1f5f9",
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{label}</p>
        {description && (
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 46, height: 26, borderRadius: 13, border: "none",
          background: value ? "#2563eb" : "#d1d5db",
          cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: value ? 23 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

export default function SkillSetMasterConfig() {
  const navigate = useNavigate();
  const [badges, setBadges] = useState(JSON.parse(JSON.stringify(BADGE_CONFIG)));
  const [settings, setSettings] = useState({ ...SKILLSET_MODULE_CONFIG });
  const [saved, setSaved] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  const updateBadge = (id, field, val) =>
    setBadges(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));

  const handleSave = () => {
    // Replace with: PUT /api/skillset/admin/config { badges, settings }
    console.log("Saving config:", { badges, settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh",
      fontFamily: "system-ui, sans-serif", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280", fontWeight: 600,
              letterSpacing: "0.07em", textTransform: "uppercase" }}>
              WeHRM · SkillSet · Admin
            </p>
            <h1 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, color: "#111827" }}>
              Master Configuration
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {saved && (
              <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                ✓ Saved successfully
              </span>
            )}
            <button
              onClick={handleSave}
              style={{ padding: "9px 22px", borderRadius: 9, border: "none",
                background: "#2563eb", color: "#fff", fontWeight: 700,
                fontSize: 13, cursor: "pointer" }}
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/skillset")}
              style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid #e5e7eb",
                background: "transparent", color: "#374151", fontSize: 13, cursor: "pointer" }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

          {/* ── LEFT: Badge config ── */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 16, padding: "24px" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Badge Thresholds
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 12, color: "#6b7280" }}>
                Configure how many courses &amp; quizzes are needed for each badge,
                and the minimum average quiz score.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {badges.map(badge => (
                  <div key={badge.id} style={{
                    border: "1px solid #e5e7eb", borderRadius: 12,
                    overflow: "hidden",
                  }}>
                    {/* Badge header — click to expand */}
                    <button
                      onClick={() => setEditingBadge(editingBadge === badge.id ? null : badge.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center",
                        gap: 12, padding: "12px 16px", background: "#f9fafb",
                        border: "none", cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{badge.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700,
                          color: badge.color }}>{badge.label}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
                          {badge.coursesRequired} courses · {badge.quizzesRequired} quizzes
                          {badge.minAvgScore > 0 ? ` · ${badge.minAvgScore}% avg` : ""}
                        </p>
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>
                        {editingBadge === badge.id ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Expanded editor */}
                    {editingBadge === badge.id && (
                      <div style={{ padding: "16px", background: "#fff",
                        borderTop: "1px solid #e5e7eb", display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { field: "coursesRequired", label: "Courses" },
                          { field: "quizzesRequired", label: "Quizzes" },
                          { field: "minAvgScore",     label: "Min Avg %" },
                        ].map(({ field, label }) => (
                          <div key={field}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280",
                              textTransform: "uppercase", letterSpacing: "0.06em",
                              display: "block", marginBottom: 4 }}>
                              {label}
                            </label>
                            <input
                              type="number" min={0} max={field === "minAvgScore" ? 100 : 50}
                              value={badge[field]}
                              onChange={e => updateBadge(badge.id, field, parseInt(e.target.value) || 0)}
                              style={{ width: "100%", padding: "7px 10px", borderRadius: 7,
                                border: "1px solid #d1d5db", fontSize: 14, fontWeight: 600,
                                textAlign: "center", color: "#111827", background: "#fff",
                                boxSizing: "border-box" }}
                            />
                          </div>
                        ))}
                        <div style={{ gridColumn: "1/-1" }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280",
                            textTransform: "uppercase", letterSpacing: "0.06em",
                            display: "block", marginBottom: 4 }}>
                            Description
                          </label>
                          <input
                            type="text"
                            value={badge.description}
                            onChange={e => updateBadge(badge.id, "description", e.target.value)}
                            style={{ width: "100%", padding: "7px 10px", borderRadius: 7,
                              border: "1px solid #d1d5db", fontSize: 13, color: "#111827",
                              background: "#fff", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Module settings ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 16, padding: "24px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Module Settings
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6b7280" }}>
                Control feature availability across the system.
              </p>

              {[
                { key: "allowSelfEnroll",            label: "Self-enrollment",
                  desc: "Employees can enroll in any course from the catalog" },
                { key: "allowQuizRetakes",           label: "Quiz retakes",
                  desc: "Allow employees to retake quizzes" },
                { key: "showScoresToEmployee",       label: "Show scores to employee",
                  desc: "Employees can see their own quiz scores" },
                { key: "managerCanAssignCourses",    label: "Manager course assignment",
                  desc: "Managers can assign courses to their reports" },
                { key: "managerCanEnterOfflineMarks",label: "Offline mark entry",
                  desc: "Managers can manually key in test scores for offline exams" },
                { key: "notifyOnAssignment",         label: "Notify on assignment",
                  desc: "Send notification when a course is assigned" },
                { key: "notifyOnCompletion",         label: "Notify on completion",
                  desc: "Send notification when a course is completed" },
                { key: "progressVisibleToManager",   label: "Progress visible to manager",
                  desc: "Team learning progress is visible to the manager" },
                { key: "progressVisibleToHR",        label: "Progress visible to HR",
                  desc: "All employee progress is visible to HR admins" },
              ].map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  label={label}
                  description={desc}
                  value={settings[key]}
                  onChange={v => setSettings(s => ({ ...s, [key]: v }))}
                />
              ))}

              {/* Max retakes spinner */}
              {settings.allowQuizRetakes && (
                <div style={{ paddingTop: 14 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: "#111827",
                    display: "block", marginBottom: 6 }}>
                    Max quiz retakes allowed
                  </label>
                  <input
                    type="number" min={1} max={10}
                    value={settings.maxQuizRetakes}
                    onChange={e => setSettings(s => ({
                      ...s, maxQuizRetakes: parseInt(e.target.value) || 1
                    }))}
                    style={{ width: 80, padding: "7px 10px", borderRadius: 8,
                      border: "1px solid #d1d5db", fontSize: 14, fontWeight: 600,
                      textAlign: "center", color: "#111827", background: "#fff" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}