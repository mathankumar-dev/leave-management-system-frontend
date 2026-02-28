import React, { useState } from 'react';
import Divider from '../../../../components/ui/Divider';
import MetricTile from '../../components/tiles/MetricTile';
import RequestTile from '../../components/tiles/RequestTile';
import { useManagerApprovals } from '../../hooks/manager/useManagerApprovals';
import CustomLoader from '../../../../components/ui/CustomLoader';
import { useAuth } from '../../../auth/hooks/useAuth';
import { FaCheckDouble } from 'react-icons/fa';
import type { LeaveDecision, LeaveDecisionRequest } from '../../types';
import { notify } from '../../../../utils/notifications';
import CommentDialog from '../../../../components/ui/CommentDialog';
import { formatTimeAgo } from '../../../../utils/formatTimeAgo';

const PendingApprovalsView: React.FC = () => {
    const { user } = useAuth();
    const { requests, loading, handleDecision } = useManagerApprovals(user?.id || 0);

    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        req: any;
        status: LeaveDecision | null;
    }>({ isOpen: false, req: null, status: null });

    console.log("Printing reqs");

    requests.forEach((r) => {
        console.log(r);
    })

    const onActionTriggered = (req: any, status: LeaveDecision) => {
        if (status === 'REJECTED' || status === 'MEETING_REQUIRED') {
            setDialogConfig({
                isOpen: true,
                req,
                status
            });
            return;
        }

        // If it's an approval, process immediately
        handleConfirmDecision(req, status);
    };

    /**
     * Step 2: Final submission to the service
     */
    const handleConfirmDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
        const decisionPayload: LeaveDecisionRequest = {
            leaveId: req.id,
            managerId: Number(user?.id),
            decision: status,
            comments: commentText // This is now safely typed
        };

        const result = await handleDecision(decisionPayload);

        if (result?.success) {
            notify.leaveAction(status, req.employeeName);
            setDialogConfig({ isOpen: false, req: null, status: null });
        } else {
            notify.error("Update Failed", "Please check your connection and try again.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
            <CustomLoader label="Loading pending approvals" />
        </div>
    );

    return (
        <div className='flex flex-col gap-4'>
            <CommentDialog
                isOpen={dialogConfig.isOpen}
                onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
                title={dialogConfig.status === 'REJECTED' ? 'Reject Leave Request' : 'Request Meeting'}
                placeholder={
                    dialogConfig.status === 'REJECTED'
                        ? `Provide a reason for rejecting ${dialogConfig.req?.employeeName}'s leave...`
                        : `Enter notes regarding the meeting with ${dialogConfig.req?.employeeName}...`
                }
                confirmLabel={dialogConfig.status === 'REJECTED' ? 'Reject Request' : 'Schedule Discussion'}
                onSubmit={(comment) => handleConfirmDecision(dialogConfig.req, dialogConfig.status!, comment)}
            />

            {/* Header Stats Section */}
            <div className='min-h-20 py-4 w-full flex justify-between items-center bg-[#F1F5F9] px-6 rounded-lg border border-slate-200'>
                <MetricTile value={requests.length.toString().padStart(2, '0')} firstLabel="Pending" secondLabel="Approvals" />
                <Divider />
                <MetricTile value={"--"} firstLabel="Members" secondLabel="out Today" />
                <Divider />
                <MetricTile value={"--"} firstLabel="Weekly Absence" secondLabel="Summary" />
            </div>

            {/* List Section */}
            <div className='flex flex-col gap-3 bg-[#F1F5F9] py-4 px-4 rounded-lg border border-slate-200'>
                <div className="flex items-center gap-2 mb-2 ml-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        Action Required ({requests.length})
                    </h3>
                </div>

                {requests.length > 0 ? (
                    requests.map((req) => (
                        <RequestTile
                            key={req.id}
                            // Explicitly map the fields that differ from the API object
                            employeeName={req.employeeName || `Employee #${req.employeeId}`}
                            leaveType={req.leaveType}
                            reasonMessage={req.reason || "No reason provided"}
                            dateRange={
                                req.startDate === req.endDate
                                    ? req.startDate
                                    : `${req.startDate} - ${req.endDate}`
                            }
                            createdAt={formatTimeAgo(req.createdAt)}
                            // Handlers
                            onAccept={() => onActionTriggered(req, 'APPROVED')}
                            onReject={() => onActionTriggered(req, 'REJECTED')}
                            onDiscuss={() => onActionTriggered(req, 'MEETING_REQUIRED')}
                        />
                    ))
                ) : (
                    <div className="py-16 bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <FaCheckDouble className="mb-3 opacity-20 text-4xl" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Everything Caught Up</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PendingApprovalsView;