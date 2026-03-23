import React, { useState } from "react";
import {
    HiOutlineUserCircle,
    HiOutlineUsers,
    HiOutlineMapPin,
    HiOutlineBriefcase,
    HiOutlineDocumentArrowUp,
    HiCheckCircle,
    HiOutlineBuildingLibrary
} from "react-icons/hi2";
import {
    GenderMap,
    BloodGroupMap,
    MaritalStatusMap,
    type PersonalDetailsRequest
} from "../features/auth/types";
import FailureModal from "../../../shared/components/FailureModal";
import Loader from "../../../shared/components/Loader";
import MyDatePicker from "../../../shared/components/datepicker/MyDatePicker";
import { useAuth } from "../../../shared/auth/useAuth";
import { authService } from "../../auth/api/authApi";

const PersonalDetailsModal = () => {
    const { user, setUser } = useAuth();

    // 1. TYPE TOGGLE STATE
    const [isExperienced, setIsExperienced] = useState(false);
    const submissionType = isExperienced ? "experienced" : "fresher";

    // 2. TEXT DATA STATE (Updated with NEW fields)
    const [formData, setFormData] = useState<Partial<PersonalDetailsRequest>>({
        firstName: "",
        lastName: "",
        surName: "",
        gender: "MALE",
        bloodGroup: "O_POSITIVE",
        maritalStatus: "SINGLE",
        bankName: "",
        accountNumber: "",
        fatherAlive: true,
        motherAlive: true,
        unaNumber: "",
        previousRole: "",
        oldCompanyName: "",
        oldCompanyFromDate: "",
        oldCompanyEndDate: ""
    });

    // 3. FILE STATE
    const [files, setFiles] = useState<Record<string, File | null>>({
        aadhaarCard: null,
        tc: null,
        offerLetter: null,
        experienceCertificate: null,
        leavingLetter: null
    });

    const [loaderState, setLoaderState] = useState({ active: false, finished: false });
    const [showFailure, setShowFailure] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const handleSubmit = async () => {
        // Updated common required fields list
        const commonRequired: (keyof PersonalDetailsRequest)[] = [
            'firstName', 'lastName', 'surName', 'contactNumber', 'aadharNumber',
            'personalEmail', 'dateOfBirth', 'presentAddress', 'permanentAddress',
            'designation', 'bankName', 'accountNumber'
        ];

        const isMissingText = commonRequired.some(field => !formData[field]);

        const requiredFiles = isExperienced
            ? ['aadhaarCard', 'experienceCertificate', 'leavingLetter']
            : ['aadhaarCard', 'tc', 'offerLetter'];

        const isMissingFile = requiredFiles.some(key => !files[key]);

        // Specific checks for Experienced path
        const isMissingExpInfo = isExperienced && (
            !formData.unaNumber ||
            !formData.oldCompanyFromDate ||
            !formData.oldCompanyEndDate
        );

        if (isMissingText || isMissingFile || isMissingExpInfo) {
            setErrorMessage("Please fill all identity, bank, and professional fields and upload all required documents.");
            setShowFailure(true);
            return;
        }

        if (!user?.id) return;

        try {
            setLoaderState({ active: true, finished: false });
            await authService.submitMultipartDetails(user.id, submissionType, formData, files);
            setLoaderState({ active: true, finished: true });
        } catch (err: any) {
            setLoaderState({ active: false, finished: false });
            setErrorMessage(err.response?.data?.message || "Failed to save record.");
            setShowFailure(true);
        }
    };

    const handleFinalize = async () => {
        if (user?.id) {
            try {
                const updatedProfile = await authService.getEmployeeProfile(user.id);
                setUser(updatedProfile);
            } catch (err) {
                setLoaderState({ active: false, finished: false });
            }
        }
    };

    const InputLabel = ({ children }: { children: string }) => (
        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 block ml-1">
            {children}
        </label>
    );

    const FileInput = ({ label, id }: { label: string, id: string }) => (
        <div className="flex flex-col gap-1">
            <InputLabel>{label}</InputLabel>
            <div className="relative">
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFileChange(e, id)}
                    className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                />
                {files[id] && (
                    <span className="absolute right-2 top-2 text-green-500 text-[10px] font-bold flex items-center gap-1">
                        <HiCheckCircle /> Selected
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <>
            {loaderState.active && (
                <Loader message="Uploading documents..." isFinished={loaderState.finished} onFinished={handleFinalize} />
            )}

            <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                    {/* HEADER */}
                    <div className="p-6 text-center border-b border-neutral-100 shrink-0 relative">
                        <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-2 text-2xl text-indigo-600">
                            <HiOutlineUserCircle />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">Complete Professional Profile</h3>

                        <div className="mt-4 flex justify-center">
                            <div className="inline-flex p-1 bg-neutral-100 rounded-lg">
                                <button
                                    onClick={() => setIsExperienced(false)}
                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${!isExperienced ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                                >
                                    Fresher
                                </button>
                                <button
                                    onClick={() => setIsExperienced(true)}
                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${isExperienced ? 'bg-white text-indigo-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                                >
                                    Experienced
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto space-y-8 bg-neutral-25/30 custom-scrollbar">

                        {/* SECTION 1: IDENTITY */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineUserCircle size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Identity & Contact</span>
                            </div>

                            {/* Full Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel>First Name</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.firstName || ""} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Last Name</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.lastName || ""} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Surname</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.surName || ""} onChange={e => setFormData({ ...formData, surName: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel>Contact Number</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.contactNumber || ""} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Personal Email</InputLabel>
                                    <input type="email" className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.personalEmail || ""} onChange={e => setFormData({ ...formData, personalEmail: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Aadhar Number</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.aadharNumber || ""} onChange={e => setFormData({ ...formData, aadharNumber: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <MyDatePicker label="Date of Birth" selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null} onChange={d => setFormData({ ...formData, dateOfBirth: d?.toISOString().split('T')[0] })} />
                                <div>
                                    <InputLabel>Gender</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })}>
                                        {Object.values(GenderMap).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel>Blood Group</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}>
                                        {Object.values(BloodGroupMap).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel>Marital Status</InputLabel>
                                    <select className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}>
                                        {Object.values(MaritalStatusMap).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: BANK DETAILS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineBuildingLibrary size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Bank Information</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel>Bank Name</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.bankName || ""} onChange={e => setFormData({ ...formData, bankName: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Account Number</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.accountNumber || ""} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: PROFESSIONAL */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineBriefcase size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Professional Info</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel>Designation</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.designation || ""} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                                <div>
                                    <InputLabel>Skill Set</InputLabel>
                                    <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm" value={formData.skillSet || ""} onChange={e => setFormData({ ...formData, skillSet: e.target.value })} />
                                </div>
                            </div>

                            {/* CONDITIONAL EXPERIENCED FIELDS */}
                            {isExperienced && (
                                <div className="space-y-4 p-4 bg-indigo-50/30 rounded-xl border border-indigo-100">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel>UNA Number</InputLabel>
                                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.unaNumber || ""} onChange={e => setFormData({ ...formData, unaNumber: e.target.value })} />
                                        </div>
                                        <div>
                                            <InputLabel>Prev. Role</InputLabel>
                                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.previousRole || ""} onChange={e => setFormData({ ...formData, previousRole: e.target.value })} />
                                        </div>
                                        <div>
                                            <InputLabel>Prev. Company</InputLabel>
                                            <input className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={formData.oldCompanyName || ""} onChange={e => setFormData({ ...formData, oldCompanyName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <MyDatePicker label="From Date" selected={formData.oldCompanyFromDate ? new Date(formData.oldCompanyFromDate) : null} onChange={d => setFormData({ ...formData, oldCompanyFromDate: d?.toISOString().split('T')[0] })} />
                                        <MyDatePicker label="End Date" selected={formData.oldCompanyEndDate ? new Date(formData.oldCompanyEndDate) : null} onChange={d => setFormData({ ...formData, oldCompanyEndDate: d?.toISOString().split('T')[0] })} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 4: DOCUMENTS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineDocumentArrowUp size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Upload {isExperienced ? 'Experience' : 'Academic'} Docs</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FileInput label="Aadhaar Card" id="aadhaarCard" />
                                {isExperienced ? (
                                    <>
                                        <FileInput label="Experience Cert" id="experienceCertificate" />
                                        <FileInput label="Leaving Letter" id="leavingLetter" />
                                    </>
                                ) : (
                                    <>
                                        <FileInput label="Transfer Cert (TC)" id="tc" />
                                        <FileInput label="Offer Letter" id="offerLetter" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SECTION 5: ADDRESSES */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineMapPin size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Address Details</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea placeholder="Present Address" rows={2} className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500" value={formData.presentAddress || ""} onChange={e => setFormData({ ...formData, presentAddress: e.target.value })} />
                                <textarea placeholder="Permanent Address" rows={2} className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500" value={formData.permanentAddress || ""} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} />
                            </div>
                        </div>

                        {/* SECTION 6: FAMILY */}
                        <div className="space-y-4 pb-4">
                            <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
                                <HiOutlineUsers size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Family Information</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Father */}
                                <div className="p-4 bg-white border border-neutral-100 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase">Father's Details</p>
                                        <input type="checkbox" checked={formData.fatherAlive} onChange={e => setFormData({ ...formData, fatherAlive: e.target.checked })} />
                                    </div>
                                    <input placeholder="Name" className="w-full border-b border-neutral-200 py-1 text-sm outline-none" value={formData.fatherName || ""} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                                    <MyDatePicker label="DOB" selected={formData.fatherDateOfBirth ? new Date(formData.fatherDateOfBirth) : null} onChange={d => setFormData({ ...formData, fatherDateOfBirth: d?.toISOString().split('T')[0] })} />
                                    <input placeholder="Occupation" className="w-full border-b border-neutral-200 py-1 text-sm outline-none" value={formData.fatherOccupation || ""} onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })} />
                                </div>
                                {/* Mother */}
                                <div className="p-4 bg-white border border-neutral-100 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase">Mother's Details</p>
                                        <input type="checkbox" checked={formData.motherAlive} onChange={e => setFormData({ ...formData, motherAlive: e.target.checked })} />
                                    </div>
                                    <input placeholder="Name" className="w-full border-b border-neutral-200 py-1 text-sm outline-none" value={formData.motherName || ""} onChange={e => setFormData({ ...formData, motherName: e.target.value })} />
                                    <MyDatePicker label="DOB" selected={formData.motherDateOfBirth ? new Date(formData.motherDateOfBirth) : null} onChange={d => setFormData({ ...formData, motherDateOfBirth: d?.toISOString().split('T')[0] })} />
                                    <input placeholder="Occupation" className="w-full border-b border-neutral-200 py-1 text-sm outline-none" value={formData.motherOccupation || ""} onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 bg-white border-t border-neutral-100 shrink-0">
                        <button
                            onClick={handleSubmit}
                            disabled={loaderState.active}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 uppercase tracking-widest text-[10px] active:scale-[0.98]"
                        >
                            {loaderState.active ? "Processing Records..." : "Submit Records"}
                        </button>
                    </div>
                </div>
            </div>

            {showFailure && (
                <FailureModal title="Submission Failed" message={errorMessage} onClose={() => setShowFailure(false)} />
            )}
        </>
    );
};

export default PersonalDetailsModal;