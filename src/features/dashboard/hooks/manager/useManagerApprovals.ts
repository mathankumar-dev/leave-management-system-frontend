import { useEffect, useState } from "react"
import { managerService } from "../../services/manager/managerService";

export const useManagerApprovals = (managerId : string) => {
    const [requests ,  setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () =>{

        setLoading(true);

        try{
            const data = await managerService.getPendingApprovals(managerId);
            setRequests(data);
        }
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchRequests();
    },[managerId]);


    const handleDecision = async (leaveId : number , type : 'approve' | 'reject' | 'discuss') =>{
        try{
            if(type === 'approve'){
                await managerService.approveLeave(leaveId,managerId);
            }
            else if(type == 'reject'){
                await managerService.rejectLeave(leaveId,managerId);
            }
            else{
                await managerService.discussLeave(leaveId , managerId)
            }

            setRequests((prev) => prev.filter((req) => String(req.id) !== String(leaveId)));
        }catch(err){
            console.error(err);
            alert("Failed to process decision. Please try again.");
            
        }
    };

    return {  requests, loading , handleDecision , refresh : fetchRequests };
}