import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { formatDateDisplay } from "@/shared/utils/dateUtils";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const DetailedRequestModal: React.FC<{
    req: any;
    isOpen: boolean;
    onClose: () => void;
    onAction: (status: 'APPROVED' | 'REJECTED') => void;
}> = ({ req, isOpen, onClose, onAction }) => {
    const { fetchEmployeeName } = useEmployee();
    const [approverNames, setApproverNames] = useState({ l1: "...", l2: "..." });

    useEffect(() => {
        if (isOpen && req) {
            const loadNames = async () => {
                const res1 = req.firstApproverId ? await fetchEmployeeName(req.firstApproverId) : null;
                const res2 = req.secondApproverId ? await fetchEmployeeName(req.secondApproverId) : null;

                // Robust check: Extract string from object if fetchEmployeeName returns {empName: '...'}
                const getName = (res: any) => {
                    if (!res) return "N/A";
                    if (typeof res === 'string') return res;
                    return res.empName || res.name || res.displayName || "Unknown";
                };

                setApproverNames({
                    l1: getName(res1),
                    l2: getName(res2)
                });
            };
            loadNames();
        }
    }, [isOpen, req, fetchEmployeeName]);

    if (!req || !isOpen) return null;

    const showSecondLevel = !!req.secondApproverId;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Application Details</h2>
                        <p className="text-xs text-slate-500">
                            Leave Applied on {formatDateDisplay(req.createdAt)} {req.id}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex flex-col gap-6">
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
                    {/* Horizontal Approval Workflow */}
                    <div className="py-6 px-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">
                            Approval Workflow
                        </h4>

                        <div className="relative flex justify-between items-start w-full max-w-xl mx-auto">
                            {/* Background Gray Line */}
                            <div className="absolute top-4 left-0 w-full h-1.5 bg-slate-100 rounded-full -z-0" />

                            {/* Active Progress Line (Green) */}
                            <div
                                className="absolute top-4 left-0 h-1.5 bg-emerald-400 rounded-full transition-all duration-500 -z-0"
                                style={{
                                    width: req.status === 'APPROVED' ? '100%' :
                                        req.firstApproverDecision === 'APPROVED' ? '50%' : '0%'
                                }}
                            />

                            {/* Stage: Submission (Always Complete) */}
                            <div className="relative flex flex-col items-center z-10 w-24">
                                <div className="w-9 h-9 rounded-full bg-emerald-400 border-4 border-white shadow-sm flex items-center justify-center text-white">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black text-slate-700 uppercase mt-3">Applied</p>
                                <p className="text-[9px] text-slate-400 font-bold">{formatDateDisplay(req.createdAt)}</p>
                            </div>

                            {/* Stage: Level 1 */}
                            <div className="relative flex flex-col items-center z-10 w-24">
                                <div className={`w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300
                                        ${req.firstApproverDecision === 'APPROVED' ? 'bg-emerald-400 text-white' :
                                        req.firstApproverDecision === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                    {req.firstApproverDecision === 'APPROVED' ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : <span className="text-xs font-bold">L1</span>}
                                </div>
                                <p className="text-[10px] font-black text-slate-700 uppercase mt-3 truncate w-full text-center">{approverNames.l1}</p>
                                <p className={`text-[9px] font-bold uppercase ${req.firstApproverDecision === 'REJECTED' ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {req.firstApproverDecision || 'Pending'}
                                </p>
                            </div>

                            {showSecondLevel && (
                                <div className="relative flex flex-col items-center z-10 w-24">
                                    <div className={`w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300
                                    ${req.secondApproverDecision === 'APPROVED' ? 'bg-emerald-400 text-white' :
                                            req.secondApproverDecision === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                        {req.secondApproverDecision === 'APPROVED' ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        ) : <span className="text-xs font-bold">L2</span>}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase mt-3 truncate w-full text-center">{approverNames.l2}</p>
                                    <p className={`text-[9px] font-bold uppercase ${req.secondApproverDecision === 'REJECTED' ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {req.secondApproverDecision || (req.firstApproverDecision === 'APPROVED' ? 'Waiting' : 'Locked')}
                                    </p>
                                </div>
                            )}

                            {/* Stage: Final Outcome */}
                            <div className="relative flex flex-col items-center z-10 w-24">
                                <div className={`w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300
        ${req.status === 'APPROVED' ? 'bg-emerald-500 text-white ring-4 ring-emerald-50/50' :
                                        req.status === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                    {req.status === 'APPROVED' ? (
                                        <span className="text-[10px] font-black">100%</span>
                                    ) : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>}
                                </div>
                                <p className="text-[10px] font-black text-slate-700 uppercase mt-3">Outcome</p>
                                <p className={`text-[9px] font-bold uppercase ${req.status === 'APPROVED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {req.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reason Section */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Reason for Leave</p>
                        <p className="text-sm text-slate-700 leading-relaxed italic">"{String(req.reason || 'No reason provided')}"</p>
                    </div>

                    {/* Meta Stats */}
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                        <DetailItem label="Year" value={req.year} />
                        <DetailItem label="Comp-Off Used" value={req.compOffUsed} />
                        <DetailItem label="LOP Applied" value={req.lossOfPayApplied} />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t flex gap-3">
                    <button
                        onClick={() => onAction('REJECTED')}
                        className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors uppercase text-xs tracking-widest"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => onAction('APPROVED')}
                        className="flex-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
                    >
                        Approve Request
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, subValue, className = "" }: any) => {
    // Safety check to ensure we only render strings/numbers
    const renderValue = (val: any) => {
        if (val === null || val === undefined) return "N/A";
        if (typeof val === 'object') return val.name || val.label || JSON.stringify(val);
        return String(val);
    };

    return (
        <div className="flex flex-col">
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{label}</p>
            <p className={`text-slate-800 font-bold ${className}`}>{renderValue(value)}</p>
            {subValue && <p className="text-[10px] text-slate-500 font-medium">{renderValue(subValue)}</p>}
        </div>
    );
};

export default DetailedRequestModal;