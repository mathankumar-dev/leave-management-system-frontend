import React, { useEffect, useState } from "react";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { formatDateDisplay } from "@/shared/utils/dateUtils";
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
                    <div className="py-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            Approval Workflow
                        </h4>

                        <div className="relative flex justify-between items-start w-full">
                            {/* The Connecting Line */}
                            <div className="absolute top-1.75 left-0 w-full h-0.5 bg-slate-100 -z-0" />

                            {/* Level 1 */}
                            <div className="relative flex flex-col items-start bg-white pr-4 z-10">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors 
                                    ${req.firstApproverDecision === 'APPROVED' ? 'bg-emerald-500' : req.firstApproverDecision === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-300'}`}
                                />
                                <p className="text-[10px] font-black text-slate-700 uppercase mt-2">L1: {approverNames.l1}</p>
                                <p className="text-[9px] text-slate-500">
                                    {String(req.firstApproverDecision || 'Awaiting Action')}
                                </p>
                            </div>

                            {/* Level 2 (Optional) */}
                            {showSecondLevel && (
                                <div className="relative flex flex-col items-center bg-white px-4 z-10">
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors 
                                        ${req.secondApproverDecision === 'APPROVED' ? 'bg-emerald-500' : req.secondApproverDecision === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-300'}`}
                                    />
                                    <p className="text-[10px] font-black text-slate-700 uppercase mt-2 text-center">L2: {approverNames.l2}</p>
                                    <p className="text-[9px] text-slate-500 text-center">
                                        {req.secondApproverDecision
                                            ? String(req.secondApproverDecision)
                                            : (req.firstApproverDecision === 'APPROVED' ? 'Secondary Review' : 'Pending L1')}
                                    </p>
                                </div>
                            )}

                            {/* Final Status */}
                            <div className="relative flex flex-col items-end bg-white pl-4 z-10 text-right">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm 
                                    ${req.status === 'APPROVED' ? 'bg-emerald-600' : req.status === 'REJECTED' ? 'bg-rose-600' : 'bg-slate-300'}`}
                                />
                                <p className="text-[10px] font-black text-slate-700 uppercase mt-2">Final Outcome</p>
                                <p className="text-[9px] text-slate-500 font-bold">{String(req.status)}</p>
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