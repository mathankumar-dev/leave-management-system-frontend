import { useEmployee } from "@/features/employee/hooks/useEmployee";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { LeaveRequestDetails } from "./LeaveRequestDetails";

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

                const getName = (res: any) => {
                    if (!res) return "N/A";
                    return typeof res === 'string' ? res : (res.empName || res.name || "Unknown");
                };

                setApproverNames({ l1: getName(res1), l2: getName(res2) });
            };
            loadNames();
        }
    }, [isOpen, req, fetchEmployeeName]);

    if (!req || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-black text-slate-800 uppercase">Application Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FaTimes size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <LeaveRequestDetails req={req} approverNames={approverNames} />
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t flex gap-3">
                    <button onClick={() => onAction('REJECTED')} className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 uppercase text-xs">Reject</button>
                    <button onClick={() => onAction('APPROVED')} className="flex-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg uppercase text-xs">Approve Request</button>
                </div>
            </div>
        </div>
    );
};

export default DetailedRequestModal;