import React, { useState } from "react";
import { HiOutlineUserCircle, HiOutlineUsers, HiOutlineMapPin, HiOutlineBriefcase } from "react-icons/hi2";
import {
    GenderMap,
    BloodGroupMap,
    MaritalStatusMap,
    type PersonalDetailsRequest
} from "../features/auth/types";
import FailureModal from "../components/ui/FailureModal";
import Loader from "../components/ui/Loader"; 
import MyDatePicker from "../components/ui/datepicker/MyDatePicker";
import { useAuth } from "../features/auth/hooks/useAuth";
import { authService } from "../features/auth/services/AuthService";

const PersonalDetailsModal = () => {
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState<Partial<PersonalDetailsRequest >>({
        // fullName: user?.name || "", // Restored: Important for the record
        gender: "MALE",
        bloodGroup: "O_POSITIVE",
        maritalStatus: "SINGLE",
        fatherAlive: true,
        motherAlive: true
    });

    const [loaderState, setLoaderState] = useState({ active: false, finished: false });
    const [showFailure, setShowFailure] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        const requiredFields: (keyof PersonalDetailsRequest)[] = [
            'contactNumber', 'aadharNumber', 'personalEmail', 'dateOfBirth',
            'presentAddress', 'permanentAddress', 'designation'
        ];

        const isMissing = requiredFields.some(field => !formData[field as keyof typeof formData]);
        if (isMissing) {
            setErrorMessage("Please fill in all primary identity and address fields.");
            setShowFailure(true);
            return;
        }

        if (!user?.id) return;

        try {
            setLoaderState({ active: true, finished: false });

         
            await authService.updatePersonalDetails(user.id, formData as PersonalDetailsRequest);

            setLoaderState({ active: true, finished: true });
        

        } catch (err) {
            setLoaderState({ active: false, finished: false });
            setErrorMessage("Failed to save. Please try again.");
            setShowFailure(true);
        }
    };

    // This function is the "Bridge" to the dashboard
    const handleFinalize = async () => {
        if (user) {
            try {
                // Fetch the fresh profile from the server
                const updatedProfile = await authService.getEmployeeProfile(user.id);
                
                // CRITICAL: Setting the user here is what triggers your Auth Guard 
                // to move from the 'PersonalDetailsModal' view to the Dashboard.
                setUser(updatedProfile); 
            } catch (err) {
                // Fallback: even if profile fetch fails, close the loader
                setLoaderState({ active: false, finished: false });
            }
        }
    };

    const InputLabel = ({ children }: { children: string }) => (
        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block ml-1">
            {children}
        </label>
    );

    return (
        <>
            {loaderState.active && (
                <Loader 
                    message="Updating your official record..." 
                    isFinished={loaderState.finished}
                    onFinished={handleFinalize} 
                />
            )}

            <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                    <div className="p-6 text-center border-b border-neutral-100 shrink-0">
                        <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 text-3xl text-indigo-600">
                            <HiOutlineUserCircle />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Complete Your Profile</h3>
                        <p className="text-neutral-500 text-xs mt-1">This information is required to access your dashboard.</p>
                    </div>

                    <div className="p-8 overflow-y-auto space-y-8 bg-neutral-25/30 custom-scrollbar">

                        {/* 1. PRIMARY IDENTITY */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineUserCircle size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Identity & Contact</span>
                            </div>

                            {/* <div className="w-full">
                                <InputLabel>Full Name (As per Aadhar)</InputLabel>
                                <input 
                                    className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                                    placeholder="Enter your full name"
                                />
                            </div> */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel>Contact Number</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.contactNumber || ""} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Personal Email</InputLabel>
                                    <input type="email" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.personalEmail || ""} onChange={e => setFormData({ ...formData, personalEmail: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Aadhar Number</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.aadharNumber || ""} onChange={e => setFormData({ ...formData, aadharNumber: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <MyDatePicker label="Date of Birth" selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null} onChange={d => setFormData({ ...formData, dateOfBirth: d?.toISOString().split('T')[0] })} />
                                <div>
                                    <InputLabel>Gender</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white outline-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })}>
                                        {Object.values(GenderMap).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel>Blood Group</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white outline-none" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}>
                                        {Object.values(BloodGroupMap).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel>Marital Status</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white outline-none" value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}>
                                        {Object.values(MaritalStatusMap).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. PROFESSIONAL */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineBriefcase size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Professional Info</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel>Designation</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={formData.designation || ""} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Skill Set (Comma separated)</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={formData.skillSet || ""} onChange={e => setFormData({ ...formData, skillSet: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* 3. ADDRESSES */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineMapPin size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Address Details</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel>Present Address</InputLabel>
                                    <textarea rows={2} className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500" value={formData.presentAddress || ""} onChange={e => setFormData({ ...formData, presentAddress: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Permanent Address</InputLabel>
                                    <textarea rows={2} className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500" value={formData.permanentAddress || ""} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* 4. FAMILY */}
                        <div className="space-y-4 pb-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineUsers size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Family Information</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase">Father's Details</p>
                                        <label className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase cursor-pointer">
                                            Alive? <input type="checkbox" className="accent-indigo-600" checked={formData.fatherAlive} onChange={e => setFormData({ ...formData, fatherAlive: e.target.checked })} />
                                        </label>
                                    </div>
                                    <input placeholder="Father's Full Name" className="w-full border-b border-neutral-200 py-1.5 text-sm outline-none focus:border-indigo-500" value={formData.fatherName || ""} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                    <MyDatePicker label="Father's DOB" selected={formData.fatherDateOfBirth ? new Date(formData.fatherDateOfBirth) : null} onChange={d => setFormData({ ...formData, fatherDateOfBirth: d?.toISOString().split('T')[0] })} />
                                    <input placeholder="Father's Occupation" className="w-full border-b border-neutral-200 py-1.5 text-sm outline-none focus:border-indigo-500" value={formData.fatherOccupation || ""} onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })} />
                                </div>
                                <div className="p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase">Mother's Details</p>
                                        <label className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase cursor-pointer">
                                            Alive? <input type="checkbox" className="accent-indigo-600" checked={formData.motherAlive} onChange={e => setFormData({ ...formData, motherAlive: e.target.checked })} />
                                        </label>
                                    </div>
                                    <input placeholder="Mother's Full Name" className="w-full border-b border-neutral-200 py-1.5 text-sm outline-none focus:border-indigo-500" value={formData.motherName || ""} onChange={e => setFormData({ ...formData, motherName: e.target.value })} />
                                    <MyDatePicker label="Mother's DOB" selected={formData.motherDateOfBirth ? new Date(formData.motherDateOfBirth) : null} onChange={d => setFormData({ ...formData, motherDateOfBirth: d?.toISOString().split('T')[0] })} />
                                    <input placeholder="Mother's Occupation" className="w-full border-b border-neutral-200 py-1.5 text-sm outline-none focus:border-indigo-500" value={formData.motherOccupation || ""} onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-neutral-100 shrink-0">
                        <button
                            onClick={handleSubmit}
                            disabled={loaderState.active}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 uppercase tracking-widest text-xs active:scale-[0.98]"
                        >
                            {loaderState.active ? "Updating Record..." : "Confirm & Save Profile"}
                        </button>
                    </div>
                </div>
            </div>

            {showFailure && (
                <FailureModal 
                    title="Save Failed" 
                    message={errorMessage} 
                    onClose={() => setShowFailure(false)} 
                />
            )}
        </>
    );
};

export default PersonalDetailsModal;