import logo from '@/assets/images/bg-rm-logo-HRES.png';
import { authService } from "@/features/auth/api/authApi";
import type {
    ExperiencedPersonalDetailsRequest,
    FresherPersonalDetailsRequest,
} from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { FailureModal, Loader } from "@/shared/components";
import { useEffect, useState } from "react";
import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCloudArrowUp,
    HiOutlineDocumentText,
    HiOutlineUserCircle,
    HiOutlineUsers,
    HiPlus,
    HiTrash,
} from "react-icons/hi2";

type PersonalDetailsForm = FresherPersonalDetailsRequest & Partial<ExperiencedPersonalDetailsRequest>;

const PersonalDetailsModal = () => {
    const { user } = useAuth();
    const isExperienced = user?.employeeExperience === "EXPERIENCED";
    const submissionType = isExperienced ? "EXPERIENCED" : "FRESHER";

    const [formData, setFormData] = useState<Partial<PersonalDetailsForm>>({
        firstName: "",
        lastName: "",
        contactNumber: "",
        gender: "MALE",
        maritalStatus: "SINGLE",
        aadharNumber: "",
        personalEmail: "",
        dateOfBirth: "",
        presentAddress: "",
        permanentAddress: "",
        bloodGroup: "O_POSITIVE",
        emergencyContactNumber: "",
        designation: "",
        skillSet: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        bankBranchName: "",
        fatherName: "",
        fatherDateOfBirth: "",
        fatherOccupation: "",
        fatherAlive: true,
        motherName: "",
        motherDateOfBirth: "",
        motherOccupation: "",
        motherAlive: true,
        spouseName: "",
        spouseDateOfBirth: "",
        spouseOccupation: "",
        spouseContactNumber: "",
        children: [],
        experiences: isExperienced ? [{ companyName: "", role: "", fromDate: "", endDate: "", lastCompany: true }] : [],
        uanNumber: ""
    });

    const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });
    const [files, setFiles] = useState<Record<string, File | File[] | null>>({});
    const [loaderState, setLoaderState] = useState({ active: false, finished: false });
    const [showFailure, setShowFailure] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const combined = `${aadharParts.p1}${aadharParts.p2}${aadharParts.p3}`;
        setFormData(prev => ({ ...prev, aadharNumber: combined }));
    }, [aadharParts]);

    const handleAadharChange = (part: keyof typeof aadharParts, value: string) => {
        const sanitized = value.replace(/\D/g, "").slice(0, 4);
        setAadharParts(prev => ({ ...prev, [part]: sanitized }));
    };

    const handleInputChange = (field: keyof PersonalDetailsForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (key: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleMultiFileChange = (key: string, fileList: FileList | null) => {
        if (fileList) {
            setFiles(prev => ({ ...prev, [key]: Array.from(fileList) }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (!user?.id) return;

            // 1. Determine required files based on type
            const requiredFiles = submissionType === "FRESHER"
                ? ["idProof", "passportPhoto", "tenthMarksheet", "twelfthMarksheet", "degreeCertificate", "offerLetter"]
                : ["idProof", "passportPhoto", "relievingLetter"];

            const missing = requiredFiles.filter(k => !files[k]);
            if (missing.length > 0) {
                setErrorMessage(`Missing required files: ${missing.join(", ")}`);
                setShowFailure(true);
                return;
            }

            setLoaderState({ active: true, finished: false });

            // 2. CREATE A CLEAN DATA OBJECT
            // We spread the current formData but explicitly handle the conditional fields
            const { experiences, uanNumber, ...restOfData } = formData;

            const payload = submissionType === "EXPERIENCED"
                ? { ...formData } // Include everything for experienced
                : { ...restOfData }; // EXCLUDE experiences and uanNumber for freshers


            // 3. Send the cleaned payload
            await authService.submitMultipartDetails(
                user.id,
                submissionType,
                payload, // Use the cleaned object here
                files
            );

            setLoaderState({ active: true, finished: true });
        } catch (err: any) {
            setLoaderState({ active: false, finished: false });
            setErrorMessage(err.response?.data?.message || "Submission failed. Please check all fields.");
            setShowFailure(true);
        }
    };

    const InputLabel = ({ children }: { children: React.ReactNode }) => (
        <label className="text-[10px] font-black text-neutral-500 tracking-widest mb-1 block ">
            {children}
        </label>
    );

    const FileRow = ({ label, fileKey, required = false, multiple = false }: { label: string, fileKey: string, required?: boolean, multiple?: boolean }) => (
        <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg shrink-0 ${files[fileKey] ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                    <HiOutlineDocumentText size={18} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-neutral-700  tracking-tight">{label} {required && <span className="text-red-500">*</span>}</p>
                    <p className="text-[10px] text-neutral-400 truncate">
                        {Array.isArray(files[fileKey]) ? `${(files[fileKey] as File[]).length} files` : (files[fileKey] as File)?.name || "Not uploaded"}
                    </p>
                </div>
            </div>
            <label className="cursor-pointer shrink-0 bg-neutral-50 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all border border-neutral-200">
                {files[fileKey] ? "CHANGE" : "UPLOAD"}
                <input type="file" hidden multiple={multiple} onChange={(e) => multiple ? handleMultiFileChange(fileKey, e.target.files) : handleFileChange(fileKey, e.target.files?.[0] || null)} />
            </label>
        </div>
    );

    return (
        <>
            {loaderState.active && (
                <Loader message="Syncing WeHRM Profile..." isFinished={loaderState.finished} onFinished={() => window.location.reload()} />
            )}

            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full flex flex-col max-h-[90vh] overflow-hidden">

                    {/* HEADER */}
                    <div className="p-6 border-b flex justify-between items-center bg-neutral-50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10  rounded-xl flex items-center justify-center"><img src={logo} alt="" /></div>
                            {/* <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200 text-xl">W</div> */}
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Onboarding Profile</h3>
                                <p className="text-[10px] text-indigo-600 font-bold  tracking-widest italic">Secure Data Sync</p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-tighter border border-indigo-200">
                            {submissionType} MODE
                        </span>
                    </div>

                    <div className="p-8 overflow-y-auto space-y-12 custom-scrollbar bg-white">

                        {/* 1. DOCUMENTS SECTION */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 border-r border-neutral-100 pr-6">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <HiOutlineCloudArrowUp size={22} /> <span className="font-bold text-xs uppercase tracking-widest">Digital Vault</span>
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed italic">Upload required documentation. All files are encrypted during transit.</p>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FileRow label="ID Proof (Aadhar/PAN)" fileKey="idProof" required />
                                <FileRow label="Passport Photo" fileKey="passportPhoto" required />

                                {/* Shared required for Freshers / Optional for experienced as per your logic */}
                                <FileRow label="10th Marksheet" fileKey="tenthMarksheet" required={!isExperienced} />
                                <FileRow label="12th Marksheet" fileKey="twelfthMarksheet" required={!isExperienced} />
                                <FileRow label="Degree Certificate" fileKey="degreeCertificate" required={!isExperienced} />
                                <FileRow label="Offer Letter" fileKey="offerLetter" required={!isExperienced} />

                                {isExperienced && (
                                    <>
                                        <FileRow label="Relieving Letter" fileKey="relievingLetter" required />
                                        <FileRow label="Exp. Certificates" fileKey="experienceCerts" multiple />
                                    </>
                                )}
                            </div>
                        </section>

                        {/* 2. CORE IDENTITY */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-10">
                            <div className="md:col-span-1 border-r border-neutral-100 pr-6">
                                <div className="flex items-center gap-2 text-indigo-600 mb-6">
                                    <HiOutlineUserCircle size={22} /> <span className="font-bold text-xs uppercase tracking-widest">Core Identity</span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel>Designation</InputLabel>
                                        <input className="w-full border rounded-xl p-3 text-sm bg-neutral-50 font-bold" value={formData.designation} onChange={e => handleInputChange('designation', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputLabel>Aadhar Number</InputLabel>
                                        <div className="flex gap-2">
                                            {(['p1', 'p2', 'p3'] as const).map((p) => (
                                                <input key={p} className="w-full text-center border rounded-xl p-3 font-mono text-sm outline-none focus:border-indigo-500" maxLength={4} value={aadharParts[p]} onChange={e => handleAadharChange(p, e.target.value)} />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel>Skills (Comma separated)</InputLabel>
                                        <input className="w-full border rounded-xl p-3 text-sm" placeholder="React, Spring, etc" value={formData.skillSet} onChange={e => handleInputChange('skillSet', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><InputLabel>First Name</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} /></div>
                                    <div><InputLabel>Last Name</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><InputLabel>Personal Email</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.personalEmail} onChange={e => handleInputChange('personalEmail', e.target.value)} /></div>
                                    <div><InputLabel>Contact Number</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.contactNumber} onChange={e => handleInputChange('contactNumber', e.target.value)} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div><InputLabel>DOB</InputLabel><input type="date" className="w-full border rounded-xl p-3 text-sm" value={formData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} /></div>
                                    <div>
                                        <InputLabel>Gender</InputLabel>
                                        <select className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.gender} onChange={e => handleInputChange('gender', e.target.value as any)}>
                                            <option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="OTHER">OTHER</option>
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel>Blood Group</InputLabel>
                                        <select className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.bloodGroup} onChange={e => handleInputChange('bloodGroup', e.target.value as any)}>
                                            <option value="O_POSITIVE">O+</option><option value="O_NEGATIVE">O-</option>
                                            <option value="A_POSITIVE">A+</option><option value="A_NEGATIVE">A-</option>
                                            <option value="B_POSITIVE">B+</option><option value="B_NEGATIVE">B-</option>
                                            <option value="AB_POSITIVE">AB+</option><option value="AB_NEGATIVE">AB-</option>
                                        </select>
                                    </div>
                                </div>
                                <div><InputLabel>Present Address</InputLabel><textarea rows={2} className="w-full border rounded-xl p-3 text-sm" value={formData.presentAddress} onChange={e => handleInputChange('presentAddress', e.target.value)} /></div>
                                <div><InputLabel>Permanent Address</InputLabel><textarea rows={2} className="w-full border rounded-xl p-3 text-sm" value={formData.permanentAddress} onChange={e => handleInputChange('permanentAddress', e.target.value)} /></div>
                            </div>
                        </section>

                        {/* 3. FAMILY */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-10">
                            <div className="md:col-span-1 border-r border-neutral-100 pr-6">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <HiOutlineUsers size={22} /> <span className="font-bold text-xs uppercase tracking-widest">Family</span>
                                </div>
                                <p className="text-xs text-neutral-400 italic">Beneficiary details for payroll and health insurance.</p>
                            </div>
                            <div className="md:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                                        <div className="flex justify-between items-center mb-3"><InputLabel>Father's Details</InputLabel> <input type="checkbox" checked={formData.fatherAlive} onChange={e => handleInputChange('fatherAlive', e.target.checked)} /></div>
                                        <input placeholder="Name" className="w-full border rounded-xl p-3 text-sm bg-white mb-3" value={formData.fatherName} onChange={e => handleInputChange('fatherName', e.target.value)} />
                                        <input type="date" className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.fatherDateOfBirth} onChange={e => handleInputChange('fatherDateOfBirth', e.target.value)} />
                                    </div>
                                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                                        <div className="flex justify-between items-center mb-3"><InputLabel>Mother's Details</InputLabel> <input type="checkbox" checked={formData.motherAlive} onChange={e => handleInputChange('motherAlive', e.target.checked)} /></div>
                                        <input placeholder="Name" className="w-full border rounded-xl p-3 text-sm bg-white mb-3" value={formData.motherName} onChange={e => handleInputChange('motherName', e.target.value)} />
                                        <input type="date" className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.motherDateOfBirth} onChange={e => handleInputChange('motherDateOfBirth', e.target.value)} />
                                    </div>
                                </div>

                                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <InputLabel>Marital Status</InputLabel>
                                        <select className="border rounded-lg px-2 py-1 text-xs font-bold" value={formData.maritalStatus} onChange={e => handleInputChange('maritalStatus', e.target.value as any)}>
                                            <option value="SINGLE">SINGLE</option><option value="MARRIED">MARRIED</option>
                                        </select>
                                    </div>
                                    {formData.maritalStatus === "MARRIED" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Spouse Name" className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.spouseName} onChange={e => handleInputChange('spouseName', e.target.value)} />
                                            <input placeholder="Spouse Contact" className="w-full border rounded-xl p-3 text-sm bg-white" value={formData.spouseContactNumber} onChange={e => handleInputChange('spouseContactNumber', e.target.value)} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <InputLabel>Children ({formData.children?.length || 0})</InputLabel>
                                        <button onClick={() => setFormData(p => ({ ...p, children: [...(p.children || []), { childName: "", gender: "MALE", age: 0 }] }))} className="text-indigo-600 text-[10px] font-black flex items-center gap-1 hover:underline"><HiPlus /> ADD CHILD</button>
                                    </div>
                                    {formData.children?.map((child, idx) => (
                                        <div key={idx} className="flex gap-4 items-end bg-neutral-50 p-4 rounded-2xl relative border border-neutral-100">
                                            <div className="flex-1">
                                                <InputLabel>Name</InputLabel>
                                                <input className="w-full border rounded-xl p-2.5 text-xs bg-white" value={child.childName} onChange={e => {
                                                    const children = [...(formData.children || [])];
                                                    children[idx].childName = e.target.value;
                                                    setFormData({ ...formData, children });
                                                }} />
                                            </div>
                                            <div className="w-24">
                                                <InputLabel>Age</InputLabel>
                                                <input
                                                    type="number"
                                                    className="w-full border rounded-xl p-2.5 text-xs bg-white"
                                                    value={child.age}
                                                    onChange={e => {
                                                        const children = [...(formData.children || [])];
                                                        children[idx].age = Number(e.target.value);
                                                        setFormData({ ...formData, children });
                                                    }}
                                                />
                                            </div>
                                            <button onClick={() => setFormData(p => ({ ...p, children: p.children?.filter((_, i) => i !== idx) }))} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><HiTrash size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 4. EXPERIENCE HISTORY (EXPERIENCED ONLY) */}
                        {isExperienced && (
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-10">
                                <div className="md:col-span-1 border-r border-neutral-100 pr-6">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                        <HiOutlineBriefcase size={22} /> <span className="font-bold text-xs uppercase tracking-widest">Experience</span>
                                    </div>
                                    <div className="mt-6">
                                        <InputLabel>UAN Number</InputLabel>
                                        <input placeholder="10XXXXXXXXXX" className="w-full border rounded-xl p-3 text-sm font-mono" value={formData.uanNumber} onChange={e => handleInputChange('uanNumber', e.target.value)} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex justify-end">
                                        <button onClick={() => setFormData(p => ({ ...p, experiences: [...(p.experiences || []), { companyName: "", role: "", fromDate: "", endDate: "", lastCompany: false }] }))} className="px-4 py-2 bg-neutral-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-black transition-all">Add Company</button>
                                    </div>
                                    {formData.experiences?.map((exp, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 relative">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 mr-4">
                                                    <InputLabel>Company Name</InputLabel>
                                                    <input className="w-full border rounded-xl p-3 text-sm" value={exp.companyName} onChange={e => {
                                                        const exps = [...(formData.experiences || [])];
                                                        exps[idx].companyName = e.target.value;
                                                        setFormData({ ...formData, experiences: exps });
                                                    }} />
                                                </div>
                                                <button onClick={() => setFormData(p => ({ ...p, experiences: p.experiences?.filter((_, i) => i !== idx) }))} className="p-3 text-neutral-400 hover:text-red-500 transition-colors"><HiTrash size={18} /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel>Role</InputLabel>
                                                    <input className="w-full border rounded-xl p-3 text-sm" value={exp.role} onChange={e => {
                                                        const exps = [...(formData.experiences || [])];
                                                        exps[idx].role = e.target.value;
                                                        setFormData({ ...formData, experiences: exps });
                                                    }} />
                                                </div>
                                                <div className="flex items-center gap-2 pt-6 italic font-bold text-indigo-600 text-[10px] uppercase">
                                                    <input type="checkbox" checked={exp.lastCompany} onChange={e => {
                                                        const exps = [...(formData.experiences || [])].map(item => ({ ...item, lastCompany: false }));
                                                        exps[idx].lastCompany = e.target.checked;
                                                        setFormData({ ...formData, experiences: exps });
                                                    }} /> IS LAST COMPANY
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><InputLabel>From Date</InputLabel><input type="date" className="w-full border rounded-xl p-3 text-sm" value={exp.fromDate} onChange={e => {
                                                    const exps = [...(formData.experiences || [])];
                                                    exps[idx].fromDate = e.target.value;
                                                    setFormData({ ...formData, experiences: exps });
                                                }} /></div>
                                                <div><InputLabel>End Date</InputLabel><input type="date" className="w-full border rounded-xl p-3 text-sm" value={exp.endDate} onChange={e => {
                                                    const exps = [...(formData.experiences || [])];
                                                    exps[idx].endDate = e.target.value;
                                                    setFormData({ ...formData, experiences: exps });
                                                }} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 5. BANKING */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-10">
                            <div className="md:col-span-1 border-r border-neutral-100 pr-6">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <HiOutlineBanknotes size={22} /> <span className="font-bold text-xs  tracking-widest">Banking</span>
                                </div>
                                <p className="text-xs text-neutral-400 italic">Accurate bank details ensure automated salary credits.</p>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="col-span-2"><InputLabel>Bank Name</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} /></div>
                                <div><InputLabel>Account Number</InputLabel><input className="w-full border rounded-xl p-3 text-sm font-mono" value={formData.accountNumber} onChange={e => handleInputChange('accountNumber', e.target.value)} /></div>
                                <div><InputLabel>IFSC Code</InputLabel><input className="w-full border rounded-xl p-3 text-sm font-mono uppercase" value={formData.ifscCode} onChange={e => handleInputChange('ifscCode', e.target.value.toUpperCase())} /></div>
                                <div className="col-span-2"><InputLabel>Branch Name</InputLabel><input className="w-full border rounded-xl p-3 text-sm" value={formData.bankBranchName} onChange={e => handleInputChange('bankBranchName', e.target.value)} /></div>
                            </div>
                        </section>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="p-6 border-t bg-neutral-50 shrink-0">
                        <button onClick={handleSubmit} className="w-full bg-neutral-900 text-white font-black py-5 rounded-2xl text-[10px] tracking-widest uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2">
                            Finalize Profile & Sync with WeHRM
                        </button>
                    </div>
                </div>
            </div>

            {showFailure && <FailureModal title="Sync Error" message={errorMessage} onClose={() => setShowFailure(false)} />}
        </>
    );
};

export default PersonalDetailsModal;