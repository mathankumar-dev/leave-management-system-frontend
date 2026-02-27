import React from 'react'
import Divider from '../../../../components/ui/Divider';
import MetricTile from '../../components/tiles/MetricTile';
import RequestTile from '../../components/tiles/RequestTile';
import { useManagerApprovals } from '../../hooks/manager/useManagerApprovals';
import CustomLoader from '../../../../components/ui/CustomLoader';
import { useAuth } from '../../../auth/hooks/useAuth';


const PendingApprovalsView: React.FC = () => {
    
    const {user} = useAuth();

    const { requests, loading, handleDecision } = useManagerApprovals(user?.id);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
            <CustomLoader label="Loading pending approvals" />
        </div>
    );

    return (
        <div className='flex flex-col gap-2'>
            <div className='min-h-20 py-2.5 w-full flex justify-between items-center bg-[#F1F5F9] pl-4 pr-4 rounded-sm'>
                <MetricTile value={"10"} firstLabel="Pending" secondLabel="Approvals" />
                <Divider />
                <MetricTile value={"03"} firstLabel="Members" secondLabel="out Today" />
                <Divider />
                <MetricTile value={"15"} firstLabel="Weekly Absence" secondLabel="Summary" />
            </div>



            <div className='flex flex-col gap-2 bg-[#F1F5F9] py-2.5 px-4 rounded-sm'>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <RequestTile
                            key={req.id}
                            {...req}
                            onAccept={() => handleDecision(req.id, 'approve')}
                            onReject={() => handleDecision(req.id, 'reject')}
                            onDiscuss={() => handleDecision(req.id, 'discuss')}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-white rounded border border-dashed border-gray-300">
                        No pending leave requests found.
                    </div>
                )}
            </div>
        </div>
    )
}

export default PendingApprovalsView;
