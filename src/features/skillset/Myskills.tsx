import React, { useState } from "react";
// ── Types ──────────────────────────────────────────────────────────────────
type SkillType = "tech" | "tools" | "soft";

interface Skill {
  id: number;
  name: string;
  type: SkillType;
  rating: number;
  learn: string;
  apply: string;
  dateAdded: string;
  dateLearned: string;
  certDate: string;
  modified: string;
  file: string;
}

// ── Initial Data (replace with API call) ───────────────────────────────────
const INITIAL_SKILLS: Skill[] = [
  {
    id: 1,
    name: "Spring Boot",
    type: "tech",
    rating: 5,
    learn: "Udemy",
    apply: "Leave App",
    dateAdded: "2026-02-01",
    dateLearned: "2026-01-15",
    certDate: "2026-01-20",
    modified: "Today",
    file: "SpringCert.pdf",
  },
  {
    id: 2,
    name: "Docker",
    type: "tools",
    rating: 4,
    learn: "Online Course",
    apply: "Containerization Project",
    dateAdded: "2026-02-15",
    dateLearned: "2026-02-01",
    certDate: "2026-02-10",
    modified: "2026-04-05",
    file: "DockerCert.pdf",
  },
  {
    id: 3,
    name: "Public Speaking",
    type: "soft",
    rating: 4,
    learn: "Toastmasters",
    apply: "Final Seminar",
    dateAdded: "2026-01-10",
    dateLearned: "2025-12-20",
    certDate: "2026-01-05",
    modified: "2026-04-10",
    file: "Award.png",
  },
];

// ── Star renderer ──────────────────────────────────────────────────────────
function Stars({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          onClick={() => onChange?.(v)}
          className={`text-xl ${onChange ? "cursor-pointer" : ""}`}
          style={{ color: v <= rating ? "#D4AF37" : "#dee2e6" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── Skill Card ─────────────────────────────────────────────────────────────
function SkillCard({
  skill,
  onEdit,
}: {
  skill: Skill;
  onEdit: (s: Skill) => void;
}) {
  const [open, setOpen] = useState(false);
  const borderColor =
    skill.type === "tech"
      ? "#2977d0"
      : skill.type === "tools"
        ? "#6f42c1"
        : "#0dcaf0";

  return (
    <div
      className="bg-white rounded-xl mb-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
      style={{ borderLeft: `6px solid ${borderColor}` }}
    >
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <span className="font-bold text-sm text-gray-800">{skill.name}</span>
          <div className="mt-1">
            <Stars rating={skill.rating} />
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(skill);
          }}
          title="Edit"
        >
          ✏️
        </button>
      </div>

      {open && (
        <div className="px-3 pb-3">
          <div
            className="rounded-lg p-3 text-sm"
            style={{ background: "#fdfdfd", border: "1px dashed #e9ecef" }}
          >
            <div className="grid grid-cols-2 gap-y-1 mb-2">
              <div>
                <strong>Learned:</strong> {skill.learn}
              </div>
              <div>
                <strong>Applied:</strong> {skill.apply}
              </div>
              <div className="col-span-2">
                <strong>Proof:</strong>{" "}
                <a href="#" className="text-blue-600 no-underline text-xs">
                  📄 {skill.file}
                </a>
              </div>
            </div>
            <div
              className="text-xs text-gray-400 italic pt-2"
              style={{ borderTop: "1px solid #e9ecef" }}
            >
              Added: {skill.dateAdded} | Learned: {skill.dateLearned} | Cert:{" "}
              {skill.certDate} | Modified: {skill.modified}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({
  skill,
  onClose,
  onSave,
}: {
  skill: Skill;
  onClose: () => void;
  onSave: (updated: Skill) => void;
}) {
  const [form, setForm] = useState<Skill>({ ...skill });

  const set = (field: keyof Skill, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 text-white rounded-t-xl"
          style={{ backgroundColor: "#001d3d" }}
        >
          <h5 className="font-semibold text-sm flex items-center gap-2">
            ✏️ Edit Competency
          </h5>
          <button
            onClick={onClose}
            className="text-white opacity-70 hover:opacity-100 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Skill Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <option value="tech">Technical Stack</option>
                <option value="tools">Tools & Platforms</option>
                <option value="soft">Interpersonal</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Skill Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Learned At
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.learn}
                onChange={(e) => set("learn", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Applied At
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.apply}
                onChange={(e) => set("apply", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Date Learned
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.dateLearned}
                onChange={(e) => set("dateLearned", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Certificate Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg text-sm px-2 py-1.5"
                value={form.certDate}
                onChange={(e) => set("certDate", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Certificate / Proof
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  className="flex-1 border border-gray-300 rounded-lg text-xs px-2 py-1.5"
                />
                <span className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg px-3 text-gray-500">
                  📄
                </span>
              </div>
              <p className="text-xs text-blue-500 mt-1">
                Current: {skill.file}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Proficiency
              </label>
              <Stars rating={form.rating} onChange={(v) => set("rating", v)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
            <button
              className="px-4 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-1.5 rounded-lg text-sm text-white font-semibold"
              style={{ backgroundColor: "#003566" }}
              onClick={() => {
                onSave(form);
                onClose();
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function MySkills() {
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [search, setSearch] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const tech = filtered.filter((s) => s.type === "tech");
  const tools = filtered.filter((s) => s.type === "tools");
  const soft = filtered.filter((s) => s.type === "soft");

  const handleSave = (updated: Skill) => {
    setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const ColHeader = ({ label, color }: { label: string; color: string }) => (
    <h6
      className="text-xs font-bold uppercase mb-6 pb-2"
      style={{
        color: "#001D3D",
        borderBottom: `2px solid #e9ecef`,
      }}
    >
      <span
        style={{ borderBottom: `3px solid ${color}`, paddingBottom: "2px" }}
      >
        {label}
      </span>
    </h6>
  );

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      
      {/* ── Body ── */}
      <div className="container mx-auto px-4 mt-10 pb-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-3">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#001D3D" }}>
              Complete Skill History
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Review and manage your professional growth journey.
            </p>
          </div>
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm w-full md:w-72"
            placeholder="Search by skill name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Technical */}
          <div>
            <ColHeader label="Technical Stack" color="#2977d0" />
            {tech.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No technical skills added yet
              </p>
            ) : (
              tech.map((s) => (
                <SkillCard key={s.id} skill={s} onEdit={setEditingSkill} />
              ))
            )}
          </div>

          {/* Tools */}
          <div>
            <ColHeader label="Tools & Platforms" color="#6f42c1" />
            {tools.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No tools added yet
              </p>
            ) : (
              tools.map((s) => (
                <SkillCard key={s.id} skill={s} onEdit={setEditingSkill} />
              ))
            )}
          </div>

          {/* Interpersonal */}
          <div>
            <ColHeader label="Interpersonal Skills" color="#0dcaf0" />
            {soft.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No interpersonal skills added yet
              </p>
            ) : (
              soft.map((s) => (
                <SkillCard key={s.id} skill={s} onEdit={setEditingSkill} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingSkill && (
        <EditModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
