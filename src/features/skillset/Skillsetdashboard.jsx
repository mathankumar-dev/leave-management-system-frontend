// ─────────────────────────────────────────────────────────────────────────────
//  SkillSetDashboard.jsx  —  /skillset route
//  Main employee view: my courses, my badges, take quiz, progress
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  computeBadge, nextBadgeProgress, BADGE_CONFIG, SKILLSET_MODULE_CONFIG
} from "../data/skillsetConfig";

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const pill = (text, bg, color) => (
  <span style={{
    background: bg, color, fontSize: 11, fontWeight: 600,
    padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
  }}>{text}</span>
);

const sectionTitle = (text) => (
  <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.07em",
    color: "#6b7280", textTransform: "uppercase", margin: "0 0 14px" }}>
    {text}
  </h2>
);

function BadgeTile({ badge, earned }) {
  return (
    <div style={{
      background: earned ? badge.colorBg : "#f9fafb",
      border: `1.5px solid ${earned ? badge.color + "44" : "#e5e7eb"}`,
      borderRadius: 14, padding: "16px 14px", textAlign: "center",
      opacity: earned ? 1 : 0.5, transition: "transform 0.15s",
      cursor: earned ? "default" : "not-allowed",
    }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700,
        color: earned ? badge.color : "#9ca3af" }}>{badge.label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 10, color: "#6b7280", lineHeight: 1.4 }}>
        {badge.coursesRequired} courses · {badge.quizzesRequired} quizzes
        {badge.minAvgScore > 0 ? ` · ${badge.minAvgScore}% avg` : ""}
      </p>
    </div>
  );
}

function CourseCard({ course, onTakeQuiz, onStartCourse }) {
  const statusMap = {
    not_started: { label: "Not started", bg: "#f3f4f6", color: "#6b7280" },
    in_progress:  { label: "In progress",  bg: "#fef3c7", color: "#92400e" },
    completed:    { label: "Completed",    bg: "#dcfce7", color: "#166534" },
    assigned:     { label: "Assigned",     bg: "#dbeafe", color: "#1e40af" },
  };
  const s = statusMap[course.status] || statusMap.not_started;

  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb",
      borderRadius: 14, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{course.title}</p>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>{course.category} · {course.duration}</p>
        </div>
        {pill(s.label, s.bg, s.color)}
      </div>

      {/* Progress bar */}
      {course.status === "in_progress" && (
        <div style={{ height: 4, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${course.progressPct || 0}%`,
            background: "#2563eb", borderRadius: 4, transition: "width 0.4s",
          }} />
        </div>
      )}

      {/* Assigned by */}
      {course.assignedBy && (
        <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
          📌 Assigned by <strong>{course.assignedBy}</strong>
          {course.dueDate ? ` · Due ${course.dueDate}` : ""}
        </p>
      )}

      {/* Score if done */}
      {course.quizScore != null && (
        <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>
          Quiz score: <strong style={{ color: course.quizScore >= 65 ? "#16a34a" : "#dc2626" }}>
            {course.quizScore}%
          </strong>
          {course.quizOffline ? " (offline, entered by manager)" : ""}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {course.status !== "completed" && (
          <button
            onClick={() => onStartCourse(course.id)}
            style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid #2563eb",
              background: "transparent", color: "#2563eb", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {course.status === "in_progress" ? "Continue" : "Start Course"}
          </button>
        )}
        {(course.status === "completed" || course.status === "in_progress") &&
          course.quizScore == null && SKILLSET_MODULE_CONFIG.allowSelfEnroll && (
          <button
            onClick={() => onTakeQuiz(course.id)}
            style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
              background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Take Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default function SkillSetDashboard({ currentUser }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("my-courses"); // my-courses | catalog | badges
  const [stats, setStats] = useState({ completedCourses: 4, completedQuizzes: 3, avgScore: 72 });
  const [myCourses, setMyCourses] = useState([]);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    // Replace with: fetch(`/api/skillset/my-courses/${currentUser.id}`)
    setMyCourses([
      { id: 1, title: "Introduction to Data Privacy", category: "Compliance", duration: "45 min",
        status: "completed", quizScore: 82 },
      { id: 2, title: "Leadership Essentials", category: "Soft Skills", duration: "1.5 hr",
        status: "completed", quizScore: 74 },
      { id: 3, title: "Advanced Excel for HR", category: "Tools", duration: "2 hr",
        status: "in_progress", progressPct: 60, assignedBy: "Balasubramanian Ramu", dueDate: "30 Apr 2026" },
      { id: 4, title: "Effective Communication", category: "Soft Skills", duration: "1 hr",
        status: "assigned", assignedBy: "Balasubramanian Ramu", dueDate: "05 May 2026" },
    ]);
    // Replace with: fetch(`/api/skillset/catalog`)
    setCatalog([
      { id: 5, title: "Python for Data Analysis", category: "Technical", duration: "3 hr",
        status: "not_started" },
      { id: 6, title: "Mental Health at Work", category: "Wellbeing", duration: "30 min",
        status: "not_started" },
      { id: 7, title: "Project Management Basics", category: "Management", duration: "2 hr",
        status: "not_started" },
    ]);
  }, []);

  const badge = computeBadge(stats);
  const progress = nextBadgeProgress(stats);
  const allBadges = BADGE_CONFIG;

  const tabs = [
    { id: "my-courses", label: "My Courses" },
    { id: "catalog",    label: "Course Catalog" },
    { id: "badges",     label: "Badges & Progress" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 600,
              letterSpacing: "0.07em", textTransform: "uppercase" }}>
              WeHRM · SkillSet
            </p>
            <h1 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, color: "#111827" }}>
              Learning &amp; Development
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {badge && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: badge.colorBg, padding: "6px 14px", borderRadius: 20,
              }}>
                <span style={{ fontSize: 18 }}>{badge.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: badge.color }}>
                  {badge.label}
                </span>
              </div>
            )}
            <button
              onClick={() => navigate("/portal")}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: "transparent", color: "#374151", fontSize: 13, cursor: "pointer" }}
            >
              ← Back to Portal
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>
        {/* ── Stats Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, marginBottom: 28 }}>
          {[
            { label: "Courses Completed", value: stats.completedCourses, color: "#2563eb" },
            { label: "Quizzes Taken",     value: stats.completedQuizzes, color: "#16a34a" },
            { label: "Avg Quiz Score",    value: `${stats.avgScore}%`,   color: "#d97706" },
            { label: "Assigned Pending",  value: 2, color: "#dc2626" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 14, padding: "18px 20px",
            }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24,
          background: "#f1f5f9", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
                background: tab === t.id ? "#fff" : "transparent",
                color: tab === t.id ? "#2563eb" : "#6b7280",
                boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── My Courses ── */}
        {tab === "my-courses" && (
          <div>
            {myCourses.filter(c => c.status === "assigned").length > 0 && (
              <div style={{ marginBottom: 28 }}>
                {sectionTitle("Assigned to you")}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                  {myCourses.filter(c => c.status === "assigned").map(c => (
                    <CourseCard key={c.id} course={c}
                      onStartCourse={(id) => navigate(`/skillset/course/${id}`)}
                      onTakeQuiz={(id) => navigate(`/skillset/quiz/${id}`)} />
                  ))}
                </div>
              </div>
            )}
            {sectionTitle("In Progress")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 28 }}>
              {myCourses.filter(c => c.status === "in_progress").map(c => (
                <CourseCard key={c.id} course={c}
                  onStartCourse={(id) => navigate(`/skillset/course/${id}`)}
                  onTakeQuiz={(id) => navigate(`/skillset/quiz/${id}`)} />
              ))}
              {myCourses.filter(c => c.status === "in_progress").length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 13 }}>No courses in progress.</p>
              )}
            </div>
            {sectionTitle("Completed")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {myCourses.filter(c => c.status === "completed").map(c => (
                <CourseCard key={c.id} course={c}
                  onStartCourse={(id) => navigate(`/skillset/course/${id}`)}
                  onTakeQuiz={(id) => navigate(`/skillset/quiz/${id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Catalog ── */}
        {tab === "catalog" && (
          <div>
            {sectionTitle("All Courses")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {[...catalog, ...myCourses].map(c => (
                <CourseCard key={c.id} course={c}
                  onStartCourse={(id) => navigate(`/skillset/course/${id}`)}
                  onTakeQuiz={(id) => navigate(`/skillset/quiz/${id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Badges ── */}
        {tab === "badges" && (
          <div>
            {sectionTitle("Your Badges")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 32 }}>
              {allBadges.map(b => {
                const earned = !!(
                  stats.completedCourses >= b.coursesRequired &&
                  stats.completedQuizzes >= b.quizzesRequired &&
                  stats.avgScore >= b.minAvgScore
                );
                return <BadgeTile key={b.id} badge={b} earned={earned} />;
              })}
            </div>

            {progress.next && (
              <div style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 16, padding: "22px 24px", maxWidth: 500,
              }}>
                {sectionTitle("Next badge")}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <span style={{ fontSize: 36 }}>{progress.next.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
                      {progress.next.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                      {progress.next.description}
                    </p>
                  </div>
                </div>
                <div style={{ height: 8, background: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress.percent}%`,
                    background: progress.next.color, borderRadius: 8, transition: "width 0.5s",
                  }} />
                </div>
                <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                  {progress.percent}% there
                  {progress.coursesNeeded > 0 ? ` · ${progress.coursesNeeded} more courses needed` : ""}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}