// import api from "../../../../api/axiosInstance"

// export const managerService = {
//     getPendingApprovals: async (managerId : number , comment? : string) => {
//         const response = await api.get(`/leave-approvals/pending?managerId=${managerId}&& ${comment}`);
//         return response.data.content;
//     },

//     approveLeave : async (leaveId : number , managerId : number) => {
//         return api.patch(`/leave-approvals/${leaveId}/approve?managerId${managerId}`);
//     },

//     rejectLeave : async (leaveId : number , managerId : number) => {
//         return api.patch(`/leave-approvals/${leaveId}/reject?managerId${managerId}`);
//     },

//     discussLeave : async (leaveId : number , managerId : number) => {
//         return api.patch(`/leave-approvals/${leaveId}/discuss?managerId${managerId}`);
//     },

// }