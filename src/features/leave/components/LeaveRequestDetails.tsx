import { formatDateDisplay } from "@/shared/utils/dateUtils";
import React from 'react';
import { FaCommentAlt } from "react-icons/fa";

interface LeaveRequestDetailsProps {
    req: any;
    approverNames: { l1: string; l2: string };
}

export const LeaveRequestDetails: React.FC<LeaveRequestDetailsProps> = ({ req, approverNames }) => {
    const showSecondLevel = !!req.secondApproverId;

    return (
        <div className="flex flex-col gap-8">
            {/* Row 1: 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-50 pb-6">
                <DetailItem label="Employee Name" value={req.employeeName} subValue={req.employeeId} />
                <DetailItem label="Leave Type" value={req.leaveTypeName} className="text-indigo-600" />
                <DetailItem
                    label="Period"
                    value={
                        formatDateDisplay(req.startDate) === formatDateDisplay(req.endDate)
                            ? formatDateDisplay(req.startDate)
                            : `${formatDateDisplay(req.startDate)} to ${formatDateDisplay(req.endDate)}`
                    }
                    subValue={`${req.days} Day(s) Total`}
                />
            </div>

            {/* Row 2: 2 Columns (Workflow & Reason) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Reason Column (Occupies 1/3) */}
                <div className="lg:col-span-1 flex flex-col gap-2 h-full">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        Reason for Leave
                    </p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px] h-full">
                        <p className="text-sm text-slate-700 leading-relaxed italic break-words whitespace-pre-wrap">
                            "{req.reason || 'No reason provided'}"
                        </p>
                    </div>
                </div>

                {/* Approval Workflow Column (Occupies 2/3) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center lg:text-left">
                        Approval Workflow
                    </h4>
                    <div className="relative flex justify-between items-start w-full px-2 pt-2">
                        {/* Progress Line Background */}
                        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 rounded-full -z-0" />

                        {/* Dynamic Progress Line */}
                        <div
                            className="absolute top-4 left-6 h-1 bg-emerald-400 rounded-full transition-all duration-500 -z-0"
                            style={{
                                width: req.status === 'APPROVED' ? 'calc(100% - 3rem)' :
                                    req.firstApproverDecision === 'APPROVED' ? '45%' : '0%'
                            }}
                        />

                        <WorkflowStep label="Applied" subLabel={formatDateDisplay(req.createdAt)} isComplete />

                        <WorkflowStep
                            label={approverNames.l1}
                            subLabel={req.firstApproverDecision || 'Pending'}
                            status={req.firstApproverDecision}
                            shortLabel="L1"
                        />

                        {showSecondLevel && (
                            <WorkflowStep
                                label={approverNames.l2}
                                subLabel={req.secondApproverDecision || (req.firstApproverDecision === 'APPROVED' ? 'Waiting' : 'Locked')}
                                status={req.secondApproverDecision}
                                shortLabel="L2"
                            />
                        )}

                        <WorkflowStep label="Outcome" subLabel={req.status} status={req.status} isFinal />
                    </div>
                </div>
            </div>

            {/* Reviewer Remarks Section */}
            {(req.firstApproverComment || req.secondApproverComment) && (
                <div className="space-y-3 pt-4 border-t border-slate-50">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FaCommentAlt size={10} className="text-indigo-400" /> Reviewer Remarks
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {req.firstApproverComment && (
                            <RemarkBubble name={approverNames.l1} role="Level 1" comment={req.firstApproverComment} />
                        )}
                        {req.secondApproverComment && (
                            <RemarkBubble name={approverNames.l2} role="Level 2" comment={req.secondApproverComment} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const RemarkBubble = ({ name, role, comment }: any) => (
    <div className="bg-indigo-50/40 border border-indigo-100/50 p-3 rounded-xl">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-indigo-900">{name}</span>
            <span className="text-[9px] font-black text-indigo-300 uppercase">{role}</span>
        </div>
        <p className="text-xs text-indigo-700 leading-snug">"{comment}"</p>
    </div>
);

const DetailItem = ({ label, value, subValue, className = "" }: any) => (
    <div className="flex flex-col">
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</p>
        <p className={`text-sm text-slate-800 font-bold ${className}`}>{value || "N/A"}</p>
        {subValue && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subValue}</p>}
    </div>
);

const WorkflowStep = ({ label, subLabel, status, isComplete, isFinal, shortLabel }: any) => {
    const isApproved = status === 'APPROVED' || isComplete;
    const isRejected = status === 'REJECTED';

    return (
        <div className="relative flex flex-col items-center z-10 flex-1 min-w-0">
            {/* The Circle - Fixed height/width with no margin shifts */}
            <div className={`w-8 h-8 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center transition-all duration-300 shrink-0
                ${isApproved ? 'bg-emerald-400 text-white' : isRejected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                {isApproved ? <span className="text-xs font-bold">✓</span> : isFinal ? <span className="text-xs">!</span> : <span className="text-[10px] font-bold">{shortLabel || 'A'}</span>}
            </div>

            {/* Label Container */}
            <div className="mt-2 text-center w-full px-1">
                <p className="text-[9px] font-black text-slate-700  leading-tight break-words">
                    {label}
                </p>
                <p className={`text-[8px] font-bold  mt-0.5 tracking-tighter ${isRejected ? 'text-rose-500' : 'text-slate-400'}`}>
                    {subLabel}
                </p>
            </div>
        </div>
    );
};