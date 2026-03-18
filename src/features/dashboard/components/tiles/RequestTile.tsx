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
    startDateHalfDayType?: "FIRST_HALF" | "SECOND_HALF" | string | null;
    endDateHalfDayType?: "FIRST_HALF" | "SECOND_HALF" | string | null;
    reasonMessage: string;
    days: number; 
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
        const dayCount = days ?? 0;

        if (dayCount === 0.5) {
            const session = getHalfDayLabel(startDateHalfDayType || endDateHalfDayType);
            return {
                count: '0.5 Days',
                session: session
            };
        }

        const isMultiDayPartial = getHalfDayLabel(startDateHalfDayType) || getHalfDayLabel(endDateHalfDayType);

        return {
            count: dayCount === 1 ? '1 Day' : `${dayCount} Days`,
            session: isMultiDayPartial ? "Partial Days" : null
        };
    };

    const duration = getDurationInfo();
    const isOnDuty = leaveType === "ON_DUTY";

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
                            {leaveType.replace('_', ' ')}
                        </span>
                        
                        {/* MOBILE VIEW: Only show count if NOT On Duty */}
                        {!isOnDuty && (
                            <span className='md:hidden text-amber-500 text-[10px] font-bold'>
                                • {duration.count} {duration.session && `(${duration.session})`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden md:block"><Divider /></div>

            {/* 2. Desktop Date & Days Section */}
            <div className='hidden md:flex flex-col items-center min-w-35 px-2 text-center'>
                <span className='text-[11px] font-bold text-slate-600'>{dateRange}</span>
                
                {/* DESKTOP: Only show count and session if NOT On Duty */}
                {!isOnDuty ? (
                    <div className='flex flex-col items-center mt-0.5'>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                            days % 1 !== 0 ? 'text-amber-500' : 'text-indigo-400'
                        }`}>
                            {duration.count}
                        </span>
                        {duration.session && (
                            <span className='text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded-full uppercase mt-0.5 border border-amber-100'>
                                {duration.session}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className='mt-0.5'>
                        <span className='text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded-full uppercase border border-blue-100'>
                            Duty
                        </span>
                    </div>
                )}
            </div>

            {/* 3. Reason Section */}
            {leaveType !== "COMP_OFF" ? (
                <>
                    <div className="hidden md:block">
                        <Divider />
                    </div>

                    <div className='flex-1 min-w-0'>
                        <p className='text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed'>
                            <span className='font-bold text-slate-400 mr-1 md:hidden uppercase text-[9px]'>
                                Reason:
                            </span>
                            "{reasonMessage}"
                        </p>
                        {isOnDuty && (
                            <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-100 mt-1 inline-block">
                                Official Assignment
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <div className='flex-1 flex items-center justify-center'>
                    <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                        Compensatory Off Request
                    </span>
                </div>
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
                <span className='text-slate-400 text-[9px] md:text-[10px] font-medium whitespace-nowrap'>
                    {createdAt}
                </span>
            </div>
        </div>
    )
}

export default RequestTile;