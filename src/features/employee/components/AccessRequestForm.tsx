import React, { useState } from "react";
import {
    HiOutlineShieldCheck,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineFingerPrint,
    HiOutlineLockClosed
} from "react-icons/hi2";
import { useAuth } from "../../../shared/auth/useAuth";
import { useRequest } from "../../leave/hooks/useRequest";
import Badge from "../../../shared/components/NameBadge";
import type { AccessRequest, LeaveType } from "../../dashboard/types";

const AccessRequestForm = () => {
    const { user } = useAuth();
    const { createAccessRequest, loading, setError } = useRequest();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        accessType: "VPN",
        reason: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user?.id) return;


        const payload: AccessRequest = {
            accessType: formData.accessType as LeaveType,
            reason: formData.reason,
        };

        const success = await createAccessRequest(payload, user.id);
        if (success) setSubmitted(true);
    };

    const renderApprovers = () => {
        return (
            <>
                <Badge label={`Manager: ${user?.managerName}`} active={true} />
                {/* <Badge label={`Security: Automated`} active={true} /> */}
            </>
        );
    };

    if (submitted) {
        return (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-sm animate-in zoom-in duration-300">
                <HiOutlineCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Request Submitted</h2>
                <p className="text-slate-500 mt-2">Your {formData.accessType} access request is being processed.</p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({ accessType: "VPN", reason: "" });
                    }}
                    className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 transition-all"
                >
                    Request New Access →
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-sm overflow-hidden bg-white">
            <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <HiOutlineShieldCheck className="text-indigo-600" /> System Access Request
                </h1>

                <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Security Clearance
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {renderApprovers()}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Access Type Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <HiOutlineLockClosed size={16} />
                        Select Access Type
                    </label>
                    <div className="relative">
                        <select
                            value={formData.accessType}
                            onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                            className="w-full appearance-none border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs font-bold uppercase outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
                        >
                            <option value="VPN">VPN Access (Remote Work)</option>
                            <option value="BIOMETRIC">Biometric Access (Office Entry)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            {formData.accessType === "VPN" ? <HiOutlineShieldCheck size={20} /> : <HiOutlineFingerPrint size={20} />}
                        </div>
                    </div>
                </div>

                {/* Reason Field */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <HiOutlineChatBubbleLeftRight size={16} />
                        Justification / Reason
                    </label>
                    <textarea

                        rows={4}
                        className="w-full border resize-none border-slate-200 bg-slate-50 p-4 rounded-xl text-sm font-medium outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300"
                        placeholder="eg ., I need VPN Access..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg"
                >
                    {loading ? "Processing..." : `Request ${formData.accessType} Access`}
                    {!loading && <HiOutlinePaperAirplane size={18} className="rotate-45" />}
                </button>
            </form>
        </div>
    );
};

export default AccessRequestForm;