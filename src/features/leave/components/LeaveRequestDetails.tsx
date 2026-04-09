import React from 'react';
import { formatDateDisplay } from "@/shared/utils/dateUtils";

interface LeaveRequestDetailsProps {
    req: any;
    approverNames: { l1: string; l2: string };
}

export const LeaveRequestDetails: React.FC<LeaveRequestDetailsProps> = ({ req, approverNames }) => {
    const showSecondLevel = !!req.secondApproverId;

    return (
        <div className="flex flex-col gap-6">
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Horizontal Approval Workflow */}
            <div className="py-6 px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">
                    Approval Workflow
                </h4>

                <div className="relative flex justify-between items-start w-full max-w-xl mx-auto">
                    <div className="absolute top-4 left-0 w-full h-1.5 bg-slate-100 rounded-full -z-0" />
                    <div
                        className="absolute top-4 left-0 h-1.5 bg-emerald-400 rounded-full transition-all duration-500 -z-0"
                        style={{
                            width: req.status === 'APPROVED' ? '100%' :
                                req.firstApproverDecision === 'APPROVED' ? '50%' : '0%'
                        }}
                    />

                    {/* Applied Stage */}
                    <WorkflowStep label="Applied" subLabel={formatDateDisplay(req.createdAt)} isComplete icon="check" />

                    {/* L1 Stage */}
                    <WorkflowStep 
                        label={approverNames.l1} 
                        subLabel={req.firstApproverDecision || 'Pending'} 
                        status={req.firstApproverDecision} 
                        shortLabel="L1" 
                    />

                    {/* L2 Stage */}
                    {showSecondLevel && (
                        <WorkflowStep 
                            label={approverNames.l2} 
                            subLabel={req.secondApproverDecision || (req.firstApproverDecision === 'APPROVED' ? 'Waiting' : 'Locked')} 
                            status={req.secondApproverDecision} 
                            shortLabel="L2" 
                        />
                    )}

                    {/* Final Outcome */}
                    <WorkflowStep 
                        label="Outcome" 
                        subLabel={req.status} 
                        status={req.status} 
                        isFinal 
                    />
                </div>
            </div>

            {/* Reason Section */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Reason for Leave</p>
                <p className="text-sm text-slate-700 leading-relaxed italic">"{String(req.reason || 'No reason provided')}"</p>
            </div>
        </div>
    );
};

// Internal Helper Components
const DetailItem = ({ label, value, subValue, className = "" }: any) => (
    <div className="flex flex-col">
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{label}</p>
        <p className={`text-slate-800 font-bold ${className}`}>{value || "N/A"}</p>
        {subValue && <p className="text-[10px] text-slate-500 font-medium">{subValue}</p>}
    </div>
);

const WorkflowStep = ({ label, subLabel, status, isComplete, isFinal, shortLabel, icon }: any) => {
    const isApproved = status === 'APPROVED' || isComplete;
    const isRejected = status === 'REJECTED';
    
    return (
        <div className="relative flex flex-col items-center z-10 w-24">
            <div className={`w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300
                ${isApproved ? 'bg-emerald-400 text-white' : isRejected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                {isApproved ? <span className="text-xs">✓</span> : isFinal ? <span className="text-xs">!</span> : <span className="text-xs font-bold">{shortLabel}</span>}
            </div>
            <p className="text-[10px] font-black text-slate-700 uppercase mt-3 truncate w-full text-center">{label}</p>
            <p className={`text-[9px] font-bold uppercase ${isRejected ? 'text-rose-500' : 'text-slate-400'}`}>{subLabel}</p>
        </div>
    );
};