import { useEffect, useState } from "react";
import type { LeaveDecisionRequest } from "../../types";
import { dashboardService } from "../../services/dashboardService";

export const useManagerApprovals = (managerId: number) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getPendingApprovals(managerId);
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) fetchRequests();
  }, [managerId]);

  const handleDecision = async (decisionRequest: LeaveDecisionRequest) => {
    try {
      await dashboardService.updateDecision(decisionRequest);
      setRequests((prev) => 
        prev.filter((req) => req.id !== decisionRequest.leaveId)
      );

      return { success: true };
    } catch (err) {
      console.error("Error processing leave decision:", err);
      return { success: false, error: err };
    }
  };

  return { 
    requests, 
    loading, 
    handleDecision, 
    refresh: fetchRequests 
  };
};