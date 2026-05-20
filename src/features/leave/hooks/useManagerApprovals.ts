import { employeeService } from "@/features/employee/services/employeeService";
import { leaveService } from "@/features/leave/services/leaveService";
import { permissionService } from "@/features/leave/services/permissionService";
import type { LeaveDecision, LeaveDecisionRequest, LeaveType } from "@/features/leave/types";
import { useEffect, useState } from "react";

export const useManagerApprovals = (userId: string, role?: string) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // ── Fetch leaves AND permissions in parallel ───────────────
      const [leaveData, permissionData] = await Promise.all([
        leaveService.getPendingApprovals(userId),
        permissionService.getPendingPermissions(userId).catch(() => []),
      ]);

      // ── Map leave data (unchanged from live) ───────────────────
      const rawLeaves = (leaveData || []).map((item: any) => ({
        ...item.leaveApplicationResponseDTO,
        attachments: item.attachments || [],
        attachmentCount: item.attachmentCount || 0,
        isLeave: true,
        requestType: "LEAVE",
      }));

      // ── Map permission data (new) ──────────────────────────────
      const rawPermissions = (permissionData || []).map((item: any) => ({
        ...item,
        isPermission: true,
        requestType: "PERMISSION",
        leaveTypeName: "PERMISSION",
        startDate: item.permissionDate,
        endDate: item.permissionDate,
        days: parseFloat((item.durationMinutes / 60).toFixed(1)),
      }));

      // ── Resolve names for leaves (unchanged from live) ─────────
      const formattedLeaves = await Promise.all(
        rawLeaves.map(async (req: any) => {
          const response = await employeeService.getNameByID(req.employeeId);
          const nameString = typeof response === 'string'
            ? response
            : (response?.fullName || response?.empName || "Unknown Employee");
          return { ...req, employeeName: nameString };
        })
      );

      // ── Resolve names for permissions (new) ───────────────────
      const formattedPermissions = await Promise.all(
        rawPermissions.map(async (req: any) => {
          const response = await employeeService.getNameByID(req.employeeId);
          const nameString = typeof response === 'string'
            ? response
            : (response?.fullName || response?.empName || "Unknown Employee");
          return { ...req, employeeName: nameString };
        })
      );

      // ── Combine and sort (unchanged pattern) ───────────────────
      const combined = [...formattedLeaves, ...formattedPermissions].sort(
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
    type?: LeaveType | string,
  ) => {
    try {
      setLoading(true);

      // ── Permission decision (new) ──────────────────────────────
      if (type === 'PERMISSION') {
        if (status === 'APPROVED') {
          await permissionService.approvePermission(requestId, userId, reason);
        } else {
          await permissionService.rejectPermission(requestId, userId, reason);
        }
      }
      // ── Comp-Off decision (unchanged) ──────────────────────────
      else if (type === 'COMP_OFF') {
        if (status === 'APPROVED') {
          await leaveService.approveCompOff(requestId);
        } else {
          await leaveService.rejectCompOff(requestId, reason);
        }
      }
      // ── Leave decision (unchanged) ─────────────────────────────
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

  // ── Unchanged from live ────────────────────────────────────────
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
};