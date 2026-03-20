import { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import { requestService } from "../../services/requests/requestService";
import type { CompOffResponse, LeaveDecision, LeaveDecisionRequest, ODResponse } from "../../types";
import api from "../../../../api/axiosInstance";

export const useManagerApprovals = (userId: number, role?: string) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const isTeamLeader = role?.toUpperCase() === 'TEAM_LEADER';
      const isHR = role?.toUpperCase() === 'HR';

      // ─── HR role → HR pending leaves endpoint ─────────────────
      if (isHR) {
        const res = await api.get('/leave-approvals/pending/hr');
        const hrLeaves = (res.data?.content || []).map((item: any) => ({
          ...item.leaveApplication,
          id: item.leaveApplication.id,
          employeeName: item.leaveApplication.employeeName,
          leaveType: item.leaveApplication.leaveType,
          startDate: item.leaveApplication.startDate,
          endDate: item.leaveApplication.endDate,
          reason: item.leaveApplication.reason,
          days: item.leaveApplication.days,
          createdAt: item.leaveApplication.createdAt,
          halfDayType: item.leaveApplication.halfDayType,
          startDateHalfDayType: item.leaveApplication.startDateHalfDayType,
          endDateHalfDayType: item.leaveApplication.endDateHalfDayType,
          attachments: item.attachments || [],
          attachmentCount: item.attachmentCount || 0,
          isHRLeave: true,
        }));
        setRequests(hrLeaves);
        return;
      }

      // ─── Team Leader ───────────────────────────────────────────
      if (isTeamLeader) {
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

        setRequests(combined);

      } else {
        // ─── Manager ─────────────────────────────────────────────
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
          id: od.id,
          employeeName: od.employeeName,
          leaveType: 'ON_DUTY',
          isOD: true,
          startDate: od.startDate,
          endDate: od.endDate,
          createdAt: od.createdAt
        }));

        console.log(formattedODs);

        const combined = [...leaves, ...formattedCompOffs, ...formattedODs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

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
      const isHR = role?.toUpperCase() === 'HR';

      // ─── HR leave decision ────────────────────────────────────
      if (isHR) {
        if (status === 'APPROVED') {
          await api.patch(`/leave-approvals/${requestId}/approve`);
        } else {
          await api.patch(`/leave-approvals/${requestId}/reject`, {
            comments: reason
          });
        }
      }
      else if (type === 'ON_DUTY') {
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

  return {
    requests,
    loading,
    handleDecision,
    handleCompOffApprove,
    handleCompOffReject,
    refresh: fetchRequests
  };
};