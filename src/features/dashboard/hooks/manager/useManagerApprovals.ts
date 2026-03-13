import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import type { CompOffResponse, LeaveDecisionRequest } from "../../types";

export const useManagerApprovals = (managerId: number) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [leaves, compOffs] = await Promise.all([
        dashboardService.getPendingApprovals(managerId),
        dashboardService.getPendingCompOffs(managerId)
      ]);

      const formattedCompOffs = compOffs.map((co: CompOffResponse) => ({
        ...co,
        id : co.compoffId,
        leaveType: 'COMP_OFF', 
        startDate: co.workedDate,
        endDate: co.workedDate,
        isCompOff: true
      }));

      const combined = [...leaves, ...formattedCompOffs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setRequests(combined);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) fetchRequests();
  }, [managerId]);

  // Shared helper to remove item from UI state
  const removeFromState = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleDecision = async (decisionRequest: LeaveDecisionRequest) => {
    try {
      await dashboardService.updateDecision(decisionRequest);
      removeFromState(decisionRequest.leaveId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleCompOffApprove = async (compOffId: number) => {
    try {
      await dashboardService.approveCompOff(compOffId);
      removeFromState(compOffId); // Remove from UI
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleCompOffReject = async (compOffId: number, reason: string) => {
    try {
      await dashboardService.rejectCompOff(compOffId, reason);
      removeFromState(compOffId); // Remove from UI
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    requests,
    loading,
    handleDecision,
    handleCompOffApprove,
    handleCompOffReject, 
    refresh: fetchRequests
  };
};