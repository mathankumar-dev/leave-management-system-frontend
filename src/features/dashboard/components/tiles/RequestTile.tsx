import React from 'react'
import Divider from '../../../../components/ui/Divider'
import { HiDotsCircleHorizontal } from 'react-icons/hi'
import CTAButton from '../../../../components/ui/CTAButton'

export interface RequestTileProps {
    employeeName: string;
    leaveType: string;
    dateRange: string;
    reasonMessage: string;
    createdAt : string;
    onClick?: () => void;
    onAccept: () => void;
    onReject: () => void;
    onDiscuss: () => void;
}

const RequestTile: React.FC<RequestTileProps> = ({
    employeeName,
    leaveType,
    dateRange,
    reasonMessage,
    createdAt,
    onAccept,
    onReject,
    onDiscuss,
}) => {
    return (
        <div className='bg-blue-50 w-full rounded flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 shadow'>
            
            {/* 1. Header Section: Identity & Avatar */}
            <div className='flex items-center gap-3 min-w-fit'>
                <HiDotsCircleHorizontal size={40} className="text-gray-400 shrink-0" />
                <div className='flex flex-col'>
                    <span className='uppercase font-bold text-sm tracking-tight'>{employeeName}</span>
                    <span className='text-gray-500 text-xs'>{leaveType}</span>
                </div>
            </div>

            {/* Hidden Divider on mobile, visible on MD+ */}
            <div className="hidden md:block"><Divider /></div>

            {/* 2. Date Section */}
            <div className='text-sm font-medium text-gray-700 md:min-w-30'>
                <span className="md:hidden text-gray-400 text-xs block">Duration:</span>
                {dateRange}
            </div>

            <div className="hidden md:block"><Divider /></div>

            {/* 3. Message Section */}
            <div className='flex-1 min-w-0'>
                <span className="md:hidden text-gray-400 text-xs block">Reason:</span>
                <p className='text-sm text-gray-600 line-clamp-2 italic md:not-italic'>
                    "{reasonMessage}"
                </p>
            </div>

            <div className="hidden md:block"><Divider /></div>

            {/* 4. Actions Section */}
            <div className='flex flex-wrap md:flex-nowrap gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-blue-100'>
                <CTAButton 
                    label='Accept' 
                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 justify-center" 
                    onClick={onAccept} 
                />
                <CTAButton 
                    label='Reject' 
                    isOutlineOnly 
                    className='flex-1 md:flex-none border-red-600! text-red-600! hover:bg-red-50 justify-center' 
                    onClick={onReject} 
                />
                <CTAButton 
                    label='Discuss' 
                    isOutlineOnly 
                    className='flex-1 md:flex-none border-gray-500! text-gray-700! hover:bg-gray-100 justify-center' 
                    onClick={onDiscuss} 
                />
            </div>

            {/* 5. Timestamp */}
            <span className='text-gray-400 text-[10px] md:text-xs self-end md:self-center whitespace-nowrap'>
                {createdAt}
            </span>
        </div>
    )
}

export default RequestTile
