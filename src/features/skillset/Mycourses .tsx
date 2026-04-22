// src/features/skillset/pages/MyCourses.tsx
import React, { useState, useEffect, useRef } from "react";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Types ──────────────────────────────────────────────────────────────────
type CourseStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";
type ContentType  = "video" | "document" | "link" | "text";
type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay";

interface QuizSettings {
  allowRetakes: boolean;
  maxRetakes: number;
  showScoresToEmployee: boolean;
  timeLimit: number | null;
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correct: number;
  marks: number;
}

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  status: CourseStatus;
  progressPct?: number;
  assignedBy?: string;
  dueDate?: string;
  contentType: ContentType;
  contentUrl: string;
  description?: string;
  // Quiz
  quizEnabled: boolean;
  quizSettings?: QuizSettings;
  quizScore?: number | null;
  quizRetakesUsed?: number;
  quizOffline?: boolean;
}

interface Quiz {
  courseId: number;
  courseTitle: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
}

// ── Rich sample data ───────────────────────────────────────────────────────
const SAMPLE_COURSES: Course[] = [
  {
    id: 1, title: "Introduction to GDPR Compliance", category: "Compliance", duration: "45 min",
    status: "COMPLETED", progressPct: 100, assignedBy: "Balasubramanian R", dueDate: "30 Apr 2026",
    contentType: "video", contentUrl: "https://www.youtube.com/embed/acijNEErf-c",
    description: "A comprehensive introduction to GDPR regulations and data privacy best practices.",
    quizEnabled: true,
    quizSettings: { allowRetakes: true, maxRetakes: 3, showScoresToEmployee: true, timeLimit: 20, passingScore: 70 },
    quizScore: 82, quizRetakesUsed: 1, quizOffline: false,
  },
  {
    id: 2, title: "Advanced React Patterns", category: "Technical", duration: "2 hr",
    status: "IN_PROGRESS", progressPct: 65,
    contentType: "document", contentUrl: "https://react.dev/learn",
    description: "Deep dive into compound components, render props, hooks patterns, and performance optimisation.",
    quizEnabled: true,
    quizSettings: { allowRetakes: false, maxRetakes: 1, showScoresToEmployee: true, timeLimit: 40, passingScore: 75 },
    quizScore: null, quizRetakesUsed: 0,
  },
  {
    id: 3, title: "Leadership Essentials", category: "Soft Skills", duration: "1.5 hr",
    status: "ASSIGNED", progressPct: 0, assignedBy: "Balasubramanian R", dueDate: "05 May 2026",
    contentType: "link", contentUrl: "https://learning.internal/leadership",
    description: "Build core leadership skills — communication, delegation, and team motivation.",
    quizEnabled: false,
    quizScore: null, quizRetakesUsed: 0,
  },
  {
    id: 4, title: "Python for Data Analysis", category: "Technical", duration: "3 hr",
    status: "COMPLETED", progressPct: 100,
    contentType: "video", contentUrl: "https://www.youtube.com/embed/r-uOLxNrNk8",
    description: "Pandas, NumPy, Matplotlib — all the essentials for data analysis in Python.",
    quizEnabled: true,
    quizSettings: { allowRetakes: true, maxRetakes: 2, showScoresToEmployee: true, timeLimit: 30, passingScore: 65 },
    quizScore: 91, quizRetakesUsed: 1, quizOffline: false,
  },
  {
    id: 5, title: "Docker Fundamentals", category: "Tools", duration: "2 hr",
    status: "COMPLETED", progressPct: 100,
    contentType: "text", contentUrl: "Docker is a platform that enables you to develop, ship, and run applications inside containers. Containers bundle your application code together with its dependencies...",
    description: "Containerisation from scratch — images, containers, volumes, and networking.",
    quizEnabled: true,
    quizSettings: { allowRetakes: true, maxRetakes: 3, showScoresToEmployee: false, timeLimit: 25, passingScore: 65 },
    quizScore: 78, quizRetakesUsed: 2, quizOffline: false,
  },
];

const SAMPLE_CATALOG: Course[] = [
  {
    id: 101, title: "Mental Health at Work", category: "Wellbeing", duration: "30 min",
    status: "NOT_STARTED", contentType: "video", contentUrl: "",
    description: "Practical strategies for maintaining mental wellbeing in a demanding work environment.",
    quizEnabled: false,
  },
  {
    id: 102, title: "SQL Advanced Techniques", category: "Technical", duration: "2.5 hr",
    status: "NOT_STARTED", contentType: "document", contentUrl: "",
    description: "Window functions, CTEs, query optimisation, and advanced joins.",
    quizEnabled: true,
    quizSettings: { allowRetakes: true, maxRetakes: 3, showScoresToEmployee: true, timeLimit: 45, passingScore: 70 },
  },
  {
    id: 103, title: "Project Management Basics", category: "Management", duration: "2 hr",
    status: "NOT_STARTED", contentType: "link", contentUrl: "",
    description: "Agile, Scrum, Waterfall — choosing the right methodology for your team.",
    quizEnabled: true,
    quizSettings: { allowRetakes: false, maxRetakes: 1, showScoresToEmployee: true, timeLimit: null, passingScore: 60 },
  },
];

const SAMPLE_QUIZ: Quiz = {
  courseId: 2,
  courseTitle: "Advanced React Patterns",
  settings: { allowRetakes: false, maxRetakes: 1, showScoresToEmployee: true, timeLimit: 10, passingScore: 75 },
  questions: [
    { id: "q1", type: "multiple_choice", text: "Which hook is best for heavy computations to avoid re-runs on every render?", options: ["useState", "useEffect", "useMemo", "useRef"], correct: 2, marks: 2 },
    { id: "q2", type: "true_false", text: "useCallback returns a memoised value, while useMemo returns a memoised function.", options: ["True", "False"], correct: 1, marks: 1 },
    { id: "q3", type: "multiple_choice", text: "Compound Components pattern is best for:", options: ["Sharing state through Context", "Making HTTP calls", "Handling form validation", "Lazy loading modules"], correct: 0, marks: 2 },
    { id: "q4", type: "short_answer", text: "What problem does the Render Props pattern solve?", options: [], correct: -1, marks: 3 },
    { id: "q5", type: "multiple_choice", text: "React.memo is used to:", options: ["Memoize function results", "Prevent unnecessary re-renders of a component", "Create a new Context", "Batch state updates"], correct: 1, marks: 2 },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function mapCourse(d: any): Course {
  return {
    id: d.id, title: d.title ?? "", category: d.category ?? "General",
    duration: d.duration ?? "—", status: d.status ?? "NOT_STARTED",
    progressPct: d.progressPct ?? 0, assignedBy: d.assignedBy,
    dueDate: d.dueDate, contentType: d.contentType ?? "link",
    contentUrl: d.contentUrl ?? "", description: d.description ?? "",
    quizEnabled: d.quizEnabled ?? false, quizSettings: d.quizSettings,
    quizScore: d.quizScore ?? null, quizRetakesUsed: d.quizRetakesUsed ?? 0,
    quizOffline: d.quizOffline ?? false,
  };
}

const STATUS_META: Record<CourseStatus, { label: string; bg: string; color: string }> = {
  ASSIGNED:    { label: "Assigned",    bg: "#dbeafe", color: "#1e40af" },
  IN_PROGRESS: { label: "In Progress", bg: "#fef3c7", color: "#92400e" },
  COMPLETED:   { label: "Completed",   bg: "#dcfce7", color: "#166534" },
  NOT_STARTED: { label: "Not Started", bg: "#f3f4f6", color: "#6b7280" },
};

const CT_ICONS: Record<ContentType, string> = { video: "🎬", document: "📄", link: "🔗", text: "📝" };

function StatusPill({ status }: { status: CourseStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.NOT_STARTED;
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}>{m.label}</span>
  );
}

// ── Content Viewer ─────────────────────────────────────────────────────────
function ContentViewer({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {CT_ICONS[course.contentType]} {course.contentType}
            </p>
            <h2 className="font-black text-slate-800 text-base">{course.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {course.contentType === "video" && course.contentUrl && (
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe src={course.contentUrl} className="w-full h-full" allowFullScreen title={course.title} />
            </div>
          )}

          {course.contentType === "document" && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-slate-600 font-semibold text-base mb-3">{course.title}</p>
              <p className="text-slate-400 text-sm mb-6">Click below to open the document</p>
              <a href={course.contentUrl || "#"} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
                Open Document ↗
              </a>
            </div>
          )}

          {course.contentType === "link" && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔗</div>
              <p className="text-slate-600 font-semibold text-base mb-3">{course.title}</p>
              <p className="text-slate-400 text-sm mb-6">This course opens in an external page</p>
              <a href={course.contentUrl || "#"} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
                Open Course ↗
              </a>
            </div>
          )}

          {course.contentType === "text" && (
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {course.contentUrl}
            </div>
          )}

          {course.description && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">About this course</p>
              <p className="text-sm text-slate-600">{course.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quiz Modal ─────────────────────────────────────────────────────────────
function QuizModal({ quiz, onClose, onSubmit }: {
  quiz: Quiz; onClose: () => void;
  onSubmit: (score: number, passed: boolean, answers: Record<string, any>) => void;
}) {
  const [answers, setAnswers]   = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]     = useState<{ score: number; correct: number; passed: boolean; totalMarks: number; earnedMarks: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.settings.timeLimit ? quiz.settings.timeLimit * 60 : null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allAnswered = quiz.questions.every(q =>
    q.type === "short_answer" || q.type === "essay"
      ? (answers[q.id] ?? "").trim().length > 0
      : answers[q.id] !== undefined
  );

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => (t ?? 1) - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, submitted]);

  const handleSubmit = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const totalMarks = quiz.questions.reduce((s, q) => s + q.marks, 0);
    let earnedMarks = 0;
    let correct = 0;
    quiz.questions.forEach(q => {
      if (q.type === "multiple_choice" || q.type === "true_false") {
        if (answers[q.id] === q.correct) { earnedMarks += q.marks; correct++; }
      }
      // Open-ended: manager grades later
    });
    const autoGradedQ = quiz.questions.filter(q => q.type === "multiple_choice" || q.type === "true_false").length;
    const autoGradedMarks = quiz.questions.filter(q => q.type === "multiple_choice" || q.type === "true_false").reduce((s, q) => s + q.marks, 0);
    const score = autoGradedMarks > 0 ? Math.round((earnedMarks / autoGradedMarks) * 100) : 0;
    const passed = score >= quiz.settings.passingScore;
    setResult({ score, correct, passed, totalMarks, earnedMarks });
    setSubmitted(true);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const hasOpenQ = quiz.questions.some(q => q.type === "short_answer" || q.type === "essay");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8"
      onClick={e => { if (e.target === e.currentTarget && !submitted) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl text-white"
          style={{ background: "linear-gradient(135deg,#001d3d,#003566)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Quiz</p>
            <h2 className="font-black text-base">{quiz.courseTitle}</h2>
            <p className="text-xs opacity-60 mt-0.5">Passing score: {quiz.settings.passingScore}%</p>
          </div>
          {timeLeft !== null && !submitted && (
            <div className="px-4 py-1.5 rounded-full text-sm font-black"
              style={{ background: timeLeft < 60 ? "#fee2e2" : "rgba(255,255,255,0.15)", color: timeLeft < 60 ? "#dc2626" : "white" }}>
              ⏱ {fmt(timeLeft)}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Result */}
          {submitted && result && (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">{result.passed ? "🎉" : "📖"}</div>
              {quiz.settings.showScoresToEmployee ? (
                <>
                  <h3 className="text-3xl font-black text-slate-800 mb-1">{result.score}%</h3>
                  <p className="text-slate-500 text-sm mb-2">{result.correct} / {quiz.questions.filter(q => q.type !== "short_answer" && q.type !== "essay").length} auto-graded correct</p>
                  {hasOpenQ && <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">Open-ended answers will be reviewed and graded by your manager.</p>}
                </>
              ) : (
                <p className="text-slate-500 text-sm mb-3">Your answers have been submitted. Your manager will share your results.</p>
              )}
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6"
                style={{ background: result.passed ? "#dcfce7" : "#fee2e2", color: result.passed ? "#166534" : "#dc2626" }}>
                {result.passed ? "✓ Passed" : "✗ Did not pass"}
              </span>

              {quiz.settings.showScoresToEmployee && (
                <div className="text-left space-y-2 mb-6">
                  {quiz.questions.map((q, i) => {
                    const isOpen = q.type === "short_answer" || q.type === "essay";
                    const ua = answers[q.id];
                    const ok = !isOpen && ua === q.correct;
                    return (
                      <div key={q.id} className="rounded-xl p-3" style={{
                        background: isOpen ? "#fffbeb" : ok ? "#f0fdf4" : "#fef2f2",
                        border: `1px solid ${isOpen ? "#fde68a" : ok ? "#86efac" : "#fca5a5"}`,
                      }}>
                        <p className="text-sm font-semibold text-slate-800 mb-1">{i + 1}. {q.text}</p>
                        {isOpen ? (
                          <p className="text-xs text-amber-600 italic">Open-ended — pending manager review</p>
                        ) : (
                          <p className="text-xs" style={{ color: ok ? "#166534" : "#dc2626" }}>
                            {ok ? "✓ Correct" : `✗ You chose "${q.options[ua]}" · Correct: "${q.options[q.correct]}"`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={() => onSubmit(result.score, result.passed, answers)}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: "#003566" }}>
                Save & Close
              </button>
            </div>
          )}

          {/* Questions */}
          {!submitted && (
            <>
              <div className="space-y-5">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="text-sm font-bold text-slate-800">
                        <span className="text-slate-400 font-normal mr-2">{idx + 1}/{quiz.questions.length}</span>
                        {q.text}
                      </p>
                      <span className="text-xs font-bold text-slate-400 flex-shrink-0">{q.marks}pt{q.marks !== 1 ? "s" : ""}</span>
                    </div>

                    {(q.type === "multiple_choice" || q.type === "true_false") && (
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          const chosen = answers[q.id] === oi;
                          return (
                            <label key={oi} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
                              style={{ background: chosen ? "#eff6ff" : "#f9fafb", border: `1.5px solid ${chosen ? "#93c5fd" : "#e5e7eb"}` }}>
                              <input type="radio" name={q.id} checked={chosen}
                                onChange={() => setAnswers(a => ({ ...a, [q.id]: oi }))} className="accent-blue-600" />
                              <span className="text-sm text-slate-800">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "short_answer" && (
                      <textarea placeholder="Type your answer here (1–2 sentences)..."
                        value={answers[q.id] ?? ""}
                        onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                        rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors" />
                    )}

                    {q.type === "essay" && (
                      <textarea placeholder="Write your detailed response here..."
                        value={answers[q.id] ?? ""}
                        onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                        rows={6} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} disabled={!allAnswered}
                  className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all disabled:cursor-not-allowed"
                  style={{ background: allAnswered ? "#003566" : "#e5e7eb", color: allAnswered ? "white" : "#9ca3af" }}>
                  Submit Quiz
                </button>
                <button onClick={onClose} className="px-5 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Save & Exit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Course Card ────────────────────────────────────────────────────────────
function CourseCard({ course, onTakeQuiz, onViewContent }: {
  course: Course; onTakeQuiz: (c: Course) => void; onViewContent: (c: Course) => void;
}) {
  const canRetake = course.quizSettings?.allowRetakes && (course.quizRetakesUsed ?? 0) < (course.quizSettings?.maxRetakes ?? 3);
  const quizDone  = course.quizScore != null;
  const showQuizBtn = course.quizEnabled && !quizDone && (course.status === "COMPLETED" || course.status === "IN_PROGRESS");
  const showRetakeBtn = course.quizEnabled && quizDone && canRetake;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
      style={{ borderLeft: course.status === "ASSIGNED" ? "4px solid #2563eb" : undefined }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base flex-shrink-0">{CT_ICONS[course.contentType]}</span>
            <p className="font-black text-sm text-slate-800 truncate">{course.title}</p>
          </div>
          <p className="text-xs text-slate-400">{course.category} · {course.duration}</p>
        </div>
        <StatusPill status={course.status} />
      </div>

      {course.status === "IN_PROGRESS" && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span><span>{course.progressPct ?? 0}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${course.progressPct ?? 0}%`, background: "linear-gradient(90deg,#003566,#2977d0)" }} />
          </div>
        </div>
      )}

      {course.assignedBy && (
        <p className="text-xs text-slate-500">
          📌 Assigned by <strong>{course.assignedBy}</strong>
          {course.dueDate ? ` · Due ${course.dueDate}` : ""}
        </p>
      )}

      {quizDone && course.quizSettings?.showScoresToEmployee !== false && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-600">
            Quiz: <strong style={{ color: (course.quizScore ?? 0) >= (course.quizSettings?.passingScore ?? 65) ? "#16a34a" : "#dc2626" }}>
              {course.quizScore}%
            </strong>
            {course.quizOffline && <span className="text-slate-400 ml-1">(offline)</span>}
          </p>
          {showRetakeBtn && (
            <span className="text-[10px] text-slate-400">({course.quizRetakesUsed}/{course.quizSettings?.maxRetakes} retakes used)</span>
          )}
        </div>
      )}

      {quizDone && course.quizSettings?.showScoresToEmployee === false && (
        <p className="text-xs text-amber-600 italic">Quiz submitted — your manager will share results.</p>
      )}

      <div className="flex gap-2 mt-auto pt-1">
        <button onClick={() => onViewContent(course)}
          className="flex-1 py-2 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
          {course.contentType === "video" ? "▶ Watch" : course.contentType === "document" ? "📄 View" : course.contentType === "text" ? "📝 Read" : "🔗 Open"}
        </button>
        {showQuizBtn && (
          <button onClick={() => onTakeQuiz(course)}
            className="flex-1 py-2 rounded-lg text-xs font-black text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
            Take Quiz
          </button>
        )}
        {showRetakeBtn && (
          <button onClick={() => onTakeQuiz(course)}
            className="flex-1 py-2 rounded-lg text-xs font-black text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6f42c1,#8b5cf6)" }}>
            Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</h3>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#64748b" }}>{count}</span>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
const MyCourses: React.FC = () => {
  const [courses, setCourses]   = useState<Course[]>(SAMPLE_COURSES);
  const [catalog, setCatalog]   = useState<Course[]>(SAMPLE_CATALOG);
  const [loading, setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "catalog">("my");
  const [viewContent, setViewContent] = useState<Course | null>(null);
  const [quizTarget, setQuizTarget]   = useState<Course | null>(null);
  const [quizData, setQuizData]       = useState<Quiz | null>(null);
  const [search, setSearch]     = useState("");

  const handleTakeQuiz = async (course: Course) => {
    setQuizTarget(course);
    // Use sample data for demo; real: await skillsetService.getQuiz(course.id)
    setQuizData({ ...SAMPLE_QUIZ, courseId: course.id, courseTitle: course.title, settings: course.quizSettings ?? SAMPLE_QUIZ.settings });
  };

  const handleQuizSubmit = async (score: number, passed: boolean, answers: Record<string, any>) => {
    try {
      await skillsetService.submitQuiz({ courseId: quizTarget!.id, score, answers });
    } catch { /* sample mode */ }
    setCourses(prev => prev.map(c => c.id === quizTarget!.id
      ? { ...c, quizScore: score, quizRetakesUsed: (c.quizRetakesUsed ?? 0) + 1, status: "COMPLETED" }
      : c));
    setQuizTarget(null); setQuizData(null);
  };

  const handleEnroll = async (course: Course) => {
    setCourses(prev => [{ ...course, status: "NOT_STARTED" }, ...prev]);
    setCatalog(prev => prev.filter(c => c.id !== course.id));
  };

  const filter = (list: Course[]) => search
    ? list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
    : list;

  const assigned   = filter(courses.filter(c => c.status === "ASSIGNED"));
  const inProgress = filter(courses.filter(c => c.status === "IN_PROGRESS"));
  const completed  = filter(courses.filter(c => c.status === "COMPLETED"));
  const notStarted = filter(courses.filter(c => c.status === "NOT_STARTED"));

  return (
    <div className="font-sans" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {viewContent && <ContentViewer course={viewContent} onClose={() => setViewContent(null)} />}
      {quizTarget && quizData && (
        <QuizModal quiz={quizData} onClose={() => { setQuizTarget(null); setQuizData(null); }} onSubmit={handleQuizSubmit} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800">My Courses</h1>
          <p className="text-xs text-slate-400 mt-0.5">{courses.length} enrolled · {completed.length} completed</p>
        </div>
        <input type="text" placeholder="Search courses..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:border-blue-400 transition-colors" />
      </div>

      <div className="flex gap-2 mb-6" style={{ borderBottom: "2px solid #e2e8f0" }}>
        {(["my", "catalog"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 pb-2 text-sm font-bold transition-colors"
            style={{ borderBottom: activeTab === t ? "2px solid #003566" : "2px solid transparent", color: activeTab === t ? "#001d3d" : "#94a3b8", marginBottom: "-2px" }}>
            {t === "my" ? `My Courses (${courses.length})` : `Catalog (${catalog.length})`}
          </button>
        ))}
      </div>

      {activeTab === "my" && (
        <div className="space-y-8">
          {assigned.length > 0 && (<div><SectionHeader label="Assigned to you" count={assigned.length} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{assigned.map(c => <CourseCard key={c.id} course={c} onTakeQuiz={handleTakeQuiz} onViewContent={setViewContent} />)}</div></div>)}
          {inProgress.length > 0 && (<div><SectionHeader label="In Progress" count={inProgress.length} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{inProgress.map(c => <CourseCard key={c.id} course={c} onTakeQuiz={handleTakeQuiz} onViewContent={setViewContent} />)}</div></div>)}
          {notStarted.length > 0 && (<div><SectionHeader label="Not Started" count={notStarted.length} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{notStarted.map(c => <CourseCard key={c.id} course={c} onTakeQuiz={handleTakeQuiz} onViewContent={setViewContent} />)}</div></div>)}
          {completed.length > 0 && (<div><SectionHeader label="Completed" count={completed.length} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{completed.map(c => <CourseCard key={c.id} course={c} onTakeQuiz={handleTakeQuiz} onViewContent={setViewContent} />)}</div></div>)}
          {courses.length === 0 && <div className="text-center py-16 text-slate-400 text-sm">No courses yet. Browse the catalog to get started!</div>}
        </div>
      )}

      {activeTab === "catalog" && (
        <div>
          {catalog.length === 0 ? (
            <p className="text-center py-16 text-slate-400 text-sm">No new courses available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filter(catalog).map(c => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{CT_ICONS[c.contentType]}</span>
                      <p className="font-black text-sm text-slate-800">{c.title}</p>
                    </div>
                    <p className="text-xs text-slate-400">{c.category} · {c.duration}</p>
                    {c.description && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{c.description}</p>}
                    {c.quizEnabled && c.quizSettings && (
                      <p className="text-[10px] text-slate-400 mt-2">
                        Quiz: {c.quizSettings.passingScore}% to pass{c.quizSettings.timeLimit ? ` · ${c.quizSettings.timeLimit}min` : ""}
                        {c.quizSettings.allowRetakes ? ` · ${c.quizSettings.maxRetakes} retakes` : " · No retakes"}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleEnroll(c)}
                    className="mt-auto py-2 rounded-lg text-xs font-black text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;