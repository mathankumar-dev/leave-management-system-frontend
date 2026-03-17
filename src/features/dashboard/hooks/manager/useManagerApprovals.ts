import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import { requestService } from "../../services/requests/requestService";
import type { CompOffResponse, LeaveDecision, LeaveDecisionRequest, ODResponse } from "../../types";

export const useManagerApprovals = (userId: number, role?: string) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const isTeamLeader = role?.toUpperCase() === 'TEAM_LEADER';

      if (isTeamLeader) {
        // Fetch Standard and OD requests for Team Leader
        const [tlRequests, tlODRequests] = await Promise.all([
          dashboardService.getPendingApprovalsForTeamLeader(userId),
          dashboardService.getPendingODApprovalsForTeamLeader(userId)
        ]);

        const formattedODs = (tlODRequests || []).map((od: ODResponse) => ({
          ...od,
          leaveType: 'ON_DUTY',
          isOD: true,
        }));

        const combined = [...(tlRequests || []), ...formattedODs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log(`combined : ${combined.forEach(a => {
          console.log(a);

        })}`);

        setRequests(combined);

      } else {
        const [leaves, compOffs, ods] = await Promise.all([
          dashboardService.getPendingApprovals(userId),
          dashboardService.getPendingCompOffs(userId),
          dashboardService.getPendingODApprovals(userId)
        ]);

        const formattedCompOffs = (compOffs || []).map((co: CompOffResponse) => ({
          ...co,
          id: co.compoffId,
          leaveType: 'COMP_OFF',
          startDate: co.workedDate,
          endDate: co.workedDate,
          isCompOff: true
        }));

        const formattedODs = (ods || []).map((od: ODResponse) => ({
          ...od,
          leaveType: 'ON_DUTY',
          isOD: true,
          startDate: od.fromDate,
          endDate: od.toDate
        }));

        const combined = [...leaves, ...formattedCompOffs, ...formattedODs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log(`combined : ${combined.forEach(a => {
          console.log(a);

        })}`);
        setRequests(combined);
      }
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, [userId, role]);

  const removeFromState = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleDecision = async (
    requestId: number,
    status: LeaveDecision,
    reason: string = "",
    type?: string
  ) => {
    try {
      setLoading(true);
      if (type === 'ON_DUTY') {
        if (status === 'APPROVED') {
          await requestService.approveOD(requestId, userId);
        } else {
          await requestService.rejectOD(requestId, userId, reason);
        }
      }
      else if (type === 'COMP_OFF') {
        if (status === 'APPROVED') {
          await dashboardService.approveCompOff(requestId);
        } else {
          await dashboardService.rejectCompOff(requestId, reason);
        }
      }
      else if (type === 'MEETING') {
        if (status === 'APPROVED') {
          await requestService.approveMeeting(requestId, userId);
        } else {
          await requestService.rejectMeeting(requestId, userId);
        }
      }
      else {
        const decisionRequest: LeaveDecisionRequest = {
          leaveId: requestId,
          approverId: userId,
          decision: status,
          comments: reason   
        };

        await dashboardService.updateDecision(decisionRequest);
      }

      // Refresh UI by removing the item
      removeFromState(requestId);
      return { success: true };

    } catch (err) {
      console.error(`Decision error for ${type || 'LEAVE'}:`, err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const handleCompOffApprove = async (compOffId: number) => {
    try {
      await dashboardService.approveCompOff(compOffId);
      removeFromState(compOffId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleCompOffReject = async (compOffId: number, reason: string) => {
    try {
      await dashboardService.rejectCompOff(compOffId, reason);
      removeFromState(compOffId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  console.log("from useManager dashboard");

  console.log(requests);


  return {
    requests,
    loading,
    handleDecision,
    handleCompOffApprove,
    handleCompOffReject,
    refresh: fetchRequests
  };
};