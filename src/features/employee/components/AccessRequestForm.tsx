import React, { useEffect, useState } from "react";
import { useAuth } from "@/shared/auth/useAuth";
import { useRequest } from "@/features/leave/hooks/useRequest";

import {
    HiOutlineShieldCheck,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineFingerPrint,
} from "react-icons/hi2";
import type { AccessType } from "../hooks/useAccessTypes";

const AccessRequestForm = () => {
    const { user } = useAuth();
    const { createAccessRequest, loading, setError, error } = useRequest();

    const [submitted, setSubmitted] = useState(false);

    const [accessTypes, setAccessTypes] = useState<AccessType[]>([]);

    const [formData, setFormData] = useState({
        accessType: "",
        reason: "",
    });

    
    useEffect(() => {
        const data: AccessType[] = [
            {
                type: "VPN",
                label: "VPN Access (Remote Work)",
                enabled: true,
                rolesAllowed: ["MANAGER", "ADMIN"],
            },
            {
                type: "BIOMETRIC",
                label: "Biometric Access",
                enabled: false, // 🚫 future
                rolesAllowed: ["ALL"],
            },
        ];

        setAccessTypes(data);
    }, []);

    // 🔥 Filter logic
    const filteredOptions = accessTypes
        .filter((opt) => opt.enabled)
        .filter((opt) => {
            if (opt.rolesAllowed.includes("ALL")) return true;
            return opt.rolesAllowed.includes(user?.role || "");
        });

    // 🔥 Default select
    useEffect(() => {
        if (filteredOptions.length > 0) {
            setFormData((prev) => ({
                ...prev,
                accessType: filteredOptions[0].type,
            }));
        }
    }, [accessTypes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.reason) {
            setError("Please enter reason");
            return;
        }
        if (!user?.id) {
            setError("User not found");
            return;
        }

        const success = await createAccessRequest(
            {
                accessType: formData.accessType,
                reason: formData.reason,
            },
            user.id
        );

        if (success) setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="p-10 text-center bg-white border rounded-2xl shadow">
                <HiOutlineCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Request Submitted</h2>
                <p className="text-gray-500 mt-2">
                    Your {formData.accessType} request is under review.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-2xl shadow">
            <div className="p-6 border-b flex items-center gap-2">
                <HiOutlineShieldCheck className="text-indigo-600" />
                <h1 className="font-bold">Access Request</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded flex items-center gap-2">
                        <HiOutlineExclamationTriangle /> {error}
                    </div>
                )}

                {/* Access Type */}
                <div>
                    <label className="text-xs font-bold uppercase flex gap-2">
                        <HiOutlineShieldCheck /> Access Type
                    </label>

                    <select
                        value={formData.accessType}
                        onChange={(e) =>
                            setFormData({ ...formData, accessType: e.target.value })
                        }
                        className="w-full border p-3 rounded-xl mt-2"
                    >
                        {filteredOptions.map((opt) => (
                            <option key={opt.type} value={opt.type}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Dynamic Icon */}
                    <div className="mt-2 text-slate-400">
                        {formData.accessType === "VPN" ? (
                            <HiOutlineShieldCheck />
                        ) : (
                            <HiOutlineFingerPrint />
                        )}
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="text-xs font-bold uppercase flex gap-2">
                        <HiOutlineChatBubbleLeftRight /> Reason
                    </label>

                    <textarea
                        className="w-full border p-3 rounded-xl mt-2"
                        rows={4}
                        placeholder="Explain why you need access..."
                        value={formData.reason}
                        onChange={(e) =>
                            setFormData({ ...formData, reason: e.target.value })
                        }
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl"
                >
                    {loading ? "Processing..." : "Submit Request"}
                    {!loading && <HiOutlinePaperAirplane className="inline ml-2" />}
                </button>
            </form>
        </div>
    );
};

export default AccessRequestForm;