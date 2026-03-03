import React, { useState, useMemo, useEffect } from 'react';
import Divider from '../../../../components/ui/Divider';
import MetricTile from '../../components/tiles/MetricTile';
import RequestTile from '../../components/tiles/RequestTile';
import { useManagerApprovals } from '../../hooks/manager/useManagerApprovals';
import CustomLoader from '../../../../components/ui/CustomLoader';
import { useAuth } from '../../../auth/hooks/useAuth';
import { FaCheckDouble, FaChevronDown, FaSearch } from 'react-icons/fa';
import type { LeaveDecision, LeaveDecisionRequest } from '../../types';
import { notify } from '../../../../utils/notifications';
import CommentDialog from '../../../../components/ui/CommentDialog';
import { formatTimeAgo } from '../../../../utils/formatTimeAgo';
import { useDashboard } from '../../hooks/useDashboard';

const PendingApprovalsView: React.FC = () => {
    const { user } = useAuth();
    const { requests, loading, handleDecision } = useManagerApprovals(user?.id || 0);

    const { fetchWeeklyLeaveSummary, weeklyLeaveSummary, fetchTeamOnLeave, teamOnLeave } = useDashboard();

    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");

    useEffect(() => {
        if (user?.id) {
            fetchWeeklyLeaveSummary(user.id);
            fetchTeamOnLeave(user.id);
        }
    }, [fetchWeeklyLeaveSummary, fetchTeamOnLeave, user?.id]);

    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        req: any;
        status: LeaveDecision | null;
    }>({ isOpen: false, req: null, status: null });

    // Filter Logic
    const filteredRequests = useMemo(() => {
        return requests.filter((req) => {
            const matchesSearch =
                req.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.leaveType?.toLowerCase().includes(searchQuery.toLowerCase());

            const createdDate = new Date(req.createdAt);
            const now = new Date();
            let matchesTime = true;

            if (timeFilter === 'today') {
                matchesTime = createdDate.toDateString() === now.toDateString();
            } else if (timeFilter === 'week') {
                const oneWeekAgo = new Date().setDate(now.getDate() - 7);
                matchesTime = createdDate.getTime() >= oneWeekAgo;
            } else if (timeFilter === 'month') {
                matchesTime = createdDate.getMonth() === now.getMonth() &&
                    createdDate.getFullYear() === now.getFullYear();
            }

            return matchesSearch && matchesTime;
        });
    }, [requests, searchQuery, timeFilter]);

    const onActionTriggered = (req: any, status: LeaveDecision) => {
        if (status === 'REJECTED' || status === 'MEETING_REQUIRED') {
            setDialogConfig({ isOpen: true, req, status });
            return;
        }
        handleConfirmDecision(req, status);
    };

    const handleConfirmDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
        const decisionPayload: LeaveDecisionRequest = {
            leaveId: req.id,
            managerId: Number(user?.id),
            decision: status,
            comments: commentText
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
            <div className='min-h-20 py-4 w-full flex justify-between items-center bg-[#F1F5F9] px-6 rounded-lg border border-slate-200'>
                <MetricTile value={requests.length.toString().padStart(2, '0')} firstLabel="Pending" secondLabel="Approvals" />
                <Divider />
                <MetricTile value={(teamOnLeave?.length || 0).toString().padStart(2, '0')} firstLabel="Members" secondLabel="out Today" />
                <Divider />
                <MetricTile value={(weeklyLeaveSummary?.length || 0).toString().padStart(2, '0')} firstLabel="Weekly Absence" secondLabel="Summary" />
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center">
                {/* Search Box */}
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search employee or leave type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div className="relative w-full md:w-48 group">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none cursor-pointer transition-all shadow-sm"
                    >
                        <option value="all">All Requests</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <FaChevronDown size={12} />
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className='flex flex-col gap-3 bg-[#F1F5F9] py-4 px-4 rounded-lg border border-slate-200'>
                <div className="flex items-center gap-2 mb-2 ml-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        Action Required ({filteredRequests.length})
                    </h3>
                </div>

                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <RequestTile
                            key={req.id}
                            employeeName={req.employeeName || `Employee #${req.employeeId}`}
                            leaveType={req.leaveType}
                            reasonMessage={req.reason || "No reason provided"}
                            dateRange={
                                req.startDate === req.endDate
                                    ? req.startDate
                                    : `${req.startDate} - ${req.endDate}`
                            }
                            createdAt={formatTimeAgo(req.createdAt)}
                            onAccept={() => onActionTriggered(req, 'APPROVED')}
                            onReject={() => onActionTriggered(req, 'REJECTED')}
                            onDiscuss={() => onActionTriggered(req, 'MEETING_REQUIRED')}
                        />
                    ))
                ) : (
                    <div className="py-16 bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <FaCheckDouble className="mb-3 opacity-20 text-4xl" />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                            {searchQuery ? "No matches found" : "Everything Caught Up"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PendingApprovalsView;