// src/features/skillset/pages/ManageCourses.tsx
import React, { useState, useEffect } from "react";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Types ──────────────────────────────────────────────────────────────────
type CourseCategory = "Compliance" | "Technical" | "Soft Skills" | "Tools" | "Management" | "Wellbeing" | "Other";
type ContentType = "video" | "document" | "link" | "text";
type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay";

interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];      // for MCQ / true_false
  correct: number;        // index for MCQ/true_false; -1 for open-ended
  marks: number;
}

interface QuizSettings {
  enabled: boolean;
  allowRetakes: boolean;
  maxRetakes: number;
  showScoresToEmployee: boolean;
  timeLimit: number | null;
  passingScore: number;
}

interface Course {
  id?: number;
  title: string;
  category: CourseCategory;
  duration: string;
  description: string;
  // Content
  contentType: ContentType;
  contentUrl: string;
  contentFile?: File | null;
  // Quiz
  quizSettings: QuizSettings;
  questions: QuizQuestion[];
}

const CATEGORIES: CourseCategory[] = [
  "Compliance", "Technical", "Soft Skills", "Tools", "Management", "Wellbeing", "Other"
];

const CONTENT_TYPES: { value: ContentType; label: string; icon: string; hint: string }[] = [
  { value: "video",    label: "Video",    icon: "🎬", hint: "YouTube, Vimeo, or direct MP4 link" },
  { value: "document", label: "Document", icon: "📄", hint: "PDF, DOCX, or Google Drive link" },
  { value: "link",     label: "Web Link", icon: "🔗", hint: "Any external URL or LMS link" },
  { value: "text",     label: "Text / HTML", icon: "📝", hint: "Write course content directly" },
];

const Q_TYPES: { value: QuestionType; label: string; icon: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice", icon: "⊙" },
  { value: "true_false",      label: "True / False",    icon: "✓✗" },
  { value: "short_answer",    label: "Short Answer",    icon: "✏️" },
  { value: "essay",           label: "Essay / Long Answer", icon: "📃" },
];

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  enabled: true,
  allowRetakes: true,
  maxRetakes: 3,
  showScoresToEmployee: true,
  timeLimit: 30,
  passingScore: 65,
};

const EMPTY_COURSE: Course = {
  title: "", category: "Compliance", duration: "",
  description: "", contentType: "video", contentUrl: "",
  quizSettings: { ...DEFAULT_QUIZ_SETTINGS },
  questions: [],
};

const makeQ = (): QuizQuestion => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  type: "multiple_choice",
  text: "", options: ["", "", "", ""], correct: 0, marks: 1,
});

// ── Sample data ────────────────────────────────────────────────────────────
const SAMPLE_COURSES: Course[] = [
  {
    id: 1,
    title: "Introduction to GDPR Compliance",
    category: "Compliance",
    duration: "45 min",
    description: "A comprehensive introduction to GDPR regulations and how they apply to our organisation.",
    contentType: "video",
    contentUrl: "https://www.youtube.com/embed/acijNEErf-c",
    quizSettings: { enabled: true, allowRetakes: true, maxRetakes: 3, showScoresToEmployee: true, timeLimit: 20, passingScore: 70 },
    questions: [
      { id: "q1", type: "multiple_choice", text: "What does GDPR stand for?", options: ["General Data Processing Regulation", "General Data Protection Regulation", "Global Data Privacy Rules", "General Digital Privacy Regulation"], correct: 1, marks: 2 },
      { id: "q2", type: "true_false", text: "GDPR applies only to companies based in the EU.", options: ["True", "False"], correct: 1, marks: 1 },
      { id: "q3", type: "short_answer", text: "Name two rights a data subject has under GDPR.", options: [], correct: -1, marks: 2 },
    ],
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    category: "Technical",
    duration: "2 hr",
    description: "Deep dive into compound components, render props, hooks patterns, and performance optimisation.",
    contentType: "document",
    contentUrl: "https://drive.google.com/file/d/example/view",
    quizSettings: { enabled: true, allowRetakes: false, maxRetakes: 1, showScoresToEmployee: true, timeLimit: 40, passingScore: 75 },
    questions: [
      { id: "q4", type: "multiple_choice", text: "Which hook is best for heavy computations?", options: ["useState", "useEffect", "useMemo", "useRef"], correct: 2, marks: 2 },
      { id: "q5", type: "essay", text: "Explain the difference between useCallback and useMemo with examples.", options: [], correct: -1, marks: 5 },
    ],
  },
  {
    id: 3,
    title: "Leadership Essentials",
    category: "Soft Skills",
    duration: "1.5 hr",
    description: "Build core leadership skills — communication, delegation, conflict resolution, and team motivation.",
    contentType: "link",
    contentUrl: "https://learning.internal/leadership-essentials",
    quizSettings: { enabled: false, allowRetakes: true, maxRetakes: 2, showScoresToEmployee: true, timeLimit: null, passingScore: 60 },
    questions: [],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative flex-shrink-0 rounded-full transition-colors duration-200 ml-4"
        style={{ width: 42, height: 22, background: value ? "#003566" : "#d1d5db" }}
      >
        <div className="absolute top-0.5 rounded-full bg-white transition-all duration-200"
          style={{ width: 18, height: 18, left: value ? 22 : 2 }} />
      </button>
    </div>
  );
}

// ── Question Editor ────────────────────────────────────────────────────────
function QuestionEditor({ q, index, onChange, onDelete }: {
  q: QuizQuestion; index: number;
  onChange: (updated: QuizQuestion) => void; onDelete: () => void;
}) {
  const set = (field: keyof QuizQuestion, val: any) => onChange({ ...q, [field]: val });
  const setOpt = (i: number, val: string) => {
    const opts = [...q.options]; opts[i] = val; onChange({ ...q, options: opts });
  };
  const changeType = (type: QuestionType) => {
    const base = { ...q, type };
    if (type === "true_false") return onChange({ ...base, options: ["True", "False"], correct: 0 });
    if (type === "multiple_choice") return onChange({ ...base, options: q.options.length >= 2 ? q.options : ["", "", "", ""], correct: 0 });
    return onChange({ ...base, options: [], correct: -1 });
  };

  const isOpen = q.type === "short_answer" || q.type === "essay";

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden" style={{ background: "#fafafa" }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
            {index + 1}
          </span>
          {/* Question type pills */}
          <div className="flex gap-1 flex-wrap">
            {Q_TYPES.map(qt => (
              <button key={qt.value} type="button"
                onClick={() => changeType(qt.value)}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all"
                style={{
                  background: q.type === qt.value ? "#003566" : "white",
                  color: q.type === qt.value ? "white" : "#64748b",
                  borderColor: q.type === qt.value ? "#003566" : "#e2e8f0",
                }}>
                {qt.icon} {qt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <div className="flex items-center gap-1">
            <label className="text-xs text-slate-400">Marks:</label>
            <input type="number" min={1} max={20} value={q.marks}
              onChange={e => set("marks", parseInt(e.target.value) || 1)}
              className="w-12 text-center border border-slate-200 rounded-lg px-1 py-0.5 text-xs focus:outline-none" />
          </div>
          <button type="button" onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors px-2 py-1 rounded hover:bg-red-50">
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <textarea placeholder={isOpen ? "Enter the open-ended question..." : "Enter question..."}
          value={q.text} onChange={e => set("text", e.target.value)} rows={2}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:border-blue-400 transition-colors" />

        {q.type === "multiple_choice" && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Options — click radio to mark correct</p>
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input type="radio" name={`correct-${q.id}`} checked={q.correct === oi}
                  onChange={() => set("correct", oi)} className="accent-green-600 flex-shrink-0" />
                <input type="text" value={opt} onChange={e => setOpt(oi, e.target.value)}
                  placeholder={`Option ${oi + 1}${q.correct === oi ? " ✓ correct" : ""}`}
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors"
                  style={{ borderColor: q.correct === oi ? "#86efac" : "#e2e8f0" }} />
                {q.options.length > 2 && (
                  <button type="button"
                    onClick={() => onChange({ ...q, options: q.options.filter((_, i) => i !== oi), correct: q.correct >= oi && q.correct > 0 ? q.correct - 1 : q.correct })}
                    className="text-slate-300 hover:text-red-400 text-xs px-1">✕</button>
                )}
              </div>
            ))}
            {q.options.length < 6 && (
              <button type="button" onClick={() => onChange({ ...q, options: [...q.options, ""] })}
                className="text-xs font-bold text-blue-600 hover:opacity-75 transition-opacity">
                + Add option
              </button>
            )}
          </div>
        )}

        {q.type === "true_false" && (
          <div className="flex gap-3">
            {["True", "False"].map((opt, oi) => (
              <label key={opt} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border transition-all"
                style={{ borderColor: q.correct === oi ? "#86efac" : "#e2e8f0", background: q.correct === oi ? "#f0fdf4" : "white" }}>
                <input type="radio" name={`tf-${q.id}`} checked={q.correct === oi}
                  onChange={() => set("correct", oi)} className="accent-green-600" />
                <span className="text-sm font-bold">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {isOpen && (
          <div className="rounded-lg p-3 text-xs text-slate-500 italic"
            style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
            {q.type === "short_answer"
              ? "📝 Short answer — employee types a 1–2 sentence response. Manager reviews manually."
              : "📃 Essay — employee writes a detailed response. Manager reviews and grades manually."}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bulk Import Modal ──────────────────────────────────────────────────────
function BulkImportModal({ onImport, onClose }: {
  onImport: (questions: QuizQuestion[]) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(`Q: What does CPU stand for?
A: Central Processing Unit
B: Computer Processing Unit
C: Core Processing Unit
D: Central Program Unit
Correct: A
Marks: 2

Q: RAM is a type of permanent storage.
Type: true_false
Correct: False
Marks: 1

Q: Explain the difference between stack and heap memory.
Type: essay
Marks: 5`);
  const [error, setError] = useState<string | null>(null);

  const parse = () => {
    try {
      const blocks = text.trim().split(/\n\s*\n/);
      const questions: QuizQuestion[] = blocks.map((block, bi) => {
        const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
        const qLine = lines.find(l => l.startsWith("Q:"))?.replace("Q:", "").trim() ?? "";
        if (!qLine) throw new Error(`Block ${bi + 1}: Missing question (start line with "Q:")`);

        const typeLine = lines.find(l => l.startsWith("Type:"))?.replace("Type:", "").trim().toLowerCase();
        const correctLine = lines.find(l => l.startsWith("Correct:"))?.replace("Correct:", "").trim();
        const marksLine = lines.find(l => l.startsWith("Marks:"))?.replace("Marks:", "").trim();

        const optLines = lines.filter(l => /^[A-D]:/.test(l));
        const marks = parseInt(marksLine ?? "1") || 1;

        if (typeLine === "essay") {
          return { id: `qi-${Date.now()}-${bi}`, type: "essay" as QuestionType, text: qLine, options: [], correct: -1, marks };
        }
        if (typeLine === "true_false" || (optLines.length === 0 && !typeLine)) {
          const correct = correctLine?.toLowerCase() === "true" ? 0 : 1;
          return { id: `qi-${Date.now()}-${bi}`, type: "true_false" as QuestionType, text: qLine, options: ["True", "False"], correct, marks };
        }
        if (optLines.length > 0) {
          const options = optLines.map(l => l.replace(/^[A-D]:/, "").trim());
          const correctLetter = correctLine?.toUpperCase() ?? "A";
          const correct = ["A","B","C","D"].indexOf(correctLetter);
          return { id: `qi-${Date.now()}-${bi}`, type: "multiple_choice" as QuestionType, text: qLine, options, correct: correct === -1 ? 0 : correct, marks };
        }
        return { id: `qi-${Date.now()}-${bi}`, type: "short_answer" as QuestionType, text: qLine, options: [], correct: -1, marks };
      });
      onImport(questions);
      onClose();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-800">Bulk Import Questions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Paste questions in the format below</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-bold">
              ⚠ {error}
            </div>
          )}
          <div className="mb-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-3 leading-relaxed"
            style={{ border: "1px dashed #cbd5e1" }}>
            <strong>Format guide:</strong><br />
            MCQ: <code>Q: Question · A/B/C/D: options · Correct: A · Marks: 2</code><br />
            True/False: <code>Q: Question · Type: true_false · Correct: True · Marks: 1</code><br />
            Essay: <code>Q: Question · Type: essay · Marks: 5</code><br />
            Separate questions with a blank line.
          </div>
          <textarea value={text} onChange={e => { setText(e.target.value); setError(null); }}
            rows={14} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-blue-400 transition-colors" />
          <div className="flex gap-3 mt-4">
            <button onClick={parse}
              className="flex-1 py-2.5 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
              Import Questions
            </button>
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Form ────────────────────────────────────────────────────────────
function CourseForm({ initial, onSave, onCancel }: {
  initial: Course; onSave: (c: Course) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Course>(JSON.parse(JSON.stringify(initial)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [activeSection, setActiveSection] = useState<"details" | "content" | "quiz">("details");
  const isEdit = !!initial.id;

  const set = (field: keyof Course, val: any) => setForm(f => ({ ...f, [field]: val }));
  const setQS = (field: keyof QuizSettings, val: any) =>
    setForm(f => ({ ...f, quizSettings: { ...f.quizSettings, [field]: val } }));

  const addQ = () => setForm(f => ({ ...f, questions: [...f.questions, makeQ()] }));
  const updateQ = (idx: number, updated: QuizQuestion) =>
    setForm(f => ({ ...f, questions: f.questions.map((q, i) => i === idx ? updated : q) }));
  const deleteQ = (idx: number) =>
    setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));
  const importQ = (qs: QuizQuestion[]) =>
    setForm(f => ({ ...f, questions: [...f.questions, ...qs] }));

  const totalMarks = form.questions.reduce((s, q) => s + q.marks, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Course title is required."); return; }
    setSaving(true); setError(null);
    try {
      if (isEdit) await skillsetService.updateCourse(initial.id!, form);
      else await skillsetService.createCourse(form);
      onSave(form);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Save failed. Please try again.");
      setSaving(false);
    }
  };

  const sections = [
    { id: "details", label: "📋 Details" },
    { id: "content", label: "🎬 Content" },
    { id: "quiz",    label: `📝 Quiz ${form.questions.length > 0 ? `(${form.questions.length}Q)` : ""}` },
  ] as const;

  return (
    <>
      {showBulk && <BulkImportModal onImport={importQ} onClose={() => setShowBulk(false)} />}
      <form onSubmit={handleSave}>
        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
        )}

        {/* Section tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-0">
          {sections.map(s => (
            <button key={s.id} type="button" onClick={() => setActiveSection(s.id)}
              className="px-4 py-2.5 text-xs font-black transition-all border-b-2"
              style={{
                borderBottomColor: activeSection === s.id ? "#003566" : "transparent",
                color: activeSection === s.id ? "#001d3d" : "#94a3b8",
                marginBottom: "-1px",
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── DETAILS ── */}
        {activeSection === "details" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Course Title *</label>
              <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g., Introduction to GDPR Compliance"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400 transition-colors">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Estimated Duration</label>
                <input type="text" value={form.duration} onChange={e => set("duration", e.target.value)}
                  placeholder="e.g., 45 min, 2 hr"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={4} placeholder="Brief overview of what this course covers..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {activeSection === "content" && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-2">Content Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CONTENT_TYPES.map(ct => (
                  <button key={ct.value} type="button" onClick={() => set("contentType", ct.value)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: form.contentType === ct.value ? "#003566" : "#e2e8f0",
                      background: form.contentType === ct.value ? "#e8f0fb" : "white",
                    }}>
                    <span className="text-xl">{ct.icon}</span>
                    <span className="text-xs font-bold" style={{ color: form.contentType === ct.value ? "#003566" : "#64748b" }}>
                      {ct.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {CONTENT_TYPES.find(c => c.value === form.contentType)?.hint}
              </p>
            </div>

            {(form.contentType === "video" || form.contentType === "document" || form.contentType === "link") && (
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {form.contentType === "video" ? "Video URL" : form.contentType === "document" ? "Document URL / Drive Link" : "Web Link"}
                </label>
                <input type="url" value={form.contentUrl} onChange={e => set("contentUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
                {form.contentType === "document" && (
                  <div className="mt-3">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Or upload a file</label>
                    <input type="file" accept=".pdf,.docx,.pptx,.xlsx"
                      onChange={e => set("contentFile", e.target.files?.[0] ?? null)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                    <p className="text-[10px] text-slate-400 mt-1">Accepted: PDF, DOCX, PPTX, XLSX (max 50MB)</p>
                  </div>
                )}
              </div>
            )}

            {form.contentType === "text" && (
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Course Content</label>
                <textarea value={form.contentUrl} onChange={e => set("contentUrl", e.target.value)}
                  rows={12} placeholder="Write the full course content here. You can use markdown formatting."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:border-blue-400 transition-colors" />
              </div>
            )}

            {/* Preview */}
            {form.contentType === "video" && form.contentUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: "16/9" }}>
                <iframe src={form.contentUrl} className="w-full h-full" allowFullScreen title="Course preview" />
              </div>
            )}
          </div>
        )}

        {/* ── QUIZ ── */}
        {activeSection === "quiz" && (
          <div className="space-y-5">
            {/* Quiz toggle */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <Toggle value={form.quizSettings.enabled} onChange={v => setQS("enabled", v)}
                label="Enable quiz for this course"
                desc="Employees will see a 'Take Quiz' button after finishing the course" />

              {form.quizSettings.enabled && (
                <div className="mt-4 space-y-0">
                  <Toggle value={form.quizSettings.allowRetakes}
                    onChange={v => setQS("allowRetakes", v)}
                    label="Allow quiz retakes"
                    desc="Employee can attempt the quiz more than once" />
                  <Toggle value={form.quizSettings.showScoresToEmployee}
                    onChange={v => setQS("showScoresToEmployee", v)}
                    label="Show scores to employee"
                    desc="Employee can see their score immediately after submission" />

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {form.quizSettings.allowRetakes && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Max Retakes</label>
                        <input type="number" min={1} max={10} value={form.quizSettings.maxRetakes}
                          onChange={e => setQS("maxRetakes", parseInt(e.target.value) || 1)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-blue-400" />
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Time Limit (min)</label>
                      <input type="number" min={1} value={form.quizSettings.timeLimit ?? ""}
                        onChange={e => setQS("timeLimit", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="None"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Passing Score (%)</label>
                      <input type="number" min={0} max={100} value={form.quizSettings.passingScore}
                        onChange={e => setQS("passingScore", parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-blue-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {form.quizSettings.enabled && (
              <>
                {/* Question actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Questions ({form.questions.length})
                    </h3>
                    {totalMarks > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">Total marks: {totalMarks}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowBulk(true)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                      📋 Bulk Import
                    </button>
                    <button type="button" onClick={addQ}
                      className="text-xs font-black px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ background: "#003566" }}>
                      + Add Question
                    </button>
                  </div>
                </div>

                {form.questions.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-slate-500 text-sm font-semibold">No questions yet</p>
                    <p className="text-slate-400 text-xs mt-1">Add questions one by one or use Bulk Import</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.questions.map((q, i) => (
                      <QuestionEditor key={q.id} q={q} index={i}
                        onChange={updated => updateQ(i, updated)}
                        onDelete={() => deleteQ(i)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-5 mt-5 border-t border-slate-200">
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
            {saving ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
          </button>
          <button type="button" onClick={onCancel} disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

// ── Course Card ────────────────────────────────────────────────────────────
function CourseCard({ course, onEdit, onDelete }: {
  course: Course; onEdit: () => void; onDelete: () => void;
}) {
  const CT_ICONS: Record<ContentType, string> = { video: "🎬", document: "📄", link: "🔗", text: "📝" };
  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
        {CT_ICONS[course.contentType]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-slate-800 truncate">{course.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {course.category} · {course.duration}
          {course.quizSettings.enabled && course.questions.length > 0
            ? ` · ${course.questions.length}Q quiz`
            : course.quizSettings.enabled ? " · Quiz (no questions yet)" : " · No quiz"}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {course.quizSettings.enabled && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#e6f1fb", color: "#003566" }}>
            {course.quizSettings.passingScore}% pass
          </span>
        )}
        <button onClick={onEdit}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          Edit
        </button>
        <button onClick={onDelete}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [loading, setLoading]   = useState(false);
  const [view, setView]         = useState<"list" | "form">("list");
  const [editTarget, setEditTarget] = useState<Course | null>(null);
  const [search, setSearch]     = useState("");

  const handleSave = (saved: Course) => {
    setCourses(prev => {
      const exists = prev.find(c => c.id === saved.id);
      return exists ? prev.map(c => c.id === saved.id ? saved : c) : [{ ...saved, id: Date.now() }, ...prev];
    });
    setView("list"); setEditTarget(null);
  };

  const handleDelete = (course: Course) => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;
    setCourses(prev => prev.filter(c => c.id !== course.id));
  };

  const filtered = search
    ? courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses;

  if (view === "form") return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setView("list"); setEditTarget(null); }}
          className="text-xs font-bold text-blue-600 hover:opacity-75 transition-opacity">← Back</button>
        <h2 className="text-base font-black text-slate-800">
          {editTarget?.id ? `Edit: ${editTarget.title}` : "Create New Course"}
        </h2>
      </div>
      <CourseForm initial={editTarget ?? EMPTY_COURSE} onSave={handleSave}
        onCancel={() => { setView("list"); setEditTarget(null); }} />
    </div>
  );

  return (
    <div className="font-sans" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800">Manage Courses</h1>
          <p className="text-xs text-slate-400 mt-0.5">{courses.length} courses in the catalog</p>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-44 focus:outline-none focus:border-blue-400 transition-colors" />
          <button onClick={() => { setEditTarget(null); setView("form"); }}
            className="px-4 py-2 rounded-xl text-sm font-black text-white whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
            + New Course
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-slate-500 font-semibold text-sm">No courses yet</p>
          <p className="text-slate-400 text-xs mt-1">Click "New Course" to create the first one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => (
            <CourseCard key={course.id} course={course}
              onEdit={() => { setEditTarget(course); setView("form"); }}
              onDelete={() => handleDelete(course)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;