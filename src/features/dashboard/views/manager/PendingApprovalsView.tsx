import React, { useState, useMemo, useEffect } from 'react';
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

interface PendingRequest {
    id: number;
    employeeName: string;
    leaveType: string;
    reason?: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    isCompOff?: boolean;
    halfDayType?: string;
}
const PendingApprovalsView: React.FC = () => {
    const { user } = useAuth();

    const {
        requests,
        loading,
        handleDecision,
        handleCompOffApprove,
        handleCompOffReject
    } = useManagerApprovals(user?.id || 0);

    const { fetchWeeklyLeaveSummary, weeklyLeaveSummary, fetchTeamOnLeave, teamOnLeave } = useDashboard();

    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");

    const isManager = user?.role?.toUpperCase() === 'MANAGER';

    useEffect(() => {
        if (user?.id && isManager) {
            fetchWeeklyLeaveSummary(user.id);
            fetchTeamOnLeave(user.id);
        }
    }, [fetchWeeklyLeaveSummary, fetchTeamOnLeave, user?.id, isManager]);

    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        req: any;
        status: LeaveDecision | null;
    }>({ isOpen: false, req: null, status: null });

    const formatDateRange = (start: string, end: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
        const startDate = new Date(start).toLocaleDateString('en-US', options);
        const endDate = new Date(end).toLocaleDateString('en-US', options);
        return start === end ? startDate : `${startDate} - ${endDate}`;
    };

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

    const onActionTriggered = (req: PendingRequest, status: LeaveDecision) => {
        if (status === 'REJECTED' || status === 'MEETING_REQUIRED') {
            setDialogConfig({ isOpen: true, req, status });
            return;
        }
        handleConfirmDecision(req, status);
    };

    const handleConfirmDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
        let result;
        if (req.isCompOff) {
            if (status === 'APPROVED') {
                result = await handleCompOffApprove(req.id);
            } else if (status === 'REJECTED') {
                result = await handleCompOffReject(req.id, commentText || "");
            }
        } else {
            const decisionPayload: LeaveDecisionRequest = {
                leaveId: req.id,
                managerId: Number(user?.id),
                decision: status,
                comments: commentText
            };
            result = await handleDecision(decisionPayload);
        }

        if (result?.success) {
            notify.leaveAction(status, req.employeeName, !!req.isCompOff);

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
        <div className='flex flex-col gap-4 w-full max-w-full overflow-x-hidden'>
            <CommentDialog
                isOpen={dialogConfig.isOpen}
                onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
                title={dialogConfig.status === 'REJECTED' ? 'Reject Request' : 'Request Meeting'}
                placeholder={
                    dialogConfig.status === 'REJECTED'
                        ? `Provide a reason for rejecting ${dialogConfig.req?.employeeName}'s request...`
                        : `Enter notes regarding the meeting with ${dialogConfig.req?.employeeName}...`
                }
                confirmLabel={dialogConfig.status === 'REJECTED' ? 'Reject' : 'Schedule Discussion'}
                onSubmit={(comment) => handleConfirmDecision(dialogConfig.req, dialogConfig.status!, comment)}
            />

            <div className='py-6 w-full bg-[#F1F5F9] px-4 md:px-8 rounded-sm border border-slate-200 shadow-sm'>
                <div className='grid grid-cols-2 md:flex md:flex-row md:justify-between items-center gap-y-8 gap-x-4'>

                    <div className='flex justify-start md:justify-center'>
                        <MetricTile
                            value={requests.length.toString().padStart(2, '0')}
                            firstLabel="Pending"
                            secondLabel="Approvals"
                        />
                    </div>

                    {isManager && (
                        <>
                            <div className="hidden md:block h-12 w-px bg-slate-300" />
                            <div className='flex justify-start md:justify-center'>
                                <MetricTile
                                    value={(teamOnLeave?.length || 0).toString().padStart(2, '0')}
                                    firstLabel="Members"
                                    secondLabel="out Today"
                                />
                            </div>

                            <div className="hidden md:block h-12 w-px bg-slate-300" />

                            <div className='col-span-2 md:col-span-1 flex justify-center md:justify-end border-t border-slate-200 pt-6 md:border-none md:pt-0'>
                                <MetricTile
                                    value={(weeklyLeaveSummary?.length || 0).toString().padStart(2, '0')}
                                    firstLabel="Weekly Absence"
                                    secondLabel="Summary"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-center w-full">
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search employee or leave type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F9] border border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div className="relative w-full md:w-48 group">
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none cursor-pointer transition-all shadow-sm"
                    >
                        <option value="all">All Requests</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <FaChevronDown size={12} />
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-3 bg-[#F1F5F9] py-4 px-2 md:px-4 rounded-sm border border-slate-200'>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <RequestTile
                            key={req.id}
                            employeeName={req.employeeName}
                            leaveType={req.leaveType}
                            reasonMessage={req.isCompOff ? "Comp-Off Credit Request" : req.reason}
                            dateRange={formatDateRange(req.startDate, req.endDate)}
                            startDate={req.startDate}
                            endDate={req.endDate}
                            halfDayType={req.halfDayType}
                            createdAt={formatTimeAgo(req.createdAt)}
                            onAccept={() => onActionTriggered(req, 'APPROVED')}
                            onReject={() => onActionTriggered(req, 'REJECTED')}
                            onDiscuss={!req.isCompOff ? () => onActionTriggered(req, 'MEETING_REQUIRED') : undefined}
                        />
                    ))
                ) : (
                    <div className="py-16 bg-white rounded-sm border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
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