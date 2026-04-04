import { authService } from "@/features/auth/api/authApi";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, FailureModal } from "@/shared/components";
import MyDatePicker from "@/shared/components/datepicker/MyDatePicker";
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

  // ─── Form data — same structure as PersonalDetailsModal ───────
  const [formData, setFormData] = useState<any>({});
  const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });
  const [files, setFiles] = useState<Record<string, File | null>>({
    aadhaarCard: null,
    tc: null,
    offerLetter: null,
    experienceCertificate: null,
    leavingLetter: null,
  });

  useEffect(() => {
    if (user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id]);

  useEffect(() => {
    if (backendProfile) {
      setProfile({ ...backendProfile });
      // Pre-fill formData from profile
      setFormData({
        firstName: backendProfile.name?.split(' ')[0] || "",
        lastName: backendProfile.name?.split(' ').slice(1).join(' ') || "",
        contactNumber: backendProfile.contactNumber || "",
        personalEmail: backendProfile.personalEmail || "",
        aadharNumber: backendProfile.aadharNumber || "",
        gender: backendProfile.gender || "MALE",
        bloodGroup: backendProfile.bloodGroup || "O_POSITIVE",
        maritalStatus: (backendProfile as any).maritalStatus || "SINGLE",
        dateOfBirth: backendProfile.dateOfBirth || "",
        presentAddress: backendProfile.presentAddress || "",
        permanentAddress: backendProfile.permanentAddress || "",
        designation: backendProfile.designation || "",
        skillSet: Array.isArray(backendProfile.skillSet)
          ? backendProfile.skillSet.join(", ")
          : backendProfile.skillSet || "",
        bankName: (backendProfile as any).bankName || "",
        accountNumber: (backendProfile as any).accountNumber || "",
        fatherName: backendProfile.fatherName || "",
        fatherDateOfBirth: (backendProfile as any).fatherDateOfBirth || "",
        fatherOccupation: (backendProfile as any).fatherOccupation || "",
        fatherAlive: (backendProfile as any).fatherAlive ?? true,
        motherName: backendProfile.motherName || "",
        motherDateOfBirth: (backendProfile as any).motherDateOfBirth || "",
        motherOccupation: (backendProfile as any).motherOccupation || "",
        motherAlive: (backendProfile as any).motherAlive ?? true,
        unaNumber: (backendProfile as any).unaNumber || "",
        previousRole: (backendProfile as any).previousRole || "",
        oldCompanyName: (backendProfile as any).oldCompanyName || "",
        oldCompanyFromDate: (backendProfile as any).oldCompanyFromDate || "",
        oldCompanyEndDate: (backendProfile as any).oldCompanyEndDate || "",
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

  // Sync aadhar parts → formData
  useEffect(() => {
    const combined = `${aadharParts.p1}${aadharParts.p2}${aadharParts.p3}`;
    setFormData((prev: any) => ({ ...prev, aadharNumber: combined }));
  }, [aadharParts]);

  const handleAadharChange = (part: keyof typeof aadharParts, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    setAadharParts(prev => ({ ...prev, [part]: cleaned }));
    if (cleaned.length === 4) {
      if (part === "p1") document.getElementById("edit-aadhar-p2")?.focus();
      if (part === "p2") document.getElementById("edit-aadhar-p3")?.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  // ─── Save handler ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const isExperienced = (user as any)?.employeeExperience === "EXPERIENCED";
      const type: ExperienceType = isExperienced ? "EXPERIENCED" : "FRESHER";
      await authService.updateProfileDetails(String(user.id), type, formData, files);
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

  const isExperienced = (user as any)?.employeeExperience === "EXPERIENCED";

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

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-black text-rose-500 shrink-0 border-2 border-rose-200">
              {profile.name?.charAt(0)}
            </div>

            {/* Name + meta */}
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

            {/* Action buttons */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <FaPrint className="text-xs text-slate-400" /> Print
              </button>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <FaEdit className="text-xs" /> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {saving
                      ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <FaSave className="text-xs" />
                    }
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
            <HiOutlineShieldCheck className="text-slate-300" />
            Verification Status:
            <span className="font-semibold text-slate-500">{profile.verificationStatus || "PENDING"}</span>
            {isEditing && (
              <span className="ml-auto px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold">
                EDITING MODE
              </span>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white border-x border-slate-200 border-b">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/30"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="p-6"
            >

              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField label="Phone Number" value={formData.contactNumber} field="contactNumber" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                      <FormField label="Email" value={profile.email} />
                      <EditableField label="Personal Email" value={formData.personalEmail} field="personalEmail" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                      <EditableField label="Emergency Contact" value={formData.emergencyContactNumber} field="emergencyContactNumber" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                            {Object.values(GenderMap).map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      ) : (
                        <FormField label="Gender" value={profile.gender} />
                      )}
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
                          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}>
                            {Object.values(BloodGroupMap).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                          </select>
                        </div>
                      ) : (
                        <FormField label="Blood Group" value={profile.bloodGroup} />
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField label="Designation" value={formData.designation} field="designation" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                      <FormField label="Role" value={(profile as any).role} />
                      <FormField label="Manager" value={profile.reportingName} />
                      <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                      <FormField label="Employment Type" value={(profile as any).employeeType} />
                      <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      {isEditing ? (
                        <input
                          className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="e.g. React, Spring Boot, MySQL"
                          value={formData.skillSet}
                          onChange={e => setFormData({ ...formData, skillSet: e.target.value })}
                        />
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
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiOutlineIdentification /> Personal Profile
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="First Name" value={formData.firstName} field="firstName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    <EditableField label="Last Name" value={formData.lastName} field="lastName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                          {Object.values(GenderMap).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    ) : (
                      <FormField label="Gender" value={profile.gender} />
                    )}
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <MyDatePicker label="" selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null} onChange={d => setFormData({ ...formData, dateOfBirth: d?.toISOString().split('T')[0] })} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                    )}
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}>
                          {Object.values(BloodGroupMap).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                    ) : (
                      <FormField label="Blood Group" value={profile.bloodGroup} />
                    )}
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marital Status</label>
                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium" value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                          {Object.values(MaritalStatusMap).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    ) : (
                      <FormField label="Marital Status" value={(profile as any).maritalStatus} />
                    )}

                    {/* Aadhar */}
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 col-span-full">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar Number</label>
                        <div className="flex items-center gap-3">
                          <input id="edit-aadhar-p1" placeholder="XXXX" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-mono tracking-widest" value={aadharParts.p1} onChange={e => handleAadharChange("p1", e.target.value)} />
                          <span className="text-slate-300">-</span>
                          <input id="edit-aadhar-p2" placeholder="XXXX" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-mono tracking-widest" value={aadharParts.p2} onChange={e => handleAadharChange("p2", e.target.value)} />
                          <span className="text-slate-300">-</span>
                          <input id="edit-aadhar-p3" placeholder="XXXX" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-mono tracking-widest" value={aadharParts.p3} onChange={e => handleAadharChange("p3", e.target.value)} />
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
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiOutlineLocationMarker /> Address Registry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present Residence</p>
                      {isEditing ? (
                        <textarea rows={3} className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" value={formData.presentAddress} onChange={e => setFormData({ ...formData, presentAddress: e.target.value })} />
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">
                          {profile.presentAddress || <span className="text-slate-300 italic">Not Specified</span>}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Registry</p>
                      {isEditing ? (
                        <textarea rows={3} className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" value={formData.permanentAddress} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} />
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">
                          {profile.permanentAddress || <span className="text-slate-300 italic">Not Specified</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FINANCIAL TAB */}
              {activeTab === "financial" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiOutlineCreditCard /> Financial Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="Bank Name" value={formData.bankName} field="bankName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    <EditableField label="Account Number" value={formData.accountNumber} field="accountNumber" isEditing={isEditing} formData={formData} setFormData={setFormData} displayValue={!isEditing && formData.accountNumber ? `****${formData.accountNumber.slice(-4)}` : undefined} />
                    <FormField label="PF Number" value={(profile as any).pfNumber} />
                    <EditableField label="UAN Number" value={formData.unaNumber} field="unaNumber" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                  </div>
                </div>
              )}

              {/* EMPLOYMENT TAB */}
              {activeTab === "employment" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiOutlineOfficeBuilding /> Employment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EditableField label="Designation" value={formData.designation} field="designation" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                    <FormField label="Employment Type" value={(profile as any).employeeType} />
                    <FormField label="Manager" value={profile.reportingName} />
                    <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                    <FormField label="VPN Status" value={(profile as any).vpnStatus} />
                    {isExperienced && (
                      <>
                        <EditableField label="Previous Role" value={formData.previousRole} field="previousRole" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                        <EditableField label="Previous Company" value={formData.oldCompanyName} field="oldCompanyName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                      </>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                    {isEditing ? (
                      <input className="w-full bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. React, Spring Boot" value={formData.skillSet} onChange={e => setFormData({ ...formData, skillSet: e.target.value })} />
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
                      {isEditing && (
                        <label className="flex items-center gap-2 text-xs text-slate-500">
                          Alive?
                          <input type="checkbox" checked={formData.fatherAlive} onChange={e => setFormData({ ...formData, fatherAlive: e.target.checked })} />
                        </label>
                      )}
                    </div>
                    <EditableField label="Father's Name" value={formData.fatherName} field="fatherName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <MyDatePicker label="" selected={formData.fatherDateOfBirth ? new Date(formData.fatherDateOfBirth) : null} onChange={d => setFormData({ ...formData, fatherDateOfBirth: d?.toISOString().split('T')[0] })} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate((profile as any).fatherDateOfBirth)} />
                    )}
                    <EditableField label="Occupation" value={formData.fatherOccupation} field="fatherOccupation" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                  </div>

                  {/* Mother */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Mother's Details</h3>
                      {isEditing && (
                        <label className="flex items-center gap-2 text-xs text-slate-500">
                          Alive?
                          <input type="checkbox" checked={formData.motherAlive} onChange={e => setFormData({ ...formData, motherAlive: e.target.checked })} />
                        </label>
                      )}
                    </div>
                    <EditableField label="Mother's Name" value={formData.motherName} field="motherName" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                        <MyDatePicker label="" selected={formData.motherDateOfBirth ? new Date(formData.motherDateOfBirth) : null} onChange={d => setFormData({ ...formData, motherDateOfBirth: d?.toISOString().split('T')[0] })} />
                      </div>
                    ) : (
                      <FormField label="Date of Birth" value={formatDate((profile as any).motherDateOfBirth)} />
                    )}
                    <EditableField label="Occupation" value={formData.motherOccupation} field="motherOccupation" isEditing={isEditing} formData={formData} setFormData={setFormData} />
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Document Uploads</h3>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FileInput label="Aadhaar Card" id="aadhaarCard" files={files} onChange={handleFileChange} />
                      {!isExperienced ? (
                        <>
                          <FileInput label="Transfer Certificate (TC)" id="tc" files={files} onChange={handleFileChange} />
                          <FileInput label="Offer Letter" id="offerLetter" files={files} onChange={handleFileChange} />
                        </>
                      ) : (
                        <>
                          <FileInput label="Experience Certificate" id="experienceCertificate" files={files} onChange={handleFileChange} />
                          <FileInput label="Leaving Letter" id="leavingLetter" files={files} onChange={handleFileChange} />
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                      <HiOutlineShieldCheck size={20} />
                    </div>
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

      {showFailure && (
        <FailureModal title="Update Failed" message={errorMessage} onClose={() => setShowFailure(false)} />
      )}
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

const EditableField = ({
  label, value, field, isEditing, formData, setFormData, displayValue
}: {
  label: string;
  value?: string | null;
  field: string;
  isEditing: boolean;
  formData: any;
  setFormData: (d: any) => void;
  displayValue?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <input
        className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-9"
        value={formData[field] || ""}
        onChange={e => setFormData({ ...formData, [field]: e.target.value })}
        placeholder={label}
      />
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
        {displayValue || value || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

const FileInput = ({ label, id, files, onChange }: {
  label: string;
  id: string;
  files: Record<string, File | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-slate-500 tracking-widest mb-1 block uppercase">{label}</label>
    <div className="relative">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={e => onChange(e, id)}
        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
      />
      {files[id] && (
        <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 mt-1">
          <HiCheckCircle /> {files[id]?.name}
        </span>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const config: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
    UNKNOWN: "bg-slate-50 text-slate-400 border-slate-200",
  };
  const style = config[status || "UNKNOWN"] || config.UNKNOWN;
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${style}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export default EmployeeProfile;