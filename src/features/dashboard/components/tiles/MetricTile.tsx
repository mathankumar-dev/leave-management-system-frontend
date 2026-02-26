import React from 'react'

export interface MetricTileProps {
    value: string;
    firstLabel: string;
    secondLabel: string; 
}
const MetricTile: React.FC<MetricTileProps> = ({
    value,
    firstLabel,
    secondLabel
}) => {
    return (
        <div className='flex gap-1 items-center'>
            <span className='text-primary-500 font-bold text-6xl '>{value}</span>
            <span className='text-black'>{firstLabel} <br />{secondLabel}</span>
        </div>
    )
}

export default MetricTile;
