import React from "react";
import { FaTimes, FaCheckCircle, FaFile } from "react-icons/fa";
import type { LeaveDecision } from "@/features/leave/types";

// ── Types ─────────────────────────────────────────────────────────

interface WfhDetailModalProps {
  isOpen: boolean;
  req: any | null;
  onClose: () => void;
  onAction: (status: LeaveDecision) => void;
}

// ── Helpers ───────────────────────────────────────────────────────

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Workflow step ─────────────────────────────────────────────────

interface StepProps {
  icon?: React.ReactNode;
  initials?: string;
  active?: boolean;   // green filled
  locked?: boolean;   // grey, muted text
  name: string;
  sublabel: string;
}

const Step: React.FC<StepProps> = ({ icon, initials, active, locked, name, sublabel }) => (
  <div className="flex flex-col items-center gap-1" style={{ minWidth: 72 }}>
    {/* Circle */}
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border
        ${active
          ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
          : locked
            ? "bg-white border-slate-300 text-slate-400"
            : "bg-white border-slate-300 text-slate-500"
        }`}
    >
      {active ? icon : initials ?? icon}
    </div>
    {/* Name */}
    <span
      className={`text-[11px] font-semibold text-center leading-tight max-w-[84px]
        ${locked ? "text-slate-400" : "text-slate-700"}`}
    >
      {name}
    </span>
    {/* Sub */}
    <span className={`text-[10px] text-center ${locked ? "text-slate-400" : "text-slate-500"}`}>
      {sublabel}
    </span>
  </div>
);

// thin horizontal rule between steps
const Connector: React.FC<{ locked?: boolean }> = ({ locked }) => (
  <div
    className={`flex-1 h-px mt-[-28px] mx-1 ${locked ? "bg-slate-200" : "bg-slate-300"}`}
    style={{ minWidth: 16 }}
  />
);

// ── Main Modal ────────────────────────────────────────────────────

const WfhDetailModal: React.FC<WfhDetailModalProps> = ({
  isOpen,
  req,
  onClose,
  onAction,
}) => {
  if (!isOpen || !req) return null;

  // ── dates ───────────────────────────────────────────────────
  const startFmt  = formatDate(req.startDate);
  const endFmt    = formatDate(req.endDate);
  const sameDay   = req.startDate === req.endDate;
  const periodStr = sameDay ? startFmt : `${startFmt} to ${endFmt}`;
  const totalDays = req.totalDays ?? req.days ?? 1;
  const dayLabel  = `${totalDays} Day(s) Total`;

  // ── workflow ────────────────────────────────────────────────
  const levels: number         = req.requiredApprovalLevels ?? 1;
  const firstDecision: string  = req.firstApproverDecision  ?? "PENDING";
  const secondDecision: string = req.secondApproverDecision ?? "PENDING";

  const l1Name = req.firstApproverName  || req.firstApproverId  || "L1 Approver";
  const l2Name = req.secondApproverName || req.secondApproverId || "L2 Approver";

  const l1Sublabel = firstDecision === "APPROVED"
    ? formatDate(req.firstApproverDecidedAt)
    : firstDecision === "REJECTED" ? "Rejected" : "Pending";

  const l2Locked = levels < 2 || firstDecision !== "APPROVED";
  const l2Sublabel = l2Locked
    ? "Locked"
    : secondDecision === "APPROVED"
      ? formatDate(req.secondApproverDecidedAt)
      : secondDecision === "REJECTED" ? "Rejected" : "Pending";

  const outcomeLabel = req.status === "APPROVED"
    ? "APPROVED"
    : req.status === "REJECTED"
      ? "REJECTED"
      : "PENDING";

  // ── status badge ────────────────────────────────────────────
  const badgeClass =
    req.status === "APPROVED" ? "bg-green-100 text-green-700" :
    req.status === "REJECTED" ? "bg-red-100 text-red-600"     :
    "bg-amber-100 text-amber-700";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 900, maxHeight: "90vh" }}
      >
        {/* ── Title bar ──────────────────────────────────────── */}
        <div className="px-8 pt-7 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">
                WFH Application Details
              </h2>
              <span className={`px-3 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${badgeClass}`}>
                {req.status ?? "PENDING"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <FaTimes size={18} />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">Reference ID: #{req.id}</p>
        </div>

        {/* thin divider */}
        <div className="h-px bg-slate-200 mx-0" />

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">

          {/* ── Meta row ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200">
            {/* Employee */}
            <div className="px-8 py-6 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                EMPLOYEE NAME
              </p>
              <p className="text-base font-bold text-slate-800">{req.employeeName || "—"}</p>
              {req.employeeId && (
                <p className="text-xs text-slate-400 mt-0.5">{req.employeeId}</p>
              )}
            </div>

            {/* Leave type */}
            <div className="px-8 py-6 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                LEAVE TYPE
              </p>
              <p className="text-base font-bold text-slate-800">WFH</p>
            </div>

            {/* Created at */}
            <div className="px-8 py-6 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                CREATED AT
              </p>
              <p className="text-base font-bold text-slate-800">{formatDate(req.createdAt)}</p>
            </div>

            {/* Period */}
            <div className="px-8 py-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                PERIOD
              </p>
              <p className="text-base font-bold text-slate-800">{periodStr}</p>
              <p className="text-xs text-slate-500 mt-0.5">{dayLabel}</p>
            </div>
          </div>

          {/* ── Reason + Workflow ─────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200">

            {/* Reason */}
            <div className="px-8 py-6 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                REASON FOR LEAVE
              </p>
              <div className="border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 min-h-[88px] bg-white leading-relaxed italic">
                {req.reason ? `"${req.reason}"` : <span className="not-italic text-slate-400">No reason provided.</span>}
              </div>
            </div>

            {/* Approval workflow */}
            <div className="px-8 py-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                APPROVAL WORKFLOW
              </p>
              <div className="flex items-start">

                {/* Applied */}
                <Step
                  icon={<FaCheckCircle size={16} />}
                  active
                  name="Applied"
                  sublabel={formatDate(req.createdAt)}
                />

                <Connector />

                {/* L1 */}
                <Step
                  initials={l1Name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                  name={l1Name}
                  sublabel={l1Sublabel}
                />

                {/* L2 — only if 2-level approval */}
                {levels >= 2 && (
                  <>
                    <Connector locked={l2Locked} />
                    <Step
                      initials={l2Name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                      locked={l2Locked}
                      name={l2Name}
                      sublabel={l2Sublabel}
                    />
                  </>
                )}

                <Connector locked={req.status === "PENDING"} />

                {/* Outcome */}
                <Step
                  initials="i"
                  locked={req.status === "PENDING"}
                  name="Outcome"
                  sublabel={outcomeLabel}
                />
              </div>
            </div>
          </div>

          {/* ── Supporting documents ──────────────────────────── */}
          {req.attachmentOriginalName && (
            <div className="px-8 py-6 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <FaFile size={12} className="text-slate-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  SUPPORTING DOCUMENTS
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-3 max-w-xs">
                <div className="w-8 h-9 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                  <FaFile size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 leading-snug">
                    {req.attachmentOriginalName}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    CLICK TO PREVIEW
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Dot indicator (matches screenshot) ────────────── */}
        <div className="flex justify-center py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </div>

        {/* ── Action buttons ─────────────────────────────────── */}
        {req.status === "PENDING" && (
          <div className="grid grid-cols-2 border-t border-slate-200">
            <button
              onClick={() => onAction("REJECTED")}
              className="py-5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest border-r border-slate-200"
            >
              DECLINE REQUEST
            </button>
            <button
              onClick={() => onAction("APPROVED")}
              className="py-5 text-sm font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              style={{ background: "linear-gradient(135deg, #4f46e5, #6d28d9)" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.92")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <FaCheckCircle size={15} />
              APPROVE APPLICATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WfhDetailModal;
