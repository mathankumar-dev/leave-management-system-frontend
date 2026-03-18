import React, { useState, useEffect } from "react";
import {
    HiOutlineMapPin,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineUsers,
    HiOutlineClock,
    HiOutlineBuildingOffice2
} from "react-icons/hi2";
import { useRequest } from "../features/dashboard/hooks/requests/useRequest";
import { useAuth } from "../features/auth/hooks/useAuth";
import type { ODRequest } from "../features/dashboard/types";
import MyDatePicker from "../components/ui/datepicker/MyDatePicker";
import MyTimePicker from "../components/ui/MyTimePicker";

type RequestType = "OD" | "MEETING" | "OVERTIME";

const OtherRequestForm = () => {
    const { user } = useAuth();
    const { createOD, createMeeting, loading, error, setError } = useRequest();

    const [activeTab, setActiveTab] = useState<RequestType>("OD");
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        fromDate: null as Date | null,
        toDate: null as Date | null,
        meetingDate: new Date(), // The specific day for Meeting/OT
        reason: "",
        title: "",
        location: "",
    });

    useEffect(() => {
        if (activeTab === "MEETING" && user?.role === "EMPLOYEE") {
            setActiveTab("OD");
        }
        setError(null);
    }, [activeTab, user?.role, setError]);

    // Helper to merge the selected Date with the selected Time
    const mergeDateAndTime = (baseDate: Date, timeDate: Date | null) => {
        if (!timeDate) return null;
        const newDate = new Date(baseDate);
        newDate.setHours(timeDate.getHours());
        newDate.setMinutes(timeDate.getMinutes());
        newDate.setSeconds(0);
        return newDate;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user?.id) return;

        if (activeTab === "OD") {
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
        }

        if (activeTab === "MEETING" || activeTab === "OVERTIME") {
            const start = mergeDateAndTime(formData.meetingDate, formData.fromDate);
            const end = mergeDateAndTime(formData.meetingDate, formData.toDate);

            if (!start || !end) {
                setError("Please select both start and end times.");
                return;
            }

            if (activeTab === "MEETING") {
                const meetingPayload = {
                    title: formData.title,
                    location: formData.location,
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
                    description: formData.reason
                };
                const success = await createMeeting(meetingPayload, user.id, undefined);
                if (success) setSubmitted(true);
            }

            if (activeTab === "OVERTIME") {
                setSubmitted(true);
            }
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto my-10 p-10 text-center bg-white border border-slate-200 rounded-lg shadow-sm">
                <HiOutlineCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">{activeTab} Request Submitted</h2>
                <p className="text-slate-500 mt-2">The request has been recorded in the system.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-medium text-indigo hover:text-indigo-500">
                    Raise another request →
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            {/* Tab Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: "OD", label: "On Duty", icon: <HiOutlineMapPin /> },
                    { id: "MEETING", label: "Meeting", icon: <HiOutlineUsers /> },
                    { id: "OVERTIME", label: "Overtime", icon: <HiOutlineClock /> },
                ]
                    .filter(tab => tab.id !== "MEETING" || user?.role !== "EMPLOYEE") // Filter out Meeting for Employees
                    .map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as RequestType)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                ? "bg-primary-500 text-white shadow-md shadow-indigo-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-3 shadow-sm">
                    <HiOutlineExclamationTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700 font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 capitalize">
                        {activeTab.toLowerCase()} Request
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {activeTab === "MEETING" && user?.role != "EMPLOYEE" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <HiOutlineUsers size={14} /> Meeting Title
                                </label>
                                <input
                                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-sm text-xs font-black uppercase outline-none focus:border-indigo-600 transition-all"
                                    placeholder="Enter meeting subject"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <HiOutlineBuildingOffice2 size={14} /> Location
                                </label>
                                <input
                                    className="w-full border border-slate-200 bg-slate-50 p-3 rounded-sm text-xs font-black uppercase outline-none focus:border-indigo-600 transition-all"
                                    placeholder="Room name or Link"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Shared Inputs Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(activeTab === "MEETING" || activeTab === "OVERTIME") ? (
                            <>
                                <MyDatePicker
                                    label="Date"
                                    selected={formData.meetingDate}
                                    onChange={(date) => setFormData({ ...formData, meetingDate: date || new Date() })}
                                    required
                                />
                                <MyTimePicker
                                    label="Start Time"
                                    selected={formData.fromDate}
                                    onChange={(time) => setFormData({ ...formData, fromDate: time })}
                                    required
                                />
                                <MyTimePicker
                                    label="End Time"
                                    selected={formData.toDate}
                                    onChange={(time) => setFormData({ ...formData, toDate: time })}
                                    required
                                />
                            </>
                        ) : (
                            // OD Logic (Date to Date)
                            <>
                                <div className="md:col-span-1">
                                    <MyDatePicker
                                        label="From Date"
                                        selected={formData.fromDate}
                                        onChange={(date) => setFormData({ ...formData, fromDate: date })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <MyDatePicker
                                        label="To Date"
                                        selected={formData.toDate}
                                        onChange={(date) => setFormData({ ...formData, toDate: date })}
                                        minDate={formData.fromDate || new Date()}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <HiOutlineChatBubbleLeftRight size={16} />
                            {activeTab === "OVERTIME" ? "Work Description" : "Purpose"}
                        </label>
                        <textarea
                            rows={3}
                            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-sm text-xs font-black uppercase outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400"
                            placeholder={activeTab === "OVERTIME" ? "Briefly explain tasks..." : "Provide details here..."}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                        {loading ? "Processing..." : `Submit ${activeTab} Request`}
                        {!loading && <HiOutlinePaperAirplane size={18} className="rotate-45" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtherRequestForm;