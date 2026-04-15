// ... imports remains the same ...

import { useEmployee } from "@/features/employee/hooks/useEmployee";
import { LeaveRequestDetails } from "@/features/leave/components/LeaveRequestDetails";
import { useLeave } from "@/features/leave/hooks/useLeave";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

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
    const [approverNames, setApproverNames] = useState({ l1: "...", l2: "..." });

    useEffect(() => {
        const loadInitialData = async () => {
            if (!isOpen) return;

            setLoading(true);
            try {
                let currentReq = initialReq;
                let remarks: any[] = [];
                let attachments: any[] = [];

                // 1. Fetch data if only leaveId is provided or if initialReq is missing details
                if (leaveId) {
                    const response = await fetchLeaveApplicationById(leaveId);
                    // Use the DTO for the main request data
                    currentReq = response?.leaveApplicationResponseDTO || response;
                    // Extract arrays from the root of the response
                    remarks = response?.remarks || [];
                    attachments = response?.attachments || [];
                } else if (initialReq) {
                    // If initialReq was passed, try to grab attachments/remarks if they exist there
                    remarks = initialReq.remarks || [];
                    attachments = initialReq.attachments || [];
                }

                if (currentReq) {
                    const getName = (res: any) => {
                        if (!res) return "N/A";
                        return typeof res === 'string' ? res : (res.empName || res.name || "Unknown");
                    };

                    // 2. Resolve Names
                    const [empRes, res1, res2] = await Promise.all([
                        currentReq.employeeId ? fetchEmployeeName(currentReq.employeeId) : null,
                        currentReq.firstApproverId ? fetchEmployeeName(currentReq.firstApproverId) : null,
                        currentReq.secondApproverId ? fetchEmployeeName(currentReq.secondApproverId) : null,
                    ]);

                    // 3. Match Remarks
                    const l1RemarkObj = remarks.find(r => r.approverId === currentReq.firstApproverId);
                    const l2RemarkObj = remarks.find(r => r.approverId === currentReq.secondApproverId);

                    const l1Name = getName(res1);
                    const l2Name = getName(res2);

                    setApproverNames({ l1: l1Name, l2: l2Name });

                    // 4. Merge all data into the req state
                    setReq({
                        ...currentReq,
                        employeeName: getName(empRes),
                        // Correctly mapping the attachments array here
                        attachments: attachments,
                        // First Approver
                        firstApproverComment: l1RemarkObj?.comment || "",
                        firstApproverDate: l1RemarkObj?.decisionDate || null,
                        // Second Approver
                        secondApproverComment: l2RemarkObj?.comment || "",
                        secondApproverDate: l2RemarkObj?.decisionDate || null
                    });
                }
            } catch (error) {
                console.error("Failed to load leave details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [isOpen, initialReq, leaveId, fetchLeaveApplicationById, fetchEmployeeName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">
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
                            <p className="text-xs font-bold tracking-widest">Loading Details...</p>
                        </div>
                    ) : req ? (
                        <LeaveRequestDetails
                            req={req}
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