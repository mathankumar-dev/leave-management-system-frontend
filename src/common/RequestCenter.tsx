import React, { useState } from "react";
import { HiOutlineClock, HiOutlineMapPin } from "react-icons/hi2";

import OtherRequestForm from "./OtherRequestForm";
import LeaveApplicationForm from "../features/dashboard/views/LeaveApplicationForm";

type TabType = "LEAVE" | "OTHER";

const RequestCenter = () => {
    const [activeTab, setActiveTab] = useState<TabType>("LEAVE");

    return (
        <div className="max-w-5xl mx-auto py-6 px-4">

            {/* Tab Switch */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab("LEAVE")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all
          ${activeTab === "LEAVE"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                >
                    <HiOutlineClock /> Leave
                </button>

                <button
                    onClick={() => setActiveTab("OTHER")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all
          ${activeTab === "OTHER"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                >
                    <HiOutlineMapPin /> Other Requests
                </button>
            </div>

            {/* Content */}
            {activeTab === "LEAVE" ? (
                <LeaveApplicationForm />
            ) : (
                <OtherRequestForm />
            )}
        </div>
    );
};

export default RequestCenter;