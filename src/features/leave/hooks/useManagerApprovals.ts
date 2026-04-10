
import { employeeService } from "@/features/employee/services/employeeService";
import { leaveService } from "@/features/leave/services/leaveService";
import { requestService } from "@/features/leave/services/requestService";
import type { LeaveDecision, LeaveDecisionRequest, LeaveType, ManagerAccessDecision } from "@/features/leave/types";
import { useEffect, useState } from "react";

export const useManagerApprovals = (userId: string, role?: string) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [leaveData] = await Promise.all([
        leaveService.getPendingApprovals(userId),
      ]);

      // 1. Map the basic data first
      const rawLeaves = (leaveData || []).map((item: any) => ({
        ...item.leaveApplicationResponseDTO,
        // leaveType: item.leaveApplicationResponseDTO.leaveTypeName,
        attachments: item.attachments || [],
        attachmentCount: item.attachmentCount || 0,
        isLeave: true
      }));

      // 2. Resolve all names in parallel
      // Inside useManagerApprovals.ts -> fetchRequests function
      const formattedLeaves = await Promise.all(
        rawLeaves.map(async (req: any) => {
          const response = await employeeService.getNameByID(req.employeeId);
          

          // CRITICAL: Ensure this is a string
          // If response is { fullName: "..." }, use response.fullName
          // If response is just the string, use response || "Unknown"
          const nameString = typeof response === 'string'
            ? response
            : (response?.fullName || response?.empName || "Unknown Employee");

          return { ...req, employeeName: nameString };
        })
      );

      const combined = formattedLeaves.sort(
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
    fetchRequests();
  }, [userId, role]);

  const removeFromState = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleDecision = async (
    requestId: number,
    status: LeaveDecision,
    reason: string = "",
    type?: LeaveType,
    decision?: ManagerAccessDecision
  ) => {
    try {
      setLoading(true);
      // const isHR = role?.toUpperCase() === 'HR';

      // ─── HR leave decision ────────────────────────────────────
      // if (isHR) {
      //   if (status === 'APPROVED') {
      //     await api.patch(`/leave-approvals/${requestId}/approve`);
      //   } else {
      //     await api.patch(`/leave-approvals/${requestId}/reject`, {
      //       comments: reason
      //     });
      //   }
      // }
      // else if (type === 'ON_DUTY') {
      //   if (status === 'APPROVED') {
      //     await requestService.approveOD(requestId, userId);
      //   } else {
      //     await requestService.rejectOD(requestId, userId, reason);
      //   }
      // }
      if (type === 'COMP_OFF') {
        if (status === 'APPROVED') {
          await leaveService.approveCompOff(requestId);
        } else {
          await leaveService.rejectCompOff(requestId, reason);
        }
      }
      // else if (type === 'MEETING') {
      //   if (status === 'APPROVED') {
      //     await requestService.approveMeeting(requestId, userId);
      //   } else {
      //     await requestService.rejectMeeting(requestId, userId);
      //   }
      // }
      else if (type === 'VPN' || type === 'BIOMETRIC') {

        await requestService.approveAccessManager(requestId, decision!);

      }
      else {
        const decisionRequest: LeaveDecisionRequest = {
          leaveId: requestId,
          approverId: userId,
          decision: status,
          comments: reason
        };
        await leaveService.updateDecision(decisionRequest);
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
      await leaveService.approveCompOff(compOffId);
      removeFromState(compOffId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleCompOffReject = async (compOffId: number, reason: string) => {
    try {
      await leaveService.rejectCompOff(compOffId, reason);
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
}