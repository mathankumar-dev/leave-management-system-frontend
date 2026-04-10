import React, { useEffect, useState } from "react";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { useLeave } from "@/features/leave/hooks/useLeave";
import { FaTimes } from "react-icons/fa";
import { LeaveRequestDetails } from "./LeaveRequestDetails";

const DetailedRequestModal: React.FC<{
    req?: any; 
    isOpen: boolean;
    leaveId?: number; 
    onClose: () => void;
    onAction: (status: 'APPROVED' | 'REJECTED') => void;
}> = ({ req: initialReq, isOpen, leaveId, onClose, onAction }) => {
    const { fetchEmployeeName } = useEmployee();
    const { fetchLeaveApplicationById } = useLeave();

    const [req, setReq] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [resolvedEmployeeName, setResolvedEmployeeName] = useState("...");
    const [approverNames, setApproverNames] = useState({ l1: "...", l2: "..." });
    
    // State to hold comments matched from the remarks array
    const [comments, setComments] = useState({ l1: "", l2: "" });

    useEffect(() => {
        const loadInitialData = async () => {
            if (!isOpen) return;

            setLoading(true);
            try {
                let currentReq = initialReq;
                let remarks: any[] = [];

                // 1. Fetch data if only leaveId is provided
                if (!currentReq && leaveId) {
                    const response = await fetchLeaveApplicationById(leaveId);
                    // Extract the main DTO
                    currentReq = response?.leaveApplicationResponseDTO || response;
                    // Extract remarks array for comment matching
                    remarks = response?.remarks || [];
                    console.log(remarks);
                    
                }

                setReq(currentReq);

                if (currentReq) {
                    const getName = (res: any) => {
                        if (!res) return "N/A";
                        return typeof res === 'string' ? res : (res.empName || res.name || "Unknown");
                    };

                    // 2. Resolve Names and Match Comments
                    const [empRes, res1, res2] = await Promise.all([
                        currentReq.employeeId ? fetchEmployeeName(currentReq.employeeId) : null,
                        currentReq.firstApproverId ? fetchEmployeeName(currentReq.firstApproverId) : null,
                        currentReq.secondApproverId ? fetchEmployeeName(currentReq.secondApproverId) : null,
                    ]);

                    // Matching logic: Find comment in remarks where approverId matches the DTO's approver IDs
                    const l1Remark = remarks.find(r => r.approverId === currentReq.firstApproverId);
                    const l2Remark = remarks.find(r => r.approverId === currentReq.secondApproverId);

                    setResolvedEmployeeName(getName(empRes));
                    setApproverNames({ 
                        l1: getName(res1), 
                        l2: getName(res2) 
                    });
                    setComments({
                        l1: l1Remark?.comment || "",
                        l2: l2Remark?.comment || ""
                    });

                    console.log(comments);
                    
                }
            } catch (error) {
                console.error("Failed to load leave details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [isOpen, initialReq, leaveId, fetchLeaveApplicationById, fetchEmployeeName]);

    useEffect(() => {
        if (!isOpen) {
            setReq(null);
            setResolvedEmployeeName("...");
            setApproverNames({ l1: "...", l2: "..." });
            setComments({ l1: "", l2: "" });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-black text-slate-800  tracking-tight">
                        Application Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto min-h-75 flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold  tracking-widest">Loading Details...</p>
                        </div>
                    ) : req ? (
                        <LeaveRequestDetails 
                            req={{ 
                                ...req, 
                                employeeName: resolvedEmployeeName,
                                firstApproverComment: comments.l1,
                                secondApproverComment: comments.l2
                            }} 
                            approverNames={approverNames} 
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                            No request data found.
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t flex gap-3">
                    <button 
                        disabled={loading || !req}
                        onClick={() => onAction('REJECTED')} 
                        className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 uppercase text-xs disabled:opacity-50"
                    >
                        Reject
                    </button>
                    <button 
                        disabled={loading || !req}
                        onClick={() => onAction('APPROVED')} 
                        className="flex-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg uppercase text-xs disabled:opacity-50 transition-all active:scale-95"
                    >
                        Approve Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailedRequestModal;