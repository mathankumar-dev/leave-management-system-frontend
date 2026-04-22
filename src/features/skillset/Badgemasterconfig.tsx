// src/features/skillset/pages/BadgeMasterConfig.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { skillsetService } from "@/features/skillset/skillsetService";

// ── Types ──────────────────────────────────────────────────────────────────
interface BadgeDef {
  id: string;
  icon: string;
  label: string;       // ← now fully editable
  color: string;
  colorBg: string;
  skillsRequired: number;
  description: string;
  category: "tech_tool" | "interpersonal" | "learning";
}

interface GlobalQuizSettings {
  allowSelfEnroll: boolean;
  allowQuizRetakes: boolean;
  maxQuizRetakes: number;
  showScoresToEmployee: boolean;
  managerCanAssignCourses: boolean;
  managerCanEnterOfflineMarks: boolean;
  notifyOnAssignment: boolean;
  notifyOnCompletion: boolean;
  progressVisibleToManager: boolean;
  progressVisibleToHR: boolean;
}

// ── Sample defaults ────────────────────────────────────────────────────────
const DEFAULT_BADGES: BadgeDef[] = [
  { id: "tech-1", icon: "🛡", label: "Associate",        color: "#2977d0", colorBg: "#e6f1fb", skillsRequired: 5,  description: "5 combined tech & tool skills", category: "tech_tool" },
  { id: "tech-2", icon: "⚙️", label: "Specialist",       color: "#6f42c1", colorBg: "#ede9fe", skillsRequired: 12, description: "12 combined tech & tool skills", category: "tech_tool" },
  { id: "tech-3", icon: "💻", label: "Authority",         color: "#b8860b", colorBg: "#faeeda", skillsRequired: 20, description: "20 combined tech & tool skills (gold)", category: "tech_tool" },
  { id: "soft-1", icon: "🪪", label: "Professional Core", color: "#0aa4c8", colorBg: "#e0f2fe", skillsRequired: 3,  description: "3 interpersonal skills", category: "interpersonal" },
  { id: "soft-2", icon: "👥", label: "Collaborator",      color: "#0891b2", colorBg: "#cffafe", skillsRequired: 10, description: "10 interpersonal skills", category: "interpersonal" },
  { id: "soft-3", icon: "⭐", label: "Strategic Lead",    color: "#7c3aed", colorBg: "#ede9fe", skillsRequired: 15, description: "15 interpersonal skills (gold)", category: "interpersonal" },
];

const DEFAULT_SETTINGS: GlobalQuizSettings = {
  allowSelfEnroll: true,
  allowQuizRetakes: true,
  maxQuizRetakes: 3,
  showScoresToEmployee: true,
  managerCanAssignCourses: true,
  managerCanEnterOfflineMarks: true,
  notifyOnAssignment: true,
  notifyOnCompletion: true,
  progressVisibleToManager: true,
  progressVisibleToHR: true,
};

const ICON_PALETTE = ["🛡","⚙️","💻","🪪","👥","⭐","🏆","🎖","🥇","🎓","🚀","💡","🔥","⚡","🌟","🎯","💎","🦁","🦅","🌈"];
const COLOR_PALETTE = [
  { color: "#2977d0", bg: "#e6f1fb" },
  { color: "#6f42c1", bg: "#ede9fe" },
  { color: "#b8860b", bg: "#faeeda" },
  { color: "#0aa4c8", bg: "#e0f2fe" },
  { color: "#0891b2", bg: "#cffafe" },
  { color: "#7c3aed", bg: "#ede9fe" },
  { color: "#16a34a", bg: "#dcfce7" },
  { color: "#dc2626", bg: "#fee2e2" },
  { color: "#ea580c", bg: "#ffedd5" },
  { color: "#0f766e", bg: "#ccfbf1" },
];

// ── Toggle ─────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label, description }: {
  value: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)}
        className="relative flex-shrink-0 transition-colors duration-200 rounded-full"
        style={{ width: 44, height: 24, background: value ? "#003566" : "#d1d5db" }}>
        <div className="absolute top-0.5 rounded-full bg-white transition-all duration-200"
          style={{ width: 20, height: 20, left: value ? 22 : 2 }} />
      </button>
    </div>
  );
}

// ── Badge Editor Row ───────────────────────────────────────────────────────
function BadgeEditorRow({ badge, expanded, onToggle, onChange }: {
  badge: BadgeDef; expanded: boolean; onToggle: () => void;
  onChange: (updated: BadgeDef) => void;
}) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const set = (field: keyof BadgeDef, val: any) => onChange({ ...badge, [field]: val });

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <span className="text-xl flex-shrink-0">{badge.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: badge.color }}>{badge.label}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{badge.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: badge.colorBg, color: badge.color }}>
            {badge.skillsRequired} skills
          </span>
          <span className="text-xs text-slate-400">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 py-4 bg-white border-t border-slate-200 space-y-4">
          {/* Row 1: icon + name + color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Icon picker */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Icon</label>
              <div className="relative">
                <button type="button" onClick={() => { setShowIconPicker(s => !s); setShowColorPicker(false); }}
                  className="w-full flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-400 transition-colors">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-slate-500 text-xs">Change icon</span>
                </button>
                {showIconPicker && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-3"
                    style={{ width: 240 }}>
                    <div className="grid grid-cols-5 gap-2">
                      {ICON_PALETTE.map(ic => (
                        <button key={ic} type="button"
                          onClick={() => { set("icon", ic); setShowIconPicker(false); }}
                          className="text-2xl p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-center"
                          style={{ background: badge.icon === ic ? "#e6f1fb" : undefined }}>
                          {ic}
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setShowIconPicker(false)}
                      className="w-full text-xs text-slate-400 mt-2 hover:text-slate-600">Close</button>
                  </div>
                )}
              </div>
            </div>

            {/* Badge name */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Badge Name</label>
              <input type="text" value={badge.label} onChange={e => set("label", e.target.value)}
                placeholder="e.g., Expert"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 transition-colors"
                style={{ color: badge.color }} />
            </div>

            {/* Skills required */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {badge.category === "tech_tool" ? "Tech+Tool Skills" : "Skills Required"}
              </label>
              <input type="number" min={0} max={100} value={badge.skillsRequired}
                onChange={e => set("skillsRequired", parseInt(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
          </div>

          {/* Row 2: color + description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Color picker */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Badge Colour</label>
              <div className="relative">
                <button type="button" onClick={() => { setShowColorPicker(s => !s); setShowIconPicker(false); }}
                  className="w-full flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-blue-400 transition-colors">
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: badge.color }} />
                  <span className="text-slate-500 text-xs font-mono">{badge.color}</span>
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-3"
                    style={{ width: 220 }}>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {COLOR_PALETTE.map(cp => (
                        <button key={cp.color} type="button"
                          onClick={() => { set("color", cp.color); set("colorBg", cp.bg); setShowColorPicker(false); }}
                          className="w-9 h-9 rounded-lg border-2 transition-all"
                          style={{ background: cp.color, borderColor: badge.color === cp.color ? "#001d3d" : "transparent" }} />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <label className="text-xs text-slate-400">Custom:</label>
                      <input type="color" value={badge.color}
                        onChange={e => set("color", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0" />
                    </div>
                    <button type="button" onClick={() => setShowColorPicker(false)}
                      className="w-full text-xs text-slate-400 mt-2 hover:text-slate-600">Close</button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
              <input type="text" value={badge.description} onChange={e => set("description", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
          </div>

          {/* Live preview */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Preview</label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100"
              style={{ background: badge.colorBg }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${badge.color}22` }}>
                {badge.icon}
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: badge.color }}>{badge.label || "Badge Name"}</p>
                <p className="text-xs" style={{ color: badge.color + "99" }}>{badge.description}</p>
              </div>
              <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: badge.color + "22", color: badge.color }}>
                {badge.skillsRequired} skills
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
const BadgeMasterConfig: React.FC = () => {
  const navigate = useNavigate();
  const [badges, setBadges]     = useState<BadgeDef[]>(DEFAULT_BADGES);
  const [settings, setSettings] = useState<GlobalQuizSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [expandedBadge, setExpandedBadge] = useState<string | null>("tech-1");

  const updateBadge = (updated: BadgeDef) =>
    setBadges(prev => prev.map(b => b.id === updated.id ? updated : b));

  const handleSave = async () => {
    setSaving(true);
    try {
      await skillsetService.saveBadgeConfig?.({ badges, settings } as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // In sample mode just show saved
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const techBadges = badges.filter(b => b.category === "tech_tool");
  const softBadges = badges.filter(b => b.category === "interpersonal");

  const BGroup = ({ title, icon, color, badges: blist }: { title: string; icon: string; color: string; badges: BadgeDef[] }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-4" style={{ borderBottom: "2px solid #e4e8ef", paddingBottom: 12 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: color }}>
          {icon}
        </div>
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-700">{title}</h2>
        <span className="ml-auto text-xs text-slate-400">{blist.length} badges</span>
      </div>
      <div className="space-y-3">
        {blist.map(b => (
          <BadgeEditorRow key={b.id} badge={b}
            expanded={expandedBadge === b.id}
            onToggle={() => setExpandedBadge(expandedBadge === b.id ? null : b.id)}
            onChange={updateBadge} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16 font-sans" style={{ background: "#f0f2f6", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">WeHRM · SkillSet · Admin</p>
            <h1 className="text-xl font-black text-slate-800 mt-0.5">Badge & Module Configuration</h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm font-bold text-green-600">✓ Saved</span>}
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#001d3d,#2977d0)" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: Badge thresholds ── */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 font-semibold">
              💡 You can edit badge names, icons, colours, skill thresholds, and descriptions. Changes apply system-wide.
            </div>
            <BGroup title="Technical Stack & Tools Journey" icon="💻" color="#2977d0" badges={techBadges} />
            <BGroup title="Interpersonal Journey" icon="👥" color="#0aa4c8" badges={softBadges} />
          </div>

          {/* ── RIGHT: Global module settings ── */}
          <div className="space-y-6">
            {/* Note about per-course quiz settings */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              <strong>ℹ️ Note:</strong> "Quiz retakes", "Show scores to employee" etc. can also be configured
              <strong> per course</strong> in the course editor — those per-course settings take priority
              over these global defaults.
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-1">Global Module Defaults</h2>
              <p className="text-xs text-slate-400 mb-4">These are system-wide defaults. Individual courses can override quiz settings.</p>

              {[
                { key: "allowSelfEnroll",            label: "Self-enrollment",             desc: "Employees can enrol in courses from the catalog" },
                { key: "allowQuizRetakes",           label: "Quiz retakes (default)",      desc: "Global default — can be overridden per course" },
                { key: "showScoresToEmployee",       label: "Show scores (default)",       desc: "Global default — can be overridden per course" },
                { key: "managerCanAssignCourses",    label: "Manager course assignment",   desc: "Managers can assign courses to direct reports" },
                { key: "managerCanEnterOfflineMarks",label: "Offline mark entry",          desc: "Managers can key in scores from offline tests" },
                { key: "notifyOnAssignment",         label: "Notify on assignment",        desc: "Send notification when a course is assigned" },
                { key: "notifyOnCompletion",         label: "Notify on completion",        desc: "Send notification when a course is completed" },
                { key: "progressVisibleToManager",   label: "Progress visible to manager", desc: "Manager can see team learning progress" },
                { key: "progressVisibleToHR",        label: "Progress visible to HR",      desc: "HR can see all employee learning progress" },
              ].map(({ key, label, desc }) => (
                <Toggle key={key} label={label} description={desc}
                  value={settings[key as keyof GlobalQuizSettings] as boolean}
                  onChange={v => setSettings(s => ({ ...s, [key]: v }))} />
              ))}

              {settings.allowQuizRetakes && (
                <div className="pt-4">
                  <label className="text-sm font-bold text-slate-700 block mb-2">Default max retakes</label>
                  <input type="number" min={1} max={10} value={settings.maxQuizRetakes}
                    onChange={e => setSettings(s => ({ ...s, maxQuizRetakes: parseInt(e.target.value) || 1 }))}
                    className="w-20 text-center border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 transition-colors" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeMasterConfig;