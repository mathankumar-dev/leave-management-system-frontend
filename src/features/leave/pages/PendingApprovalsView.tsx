import RequestTile from '@/features/leave/components/RequestTile';
import { useLeave } from '@/features/leave/hooks/useLeave';
import { useManagerApprovals } from '@/features/leave/hooks/useManagerApprovals';
import type { LeaveDecision, ManagerAccessDecision } from '@/features/leave/types';
import { notify } from '@/features/notification/utils/notifications';
import api from '@/services/apiClient';
import { useAuth } from '@/shared/auth/useAuth';
import { CommentDialog, CustomLoader, MetricTile } from '@/shared/components';
import { formatDateDisplay } from '@/shared/utils/dateUtils';
import { formatTimeAgo } from '@/shared/utils/formatTimeAgo';
import React, { useEffect, useMemo, useState } from 'react';
import { FaCheckDouble, FaChevronDown, FaDownload, FaFileAlt, FaFileImage, FaSearch, FaTimes } from 'react-icons/fa';



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

    const canSeeDashboardMetrics = true;

    const {
        requests,
        loading,
        handleDecision,
    } = useManagerApprovals(user!.id, user?.role);

    const { weeklyLeaveSummary, teamOnLeave } = useLeave();

    const [searchQuery, setSearchQuery] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [detailModalReq, setDetailModalReq] = useState<any | null>(null);

    useEffect(() => {
        if (user?.id && canSeeDashboardMetrics) {
            // fetchWeeklyLeaveSummary(user.id);
            // fetchTeamOnLeave(user.id);
        }
    }, [user?.id, canSeeDashboardMetrics]);

    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        req: any;
        status: LeaveDecision | null;
    }>({ isOpen: false, req: null, status: null });

    const [selectedAttachment, setSelectedAttachment] = useState<any | null>(null);

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
        setDialogConfig({ isOpen: true, req, status });
    };


    const handleConfirmDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
        let accessDecisionBody: ManagerAccessDecision | undefined = undefined;

        // Handle special Access requests (VPN/Biometric)
        if (req.leaveType === 'VPN' || req.leaveType === 'BIOMETRIC') {
            accessDecisionBody = {
                decision: status,
                remarks: commentText || "Approved", // Default if blank
                managerId: user!.id,
            };
        }

        const result = await handleDecision(
            req.id,
            status,
            commentText || (status === 'APPROVED' ? "Approved" : ""), // Default for leave remarks
            req.leaveType,
            accessDecisionBody
        );

        if (result?.success) {
            notify.leaveAction(status, req.employeeName, !!req.isCompOff, !!req.isOD);
            setDialogConfig({ isOpen: false, req: null, status: null });
        } else {
            notify.error("Update Failed", "Please check your connection and try again.");
        }
    };

console.log(requests);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
            <CustomLoader label="Loading pending approvals" />
        </div>
    );

    function handleDownload(_selectedAttachment: any): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className='flex flex-col gap-4 w-full max-w-full overflow-x-hidden'>

            <DetailedRequestModal
                isOpen={!!detailModalReq}
                req={detailModalReq}
                onClose={() => setDetailModalReq(null)}
                onAction={(status) => {
                    const req = detailModalReq;
                    setDetailModalReq(null);
                    onActionTriggered(req, status);
                }}
            />
            <CommentDialog
                isOpen={dialogConfig.isOpen}
                onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
                title={
                    dialogConfig.status === 'APPROVED' ? 'Approve Request' :
                        dialogConfig.status === 'REJECTED' ? 'Reject Request' : 'Request Meeting'
                }
                placeholder={
                    dialogConfig.status === 'APPROVED'
                        ? `Add an optional approval note for ${dialogConfig.req?.employeeName}...`
                        : dialogConfig.status === 'REJECTED'
                            ? `Provide a reason for rejecting ${dialogConfig.req?.employeeName}'s request...`
                            : `Enter notes regarding the meeting with ${dialogConfig.req?.employeeName}...`
                }
                confirmLabel={
                    dialogConfig.status === 'APPROVED' ? 'Confirm Approval' :
                        dialogConfig.status === 'REJECTED' ? 'Reject' : 'Schedule Discussion'
                }
                // This calls the confirm logic ONLY when the user clicks the button in the dialog
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

                    {canSeeDashboardMetrics && (
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
                        <div key={req.id}
                            onClick={() => setDetailModalReq(req)}
                            className="cursor-pointer transition-transform active:scale-[0.99]">
                            <RequestTile
                                key={req.id}
                                employeeName={req.employeeName}
                                leaveType={req.leaveType}
                                reasonMessage={req.isCompOff ? "Comp-Off Credit Request" : req.reason}
                                dateRange={formatDateRange(req.startDate, req.endDate)}
                                startDate={req.startDate}
                                endDate={req.endDate}
                                startDateHalfDayType={req.startDateHalfDayType || req.halfDayType}
                                endDateHalfDayType={req.endDateHalfDayType}
                                days={req.days}
                                createdAt={formatTimeAgo(req.createdAt)}
                                onAccept={() => onActionTriggered(req, 'APPROVED')}
                                onReject={() => onActionTriggered(req, 'REJECTED')}
                                attachments={req.attachments}
                                onViewAttachment={(attachment) => setSelectedAttachment(attachment)}
                            />
                        </div>

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

            {selectedAttachment && (
                <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
                    {/* Animated Glass Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setSelectedAttachment(null)}
                    />

                    <div className="relative max-w-5xl w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 transform transition-all scale-100">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <FaFileImage size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-none">{selectedAttachment.fileName}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Leave Application Attachment</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownload(selectedAttachment)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all shadow-md active:scale-95"
                                >
                                    <FaDownload size={14} />
                                    Download
                                </button>
                                <button
                                    onClick={() => setSelectedAttachment(null)}
                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex justify-center items-center bg-linear-to-b from-slate-50 to-slate-100 min-h-100 max-h-[80vh] overflow-auto">
                            {selectedAttachment.fileType.includes('image') ? (
                                <div className="relative group">
                                    <AuthenticatedImage
                                        fileUrl={selectedAttachment.fileUrl}
                                        className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-[1.01]"
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm">
                                    <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaFileAlt size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">Document Preview</h4>
                                    <p className="text-slate-500 text-sm mb-6">We can't preview this file type directly, but you can download it to view.</p>
                                    <button
                                        onClick={() => handleDownload(selectedAttachment)}
                                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                                    >
                                        Download File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>



    );


}

export default PendingApprovalsView;

const DetailedRequestModal: React.FC<{
    req: any;
    isOpen: boolean;
    onClose: () => void;
    onAction: (status: 'APPROVED' | 'REJECTED') => void;
}> = ({ req, isOpen, onClose, onAction }) => {
    if (!req || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Application Details</h2>
                        <p className="text-xs text-slate-500">
                            Leave ID: #{req.id} • Applied on {formatDateDisplay(req.createdAt)}
                        </p>                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />                    <DetailItem label="Approval Status" value={req.currentApprovalLevel.replace('_', ' ')} className="text-amber-600" />

                    <div className="col-span-full p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Reason for Leave</p>
                        <p className="text-sm text-slate-700 leading-relaxed italic">"{req.reason || 'No reason provided'}"</p>
                    </div>

                    <div className="col-span-full grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
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

const DetailItem = ({ label, value, subValue, className = "" }: any) => (
    <div className="flex flex-col">
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{label}</p>
        <p className={`text-slate-800 font-bold ${className}`}>{value}</p>
        {subValue && <p className="text-[10px] text-slate-500 font-medium">{subValue}</p>}
    </div>
);

interface AuthenticatedImageProps {
    fileUrl: string;
    className?: string;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({ fileUrl, className }) => {
    const [imgSrc, setImgSrc] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/documents/view/${encodeURIComponent(fileUrl)}`, {
                    responseType: "blob",
                });

                // Convert the raw data into a local URL the browser can display
                const url = URL.createObjectURL(response.data);
                setImgSrc(url);
            } catch (error) {
                console.error("Error fetching image:", error);
                setImgSrc("https://via.placeholder.com/300?text=Error+Loading+Image");
            } finally {
                setLoading(false);
            }
        };

        if (fileUrl) fetchImage();

        // Cleanup the URL when component unmounts to save memory
        return () => {
            if (imgSrc) URL.revokeObjectURL(imgSrc);
        };
    }, [fileUrl]);

    if (loading) return <div className="p-10 animate-pulse bg-slate-200 rounded-lg">Loading secure image...</div>;

    return <img src={imgSrc} alt="Attachment" className={className} />;
};

// export default AuthenticatedImage;