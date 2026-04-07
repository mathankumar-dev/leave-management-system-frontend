import { authService } from "@/features/auth/api/authApi";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, FailureModal } from "@/shared/components";
import { BloodGroupMap, GenderMap, MaritalStatusMap } from "@/shared/types";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaPrint, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineShieldCheck, HiOutlineIdentification, HiOutlineCreditCard } from "react-icons/hi2";
import { HiCheckCircle } from "react-icons/hi2";

type ExperienceType = 'FRESHER' | 'EXPERIENCED';

const EmployeeProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { profile: backendProfile, loading, fetchEmployeeProfile } = useEmployee();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // ─── Edit mode state ──────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ─── FormData — exact same structure as PersonalDetailsModal ──
  const [formData, setFormData] = useState<any>({
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
    experiences: [],
    uanNumber: "",
  });

  // ─── Files — exact same keys as PersonalDetailsModal ─────────
  const [files, setFiles] = useState<Record<string, File | File[] | null>>({
    idProof: null,
    passportPhoto: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    degreeCertificate: null,
    offerLetter: null,
    relievingLetter: null,
    experienceCerts: null,
  });

  // ─── Aadhar parts ─────────────────────────────────────────────
  const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });

  useEffect(() => {
    if (user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id]);

  useEffect(() => {
    if (backendProfile) {
      setProfile({ ...backendProfile });

      // ─── Pre-fill formData from profile — same fields as PersonalDetailsModal
      const isExp = user?.employeeExperience === "EXPERIENCED";
      setFormData({
        firstName: backendProfile.name?.split(' ')[0] || "",
        lastName: backendProfile.name?.split(' ').slice(1).join(' ') || "",
        contactNumber: backendProfile.contactNumber || "",
        gender: backendProfile.gender || "MALE",
        maritalStatus: (backendProfile as any).maritalStatus || "SINGLE",
        aadharNumber: backendProfile.aadharNumber || "",
        personalEmail: backendProfile.personalEmail || "",
        dateOfBirth: backendProfile.dateOfBirth || "",
        presentAddress: backendProfile.presentAddress || "",
        permanentAddress: backendProfile.permanentAddress || "",
        bloodGroup: backendProfile.bloodGroup || "O_POSITIVE",
        emergencyContactNumber: (backendProfile as any).emergencyContactNumber || "",
        designation: backendProfile.designation || "",
        skillSet: Array.isArray(backendProfile.skillSet)
          ? backendProfile.skillSet.join(", ")
          : backendProfile.skillSet || "",
        accountNumber: (backendProfile as any).accountNumber || "",
        bankName: (backendProfile as any).bankName || "",
        ifscCode: (backendProfile as any).ifscCode || "",
        bankBranchName: (backendProfile as any).bankBranchName || "",
        fatherName: backendProfile.fatherName || "",
        fatherDateOfBirth: (backendProfile as any).fatherDateOfBirth || "",
        fatherOccupation: (backendProfile as any).fatherOccupation || "",
        fatherAlive: (backendProfile as any).fatherAlive ?? true,
        motherName: backendProfile.motherName || "",
        motherDateOfBirth: (backendProfile as any).motherDateOfBirth || "",
        motherOccupation: (backendProfile as any).motherOccupation || "",
        motherAlive: (backendProfile as any).motherAlive ?? true,
        spouseName: (backendProfile as any).spouseName || "",
        spouseDateOfBirth: (backendProfile as any).spouseDateOfBirth || "",
        spouseOccupation: (backendProfile as any).spouseOccupation || "",
        spouseContactNumber: (backendProfile as any).spouseContactNumber || "",
        children: (backendProfile as any).children || [],
        experiences: isExp
          ? ((backendProfile as any).experiencedDocuments || [{ companyName: "", role: "", fromDate: "", endDate: "", lastCompany: true }])
          : [],
        uanNumber: (backendProfile as any).uanNumber || "",
      });

      // Pre-fill aadhar parts
      const aadhar = backendProfile.aadharNumber || "";
      setAadharParts({
        p1: aadhar.slice(0, 4),
        p2: aadhar.slice(4, 8),
        p3: aadhar.slice(8, 12),
      });
    }
  }, [backendProfile]);

  // Sync aadhar parts → formData (same as PersonalDetailsModal)
  useEffect(() => {
    const combined = `${aadharParts.p1}${aadharParts.p2}${aadharParts.p3}`;
    setFormData((prev: any) => ({ ...prev, aadharNumber: combined }));
  }, [aadharParts]);

  const handleAadharChange = (part: keyof typeof aadharParts, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    setAadharParts(prev => ({ ...prev, [part]: sanitized }));
    if (sanitized.length === 4) {
      if (part === "p1") document.getElementById("edit-aadhar-p2")?.focus();
      if (part === "p2") document.getElementById("edit-aadhar-p3")?.focus();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleMultiFileChange = (key: string, fileList: FileList | null) => {
    if (fileList) {
      setFiles(prev => ({ ...prev, [key]: Array.from(fileList) }));
    }
  };

  // ─── Save handler — exact same logic as PersonalDetailsModal ──
  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const isExp = user?.employeeExperience === "EXPERIENCED";
      const type: ExperienceType = isExp ? "EXPERIENCED" : "FRESHER";

      // Same payload logic as PersonalDetailsModal
      const { experiences, uanNumber, ...restOfData } = formData;
      const payload = type === "EXPERIENCED"
        ? { ...formData }
        : { ...restOfData };

      await authService.updateProfileDetails(String(user.id), type, payload, files);

      // Refresh profile
      const updated = await authService.getEmployeeProfile(user.id);
      setUser(updated);
      setIsEditing(false);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Failed to update profile.");
      setShowFailure(true);
    } finally {
      setSaving(false);
    }
  };

  
  if (loading || !profile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <CustomLoader label="Securing Profile Data..." />
      </div>
    );
  }

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";

  const isExperienced = user?.employeeExperience === "EXPERIENCED";

  const TABS = [
    { id: "details", label: "Details" },
    { id: "personal", label: "Personal" },
    { id: "address", label: "Address" },
    { id: "financial", label: "Financial" },
    { id: "employment", label: "Employment" },
    { id: "family", label: "Family" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-0">

        {/* ── TOP HEADER CARD ── */}
        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-black text-rose-500 shrink-0 border-2 border-rose-200">
              {profile.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-slate-400 text-sm" />
                  <FaEnvelope className="text-slate-400 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <HiOutlineOfficeBuilding className="text-slate-400" />
                  {profile.designation || "Executive Associate"}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineLocationMarker className="text-slate-400" />
                  {formatDate(profile.joiningDate)}
                </span>
                <StatusBadge status={profile.verificationStatus} />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <FaPrint className="text-xs text-slate-400" /> Print
              </button>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <FaEdit className="text-xs" /> Edit
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50">
                    {saving ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave className="text-xs" />}
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
            <HiOutlineShieldCheck className="text-slate-300" />
            Verification Status:
            <span className="font-semibold text-slate-500">{profile.verificationStatus || "PENDING"}</span>
            {isEditing && (
              <span className="ml-auto px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold">EDITING MODE</span>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white border-x border-slate-200 border-b">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="p-6">

              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField label="Phone Number" field="contactNumber" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                      <FormField label="Email" value={profile.email} />
                      <EditableField label="Personal Email" field="personalEmail" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                      <EditableField label="Emergency Contact" field="emergencyContactNumber" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                      <SelectField label="Gender" field="gender" options={Object.values(GenderMap)} isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={profile.gender} />
                      <SelectField label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={profile.bloodGroup} formatOption={v => v.replace('_', ' ')} />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField label="Designation" field="designation" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                      <FormField label="Role" value={(profile as any).role} />
                      <FormField label="Manager" value={profile.reportingName} />
                      <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                      <FormField label="Experience Type" value={(profile as any).employeeExperience} />
                      <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      {isEditing ? (
                        <input className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="React, Spring Boot, MySQL" value={formData.skillSet} onChange={e => handleInputChange('skillSet', e.target.value)} />
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skillSet?.map((s: string, i: number) => (
                            <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PERSONAL TAB */}
              {activeTab === "personal" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><HiOutlineIdentification /> Personal Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="First Name" field="firstName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <EditableField label="Last Name" field="lastName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <SelectField label="Gender" field="gender" options={Object.values(GenderMap)} isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={profile.gender} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <input type="date" className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none" value={formData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                    )}
                    <SelectField label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={profile.bloodGroup} formatOption={v => v.replace('_', ' ')} />
                    <SelectField label="Marital Status" field="maritalStatus" options={Object.values(MaritalStatusMap)} isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={(profile as any).maritalStatus} />
                    {/* Aadhar */}
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 col-span-full">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar Number</label>
                        <div className="flex items-center gap-3">
                          {(['p1', 'p2', 'p3'] as const).map((p, i) => (
                            <React.Fragment key={p}>
                              {i > 0 && <span className="text-slate-300">-</span>}
                              <input id={`edit-aadhar-${p}`} placeholder="XXXX" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-mono tracking-widest" value={aadharParts[p]} onChange={e => handleAadharChange(p, e.target.value)} />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <FormField label="Aadhar Number" value={profile.aadharNumber ? `****-****-${profile.aadharNumber.slice(-4)}` : "-"} />
                    )}
                  </div>
                </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><HiOutlineLocationMarker /> Address Registry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present Residence</p>
                      {isEditing ? (
                        <textarea rows={3} className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none resize-none" value={formData.presentAddress} onChange={e => handleInputChange('presentAddress', e.target.value)} />
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">{profile.presentAddress || <span className="text-slate-300 italic">Not Specified</span>}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Registry</p>
                      {isEditing ? (
                        <textarea rows={3} className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none resize-none" value={formData.permanentAddress} onChange={e => handleInputChange('permanentAddress', e.target.value)} />
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">{profile.permanentAddress || <span className="text-slate-300 italic">Not Specified</span>}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FINANCIAL TAB */}
              {activeTab === "financial" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><HiOutlineCreditCard /> Financial Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="Bank Name" field="bankName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <EditableField label="Account Number" field="accountNumber" isEditing={isEditing} formData={formData} onChange={handleInputChange} displayValue={!isEditing && formData.accountNumber ? `****${formData.accountNumber.slice(-4)}` : undefined} />
                    <EditableField label="IFSC Code" field="ifscCode" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <EditableField label="Branch Name" field="bankBranchName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <FormField label="PF Number" value={(profile as any).pfNumber} />
                    {isExperienced && <EditableField label="UAN Number" field="uanNumber" isEditing={isEditing} formData={formData} onChange={handleInputChange} />}
                  </div>
                </div>
              )}

              {/* EMPLOYMENT TAB */}
              {activeTab === "employment" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><HiOutlineOfficeBuilding /> Employment Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="Designation" field="designation" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                    <FormField label="Experience Type" value={(profile as any).employeeExperience} />
                    <FormField label="Manager" value={profile.reportingName} />
                    <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                    <FormField label="VPN Status" value={(profile as any).vpnStatus} />
                  </div>
                  {isExperienced && (
                    <div className="mt-6 space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience History</p>
                      {formData.experiences?.map((exp: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-2 gap-3">
                          <EditableField label="Company Name" field={`exp_${idx}_companyName`} isEditing={isEditing}
                            formData={{ [`exp_${idx}_companyName`]: exp.companyName }}
                            onChange={(_, v) => {
                              const exps = [...formData.experiences];
                              exps[idx].companyName = v;
                              handleInputChange('experiences', exps);
                            }} />
                          <EditableField label="Role" field={`exp_${idx}_role`} isEditing={isEditing}
                            formData={{ [`exp_${idx}_role`]: exp.role }}
                            onChange={(_, v) => {
                              const exps = [...formData.experiences];
                              exps[idx].role = v;
                              handleInputChange('experiences', exps);
                            }} />
                          <FormField label="From" value={exp.fromDate} />
                          <FormField label="To" value={exp.endDate} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                    {isEditing ? (
                      <input className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none" placeholder="React, Spring Boot" value={formData.skillSet} onChange={e => handleInputChange('skillSet', e.target.value)} />
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillSet?.map((s: string, i: number) => (
                          <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAMILY TAB */}
              {activeTab === "family" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Father */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Father's Details</h3>
                      {isEditing && <label className="flex items-center gap-2 text-xs text-slate-500">Alive? <input type="checkbox" checked={formData.fatherAlive} onChange={e => handleInputChange('fatherAlive', e.target.checked)} /></label>}
                    </div>
                    <EditableField label="Name" field="fatherName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <input type="date" className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm" value={formData.fatherDateOfBirth} onChange={e => handleInputChange('fatherDateOfBirth', e.target.value)} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate((profile as any).fatherDateOfBirth)} />
                    )}
                    <EditableField label="Occupation" field="fatherOccupation" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                  </div>

                  {/* Mother */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Mother's Details</h3>
                      {isEditing && <label className="flex items-center gap-2 text-xs text-slate-500">Alive? <input type="checkbox" checked={formData.motherAlive} onChange={e => handleInputChange('motherAlive', e.target.checked)} /></label>}
                    </div>
                    <EditableField label="Name" field="motherName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <input type="date" className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm" value={formData.motherDateOfBirth} onChange={e => handleInputChange('motherDateOfBirth', e.target.value)} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate((profile as any).motherDateOfBirth)} />
                    )}
                    <EditableField label="Occupation" field="motherOccupation" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                  </div>

                  {/* Spouse (if married) */}
                  {(formData.maritalStatus === "MARRIED" || (profile as any).maritalStatus === "MARRIED") && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 md:col-span-2">
                      <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Spouse Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Spouse Name" field="spouseName" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                        <EditableField label="Contact Number" field="spouseContactNumber" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Document Uploads</h3>
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <FileRow label="ID Proof (Aadhar/PAN)" fileKey="idProof" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                      <FileRow label="Passport Photo" fileKey="passportPhoto" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                      {!isExperienced ? (
                        <>
                          <FileRow label="10th Marksheet" fileKey="tenthMarksheet" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                          <FileRow label="12th Marksheet" fileKey="twelfthMarksheet" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                          <FileRow label="Degree Certificate" fileKey="degreeCertificate" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                          <FileRow label="Offer Letter" fileKey="offerLetter" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                        </>
                      ) : (
                        <>
                          <FileRow label="Relieving Letter" fileKey="relievingLetter" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} required />
                          <FileRow label="Experience Certificates" fileKey="experienceCerts" files={files} onFile={handleFileChange} onMultiFile={handleMultiFileChange} multiple />
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Click Edit to upload or update documents.</p>
                  )}
                </div>
              )}

              {/* VERIFICATION WARNING */}
              <AnimatePresence>
                {profile.verificationStatus === "REJECTED" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0"><HiOutlineShieldCheck size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">HR Review Required</p>
                      <p className="text-sm font-semibold text-rose-800">"{(profile as any).hrRemarks}"</p>
                      <p className="text-xs text-rose-500 mt-1">Please update your records and resubmit for verification.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showFailure && <FailureModal title="Update Failed" message={errorMessage} onClose={() => setShowFailure(false)} />}
    </>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────── */

const FormField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
      {value || <span className="text-slate-300 italic text-xs">Not Specified</span>}
    </div>
  </div>
);

const EditableField = ({ label, field, isEditing, formData, onChange, displayValue }: {
  label: string; field: string; isEditing: boolean;
  formData: any; onChange: (field: string, value: any) => void;
  displayValue?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <input className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-9" value={formData[field] || ""} onChange={e => onChange(field, e.target.value)} placeholder={label} />
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
        {displayValue || formData[field] || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

const SelectField = ({ label, field, options, isEditing, formData, onChange, displayValue, formatOption }: {
  label: string; field: string; options: string[]; isEditing: boolean;
  formData: any; onChange: (field: string, value: any) => void;
  displayValue?: string | null; formatOption?: (v: string) => string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <select className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none" value={formData[field]} onChange={e => onChange(field, e.target.value)}>
        {options.map(v => <option key={v} value={v}>{formatOption ? formatOption(v) : v}</option>)}
      </select>
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
        {displayValue || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

const FileRow = ({ label, fileKey, files, onFile, onMultiFile, required = false, multiple = false }: {
  label: string; fileKey: string; files: Record<string, File | File[] | null>;
  onFile: (key: string, file: File | null) => void;
  onMultiFile: (key: string, list: FileList | null) => void;
  required?: boolean; multiple?: boolean;
}) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl group hover:border-indigo-200 transition-all">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`p-2 rounded-lg shrink-0 ${files[fileKey] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
        <HiCheckCircle size={16} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label} {required && <span className="text-red-500">*</span>}</p>
        <p className="text-[10px] text-slate-400 truncate">
          {Array.isArray(files[fileKey]) ? `${(files[fileKey] as File[]).length} files` : (files[fileKey] as File)?.name || "Not uploaded"}
        </p>
      </div>
    </div>
    <label className="cursor-pointer shrink-0 bg-slate-50 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border border-slate-200 text-slate-600">
      {files[fileKey] ? "CHANGE" : "UPLOAD"}
      <input type="file" hidden multiple={multiple} onChange={e => multiple ? onMultiFile(fileKey, e.target.files) : onFile(fileKey, e.target.files?.[0] || null)} />
    </label>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const config: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
    UNKNOWN: "bg-slate-50 text-slate-400 border-slate-200",
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${config[status || "UNKNOWN"] || config.UNKNOWN}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export default EmployeeProfile;