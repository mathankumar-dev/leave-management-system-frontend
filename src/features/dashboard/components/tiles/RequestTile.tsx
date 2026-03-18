import React from 'react'
import Divider from '../../../../components/ui/Divider'
import { HiDotsCircleHorizontal } from 'react-icons/hi'
import CTAButton from '../../../../components/ui/CTAButton'

export interface RequestTileProps {
    employeeName: string;
    leaveType: string;
    dateRange: string;
    startDate: string;
    endDate: string;
    // Updated to handle multiple types from the backend
    startDateHalfDayType?: "FIRST_HALF" | "SECOND_HALF" | string | null;
    endDateHalfDayType?: "FIRST_HALF" | "SECOND_HALF" | string | null;
    reasonMessage: string;
    days: number; // Use this as the source of truth
    createdAt: string;
    onAccept: () => void;
    onReject: () => void;
    onDiscuss?: () => void;
}

const RequestTile: React.FC<RequestTileProps> = ({
    employeeName,
    leaveType,
    dateRange,
    startDate,
    endDate,
    startDateHalfDayType,
    endDateHalfDayType,
    reasonMessage,
    days,
    createdAt,
    onAccept,
    onReject,
    onDiscuss,
}) => {

    const getHalfDayLabel = (type?: string | null) => {
        if (type === "FIRST_HALF") return "Morning";
        if (type === "SECOND_HALF") return "Evening";
        return null;
    };

    const getDurationInfo = () => {
        // 1. Logic for Single Day Half Day
        if (days === 0.5) {
            // Check which type is available
            const session = getHalfDayLabel(startDateHalfDayType || endDateHalfDayType);
            return {
                count: '0.5 Days',
                session: session
            };
        }

        // 2. Logic for Full Days (1 or more)
        const isMultiDayPartial = getHalfDayLabel(startDateHalfDayType) || getHalfDayLabel(endDateHalfDayType);

        return {
            count: days === 1 ? '1 Day' : `${days} Days`,
            // If it's a multi-day (e.g. 1.5), we can show "Partial" or specific sessions
            session: isMultiDayPartial ? "Partial Days" : null
        };
    };

    const duration = getDurationInfo();

    return (
        <div className='bg-white w-full rounded-sm flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 md:gap-4 border border-slate-100 shadow-sm hover:border-slate-300 transition-all'>

            {/* 1. Identity Section */}
            <div className='flex items-start gap-3 min-w-fit'>
                <HiDotsCircleHorizontal size={35} className="text-slate-300 shrink-0 mt-0.5" />
                <div className='flex flex-col'>
                    <span className='uppercase font-black text-[11px] md:text-xs tracking-wider text-slate-700 leading-tight'>
                        {employeeName}
                    </span>
                    <div className='flex items-center gap-2 mt-0.5'>
                        <span className='text-indigo-600 font-bold text-[10px] uppercase tracking-tighter'>
                            {leaveType}
                        </span>
                        <span className='md:hidden text-amber-500 text-[10px] font-bold'>
                            • {duration.count} {duration.session && `(${duration.session})`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden md:block"><Divider /></div>

            {/* 2. Desktop Date & Days Section */}
            <div className='hidden md:flex flex-col items-center min-w-35 px-2 text-center'>
                <span className='text-[11px] font-bold text-slate-600'>{dateRange}</span>
                <div className='flex flex-col items-center mt-0.5'>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${days % 1 !== 0 ? 'text-amber-500' : 'text-indigo-400'}`}>
                        {duration.count}
                    </span>
                    {duration.session && (
                        <span className='text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded-full uppercase mt-0.5 border border-amber-100'>
                            {duration.session}
                        </span>
                    )}
                </div>
            </div>

            {leaveType !== "COMP_OFF" && (
                <>
                    <div className="hidden md:block">
                        <Divider />
                    </div>

                    {/* Reason Message */}
                    <div className='flex-1 min-w-0'>
                        <p className='text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed   md:not- '>
                            <span className='font-bold text-slate-400 mr-1 md:hidden uppercase text-[9px] not- '>
                                Reason:
                            </span>
                            "{reasonMessage}"
                        </p>
                    </div>
                </>
            )}

            <div className="hidden md:block"><Divider /></div>

            {/* 4. Actions Section */}
            <div className='flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0'>
                <div className='flex flex-1 md:flex-none gap-2'>
                    <CTAButton
                        label='Accept'
                        className="flex-1 md:px-5 bg-green-600 hover:bg-green-700 text-[10px] uppercase font-bold h-9 rounded-sm shadow-sm"
                        onClick={onAccept}
                    />
                    <CTAButton
                        label='Reject'
                        labelColor='text-red-500'
                        isOutlineOnly
                        className='flex-1 md:px-5 border-red-200! hover:bg-red-50 text-[10px] uppercase font-bold h-9 rounded-sm'
                        onClick={onReject}
                    />
                </div>

                {onDiscuss && (
                    <CTAButton
                        label='Discuss'
                        isOutlineOnly
                        className='flex-1 md:flex-none md:px-5 border-slate-200! text-slate-500! hover:bg-slate-50 text-[10px] uppercase font-bold h-9 rounded-sm'
                        onClick={onDiscuss}
                    />
                )}
            </div>

            {/* 5. Timestamp Footer */}
            <div className='flex justify-between items-center md:flex-col md:justify-center border-t border-slate-50 md:border-none pt-2 md:pt-0'>
                <span className='md:hidden text-[9px] font-bold text-slate-300 uppercase'>Requested</span>
                <span className='text-slate-400 text-[9px] md:text-[10px] font-medium whitespace-nowrap  '>
                    {createdAt}
                </span>
            </div>
        </div>
    )
}

export default RequestTile;