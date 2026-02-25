import api from "../../../../api/axiosInstance"

export const managerService = {
    getPendingApprovals: async (managerId : string) => {
        const response = await api.get(`leave-approvals/pending/${managerId}`);
        console.log(response.data);
        return response.data.content;
    },

    approveLeave : async (leaveId : number , managerId : string) => {
        return api.patch(`leave-approvals/${leaveId}/approve?managerId${managerId}`);
    },

    rejectLeave : async (leaveId : number , managerId : string) => {
        return api.patch(`leave-approvals/${leaveId}/reject?managerId${managerId}`);
    },

    discussLeave : async (leaveId : number , managerId : string) => {
        return api.patch(`leave-approvals/${leaveId}/discuss?managerId${managerId}`);
    },

}