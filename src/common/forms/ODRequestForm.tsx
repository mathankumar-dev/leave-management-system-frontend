import React, { useState } from "react";
import {
    HiOutlineMapPin,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineUsers
} from "react-icons/hi2";
import MyDatePicker from "../../components/ui/datepicker/MyDatePicker";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useRequest } from "../../features/dashboard/hooks/requests/useRequest";
import type { ODRequest } from "../../features/dashboard/types";
import Badge from "../../components/ui/Badge";

const ODRequestForm = () => {
    const { user } = useAuth();
    const { createOD, loading, error, setError } = useRequest();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        fromDate: null as Date | null,
        toDate: null as Date | null,
        reason: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user?.id) return;

        if (!formData.fromDate || !formData.toDate) {
            setError("Please select both start and end dates.");
            return;
        }

        const payload: ODRequest = {
            employeeId: user.id,
            fromDate: formData.fromDate.toISOString().split("T")[0],
            toDate: formData.toDate.toISOString().split("T")[0],
            reason: formData.reason,
        };

        const success = await createOD(payload, user.id);
        if (success) setSubmitted(true);
    };
    const totalDays = 1;

    const renderApprovers = () => {
        const approvers = [];

        if (user?.role === "EMPLOYEE") {
            approvers.push({ label: `TL: ${user?.teamLeaderName || 'Assigning...'}`, active: true });
            if (totalDays > 1) {
                approvers.push({ label: `Manager: ${user?.managerName || 'Assigning...'}`, active: true });
            }
        }

        if (user?.role === "TEAM_LEADER") {
            approvers.push({ label: `Manager: ${user?.managerName || 'Assigning...'}`, active: true });
        }

        if (totalDays > 7) {
            approvers.push({ label: `HR: ${user?.hrname || 'Assigning...'}`, active: true });
        }

        return approvers.map((app, index) => (
            <Badge key={index} label={app.label} active={app.active} />
        ));
    };

    if (submitted) {
        return (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in duration-300">
                <HiOutlineCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">OD Request Submitted</h2>
                <p className="text-slate-500 mt-2">Your On-Duty application has been sent for approval.</p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({ fromDate: null, toDate: null, reason: "" });
                    }}
                    className="mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                    Raise another request →
                </button>
            </div>
        );
    }

    return (
        <div className=" rounded-2xl overflow-hidden">
            <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <HiOutlineUsers className="text-indigo-600" /> Schedule Meeting
                </h1>

                <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Required Approvals
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {renderApprovers()}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MyDatePicker
                        label="From Date"
                        selected={formData.fromDate}
                        onChange={(date) => setFormData({ ...formData, fromDate: date })}
                        required
                    />
                    <MyDatePicker
                        label="To Date"
                        selected={formData.toDate}
                        onChange={(date) => setFormData({ ...formData, toDate: date })}
                        minDate={formData.fromDate || new Date()}
                        required
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <HiOutlineChatBubbleLeftRight size={16} />
                        Purpose of Visit / Duty
                    </label>
                    <textarea
                        rows={4}
                        className="w-full border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                        placeholder="e.g. Meeting at Room No. ..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                    {loading ? "Processing..." : "Submit OD Request"}
                    {!loading && <HiOutlinePaperAirplane size={18} className="rotate-45" />}
                </button>
            </form>
        </div>
    );
};

export default ODRequestForm;