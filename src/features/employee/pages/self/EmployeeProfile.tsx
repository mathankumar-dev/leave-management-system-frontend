import { authService } from "@/features/auth/api/authApi";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import api from "@/services/apiClient";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, FailureModal } from "@/shared/components";
import { BloodGroupMap, GenderMap, MaritalStatusMap } from "@/shared/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaEdit, FaEnvelope, FaFileAlt, FaPhone,
  FaSave, FaTimes, FaTrash, FaPlus} from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  HiCheckCircle, HiOutlineCreditCard,
  HiOutlineIdentification, HiOutlineShieldCheck
} from "react-icons/hi2";

type ExperienceType = 'FRESHER' | 'EXPERIENCED';

// ═══════════════════════════════════════════════════════════════
// FIELD COMPONENTS — ALL OUTSIDE (fixes focus loss bug)
// ═══════════════════════════════════════════════════════════════

interface FP { formData: any; isEditing: boolean; onChange: (f: string, v: any) => void; }

// Text input
const F: React.FC<{ label: string; field: string; type?: string; span?: boolean } & FP> =
  ({ label, field, type = "text", span = false, formData, isEditing, onChange }) => (
    <div className={`flex flex-col gap-1 ${span ? "col-span-full sm:col-span-2" : ""}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {isEditing ? (
        <input type={type}
          className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          value={formData[field] || ""}
          onChange={e => onChange(field, e.target.value)}
          placeholder={label} />
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
          {formData[field] || <span className="text-slate-300 italic text-xs">Not specified</span>}
        </div>
      )}
    </div>
  );

// Select
const S: React.FC<{
  label: string; field: string; options: string[];
  formatOpt?: (v: string) => string; displayVal?: string | null;
} & FP> = ({ label, field, options, formatOpt, displayVal, formData, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <select
        className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        value={formData[field] || ""}
        onChange={e => onChange(field, e.target.value)}>
        {options.map(v => <option key={v} value={v}>{formatOpt ? formatOpt(v) : v}</option>)}
      </select>
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
        {displayVal || formData[field] || <span className="text-slate-300 italic text-xs">Not specified</span>}
      </div>
    )}
  </div>
);

// Static (always read-only)
const Static: React.FC<{ label: string; value?: string | null; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className={`bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center ${mono ? 'font-mono' : ''}`}>
      {value || <span className="text-slate-300 italic text-xs">Not specified</span>}
    </div>
  </div>
);

// Textarea
const TA: React.FC<{ label: string; field: string } & FP> =
  ({ label, field, formData, isEditing, onChange }) => (
    <div className="flex flex-col gap-1 col-span-full">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {isEditing ? (
        <textarea rows={3}
          className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
          value={formData[field] || ""}
          onChange={e => onChange(field, e.target.value)} />
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-20">
          {formData[field] || <span className="text-slate-300 italic text-xs">Not specified</span>}
        </div>
      )}
    </div>
  );
const viewDocument = async (path: string) => {
  try {
    const response = await api.get(
      `/documents/view?path=${encodeURIComponent(path)}`,
      { responseType: "blob" }
    );

    const file = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const fileURL = URL.createObjectURL(file);

    // open in new tab
    window.open(fileURL);

  } catch (error) {
    console.error("Error viewing document:", error);
  }
};

// Doc path display
const DocPath: React.FC<{ label: string; path?: string | null }> = ({ label, path }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
    <div className="flex items-center gap-2.5 overflow-hidden">
      <div className={`p-1.5 rounded-lg shrink-0 ${path ? 'bg-emerald-100' : 'bg-slate-100'}`}>
        <FaFileAlt className={`text-sm ${path ? 'text-emerald-500' : 'text-slate-300'}`} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</p>
        <p className="text-[10px] text-slate-400">{path ? "Uploaded ✓" : "Not uploaded"}</p>
      </div>
    </div>
    {path && (
      <button
  onClick={() => viewDocument(path)}
  className="text-[10px] font-bold text-indigo-600 hover:underline"
>
  View
</button>
    )}
  </div>
);

// File upload row
const FileRow: React.FC<{
  label: string; fileKey: string;
  files: Record<string, any>;
  onFile: (key: string, file: File | null) => void;
  multiple?: boolean;
}> = ({ label, fileKey, files, onFile, multiple = false }) => {
  const hasFile = multiple
    ? (files[fileKey]?.length > 0)
    : !!files[fileKey];

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all group">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
          <HiCheckCircle size={14} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] font-bold text-slate-700 uppercase">{label}</p>
          <p className="text-[10px] text-slate-400 truncate">
            {multiple
              ? (files[fileKey]?.length ? `${files[fileKey].length} file(s) selected` : "Not selected")
              : (files[fileKey]?.name || "Not selected")}
          </p>
        </div>
      </div>
      <label className="cursor-pointer shrink-0 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border border-slate-200 text-slate-600">
        {hasFile ? "CHANGE" : "UPLOAD"}
        <input type="file" hidden multiple={multiple}
          onChange={e => {
            if (multiple) {
              const fl = e.target.files;
              onFile(fileKey, fl ? (Array.from(fl) as any) : null);
            } else {
              onFile(fileKey, e.target.files?.[0] || null);
            }
          }} />
      </label>
    </div>
  );
};

// Experience card — OUTSIDE to prevent focus loss
interface ExpFiles { experienceCerts: File | null; joiningLetters: File | null; relievingLetters: File | null; }
interface ExpCardProps {
  exp: any; index: number; isEditing: boolean; canDelete: boolean;
  expFiles: ExpFiles;
  onUpdate: (i: number, field: string, value: any) => void;
  onDelete: (i: number) => void;
  onFile: (i: number, key: keyof ExpFiles, file: File | null) => void;
}

const ExpCard: React.FC<ExpCardProps> = ({ exp, index, isEditing, canDelete, expFiles, onUpdate, onDelete, onFile }) => (
  <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm relative space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">
        Experience #{index + 1}
      </span>
      {isEditing && canDelete && (
        <button onClick={() => onDelete(index)}
          className="flex items-center gap-1 text-[10px] px-2.5 py-1 bg-rose-50 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-500 hover:text-white transition-colors font-bold">
          <FaTrash size={9} /> Remove
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Company Name */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
        {isEditing ? (
          <input className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. Infosys Ltd." value={exp.companyName || ""}
            onChange={e => onUpdate(index, "companyName", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
            {exp.companyName || <span className="text-slate-300 italic text-xs">Not specified</span>}
          </div>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role / Designation</label>
        {isEditing ? (
          <input className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. Senior Developer" value={exp.role || ""}
            onChange={e => onUpdate(index, "role", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
            {exp.role || <span className="text-slate-300 italic text-xs">Not specified</span>}
          </div>
        )}
      </div>

      {/* From Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Date</label>
        {isEditing ? (
          <input type="date" className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={exp.fromDate || ""} onChange={e => onUpdate(index, "fromDate", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
            {exp.fromDate || <span className="text-slate-300 italic text-xs">Not specified</span>}
          </div>
        )}
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</label>
        {isEditing ? (
          <input type="date" className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={exp.endDate || ""} onChange={e => onUpdate(index, "endDate", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
            {exp.endDate || <span className="text-slate-300 italic text-xs">Not specified</span>}
          </div>
        )}
      </div>
    </div>

    {/* Documents */}
    <div className="pt-3 border-t border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Documents</p>
      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DocPath label="Experience Certificate" path={exp.experienceCertPath} />
          <DocPath label="Joining Letter" path={exp.joiningLetterPath} />
          <DocPath label="Relieving Letter" path={exp.relievingLetterPath} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FileRow label="Experience Cert" fileKey="experienceCerts"
            files={expFiles as any} onFile={(_, f) => onFile(index, "experienceCerts", f)} />
          <FileRow label="Joining Letter" fileKey="joiningLetters"
            files={expFiles as any} onFile={(_, f) => onFile(index, "joiningLetters", f)} />
          <FileRow label="Relieving Letter" fileKey="relievingLetters"
            files={expFiles as any} onFile={(_, f) => onFile(index, "relievingLetters", f)} />
        </div>
      )}
    </div>
  </div>
);

// Card wrapper
const Card: React.FC<{ title: string; icon?: React.ReactNode; cols?: 2 | 3; children: React.ReactNode }> =
  ({ title, icon, cols = 2, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
        {icon && React.cloneElement(icon as React.ReactElement, { size: 14 } as any)}
        {title}
      </h3>
      <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4`}>{children}</div>
    </div>
  );

// Section divider
// const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
//   <div className="col-span-full flex items-center gap-3 pt-2">
//     <div className="h-px flex-1 bg-slate-100" />
//     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
//     <div className="h-px flex-1 bg-slate-100" />
//   </div>
// );

// Status badge
const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
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

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const EmployeeProfile: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { profile: backendProfile, loading, fetchEmployeeProfile } = useEmployee();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });

  // Common files (fresher + experienced shared)
  const [commonFiles, setCommonFiles] = useState<Record<string, any>>({
    idProof: null, passportPhoto: null,
    tenthMarksheet: null, twelfthMarksheet: null,
    degreeCertificate: null, offerLetter: null,
  });

  // Per-experience files
  const [expFilesList, setExpFilesList] = useState<ExpFiles[]>([
    { experienceCerts: null, joiningLetters: null, relievingLetters: null }
  ]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id, authLoading]);

  // Pre-fill form
  useEffect(() => {
    if (!backendProfile) return;
    setProfile({ ...backendProfile });
    const bp = backendProfile as any;
    const isExp = bp.employeeExperience === "EXPERIENCED";
    const expDocs = bp.experiencedDocuments;
    const experiences = isExp ? (expDocs?.length ? expDocs : [{}]) : [];

    setFormData({
      name: bp.name || "",
      joiningDate: bp.joiningDate || "",
      firstName: bp.firstName || "",
      lastName: bp.lastName || "",
      contactNumber: bp.contactNumber || "",
      gender: bp.gender || "MALE",
      maritalStatus: bp.maritalStatus || "SINGLE",
      aadharNumber: bp.aadharNumber || "",
      personalEmail: bp.personalEmail || "",
      dateOfBirth: bp.dateOfBirth || "",
      presentAddress: bp.presentAddress || "",
      permanentAddress: bp.permanentAddress || "",
      bloodGroup: bp.bloodGroup || "O_POSITIVE",
      emergencyContactNumber: bp.emergencyContactNumber || "",
      designation: bp.designation || "",
      skillSet: Array.isArray(bp.skillSet) ? bp.skillSet.join(", ") : bp.skillSet || "",
      accountNumber: bp.accountNumber || "",
      bankName: bp.bankName || "",
      ifscCode: bp.ifscCode || "",
      bankBranchName: bp.bankBranchName || "",
      uanNumber: bp.uanNumber || "",
      fatherName: bp.fatherName || "",
      fatherDateOfBirth: bp.fatherDateOfBirth || "",
      fatherOccupation: bp.fatherOccupation || "",
      fatherAlive: bp.fatherAlive ?? true,
      motherName: bp.motherName || "",
      motherDateOfBirth: bp.motherDateOfBirth || "",
      motherOccupation: bp.motherOccupation || "",
      motherAlive: bp.motherAlive ?? true,
      spouseName: bp.spouseName || "",
      spouseDateOfBirth: bp.spouseDateOfBirth || "",
      spouseOccupation: bp.spouseOccupation || "",
      spouseContactNumber: bp.spouseContactNumber || "",
      children: bp.children || [],
      experiences,
    });

    setExpFilesList(experiences.map(() => ({
      experienceCerts: null, joiningLetters: null, relievingLetters: null
    })));

    const aadhar = bp.aadharNumber || "";
    setAadharParts({ p1: aadhar.slice(0, 4), p2: aadhar.slice(4, 8), p3: aadhar.slice(8, 12) });
  }, [backendProfile]);

  // Sync aadhar parts
  useEffect(() => {
    const combined = `${aadharParts.p1}${aadharParts.p2}${aadharParts.p3}`;
    setFormData((prev: any) => ({ ...prev, aadharNumber: combined }));
  }, [aadharParts]);

  const handleAadharChange = (part: keyof typeof aadharParts, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    setAadharParts(prev => ({ ...prev, [part]: sanitized }));
    if (sanitized.length === 4) {
      if (part === "p1") document.getElementById("aadhar-p2")?.focus();
      if (part === "p2") document.getElementById("aadhar-p3")?.focus();
    }
  };

  const onChange = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleCommonFile = (key: string, file: any) =>
    setCommonFiles(prev => ({ ...prev, [key]: file }));

  const handleExpFile = (index: number, key: keyof ExpFiles, file: File | null) =>
    setExpFilesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: file };
      return updated;
    });

  const updateExperience = (index: number, field: string, value: any) =>
    setFormData((prev: any) => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });

  const addExperience = () => {
    setFormData((prev: any) => ({ ...prev, experiences: [...prev.experiences, {}] }));
    setExpFilesList(prev => [...prev, { experienceCerts: null, joiningLetters: null, relievingLetters: null }]);
  };

  const deleteExperience = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      experiences: prev.experiences.filter((_: any, i: number) => i !== index)
    }));
    setExpFilesList(prev => prev.filter((_, i) => i !== index));
  };

  const buildPayload = (isExp: boolean) => {
    const base: any = {
      name: formData.name,
      firstName: formData.firstName,
      lastName: formData.lastName,
      joiningDate: formData.joiningDate || null,
      contactNumber: formData.contactNumber,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      aadharNumber: formData.aadharNumber,
      personalEmail: formData.personalEmail,
      dateOfBirth: formData.dateOfBirth || null,
      presentAddress: formData.presentAddress,
      permanentAddress: formData.permanentAddress,
      bloodGroup: formData.bloodGroup,
      emergencyContactNumber: formData.emergencyContactNumber,
      designation: formData.designation,
      skillSet: formData.skillSet,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      ifscCode: formData.ifscCode,
      bankBranchName: formData.bankBranchName,
      fatherName: formData.fatherName,
      fatherDateOfBirth: formData.fatherDateOfBirth || null,
      fatherOccupation: formData.fatherOccupation,
      fatherAlive: formData.fatherAlive,
      motherName: formData.motherName,
      motherDateOfBirth: formData.motherDateOfBirth || null,
      motherOccupation: formData.motherOccupation,
      motherAlive: formData.motherAlive,
      spouseName: formData.spouseName || null,
      spouseDateOfBirth: formData.spouseDateOfBirth || null,
      spouseOccupation: formData.spouseOccupation || null,
      spouseContactNumber: formData.spouseContactNumber || null,
      children: formData.children || [],
    };
    if (isExp) {
      base.uanNumber = formData.uanNumber;
      base.experiences = (formData.experiences || []).map((exp: any) => ({
        companyName: exp.companyName || null,
        role: exp.role || null,
        fromDate: exp.fromDate || null,
        endDate: exp.endDate || null,
      }));
    }
    return base;
  };

  const buildFiles = (isExp: boolean) => {
    if (!isExp) {
      return {
        idProof: commonFiles.idProof,
        passportPhoto: commonFiles.passportPhoto,
        tenthMarksheet: commonFiles.tenthMarksheet,
        twelfthMarksheet: commonFiles.twelfthMarksheet,
        degreeCertificate: commonFiles.degreeCertificate,
        offerLetter: commonFiles.offerLetter,
      };
    }
    // Experienced — collect arrays per file type across all experiences
    const experienceCerts = expFilesList.map(e => e.experienceCerts).filter(Boolean) as File[];
    const joiningLetters = expFilesList.map(e => e.joiningLetters).filter(Boolean) as File[];
    const relievingLetters = expFilesList.map(e => e.relievingLetters).filter(Boolean) as File[];
    return {
      idProof: commonFiles.idProof,
      passportPhoto: commonFiles.passportPhoto,
      experienceCerts: experienceCerts.length ? experienceCerts : null,
      joiningLetters: joiningLetters.length ? joiningLetters : null,
      relievingLetters: relievingLetters.length ? relievingLetters : null,
    };
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const isExp = (profile as any)?.employeeExperience === "EXPERIENCED";
      const type: ExperienceType = isExp ? "EXPERIENCED" : "FRESHER";
      const payload = buildPayload(isExp);
      const files = buildFiles(isExp);
      await authService.updateProfileDetails(String(user.id), type, payload, files);
      await fetchEmployeeProfile(user.id);
      setIsEditing(false);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Failed to update profile.");
      setShowFailure(true);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading)
    return <div className="flex h-[80vh] items-center justify-center"><CustomLoader label="Loading Profile..." /></div>;
  if (!profile) return <div className="p-8 text-center text-slate-400">No profile data found</div>;

  const bp = profile as any;
  const formatDate = (d?: string | Date) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "—";
  const isExperienced = bp.employeeExperience === "EXPERIENCED";
  const fp = { formData, isEditing, onChange };

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

        {/* ── HEADER ── */}
        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-2xl font-black text-rose-600 shrink-0 shadow-sm">
              {profile.name?.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                <StatusBadge status={bp.verificationStatus} />
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{bp.designation || "—"}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <FaEnvelope className="text-slate-400 text-[10px]" /> {bp.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaPhone className="text-slate-400 text-[10px]" /> {bp.contactNumber || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineOfficeBuilding className="text-slate-400" /> {bp.branch || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineLocationMarker className="text-slate-400" /> Joined {formatDate(bp.joiningDate)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <FaEdit className="text-xs" /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50 min-w-20 justify-center">
                    {saving
                      ? <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><FaSave className="text-xs" /> Save</>}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
            <HiOutlineShieldCheck className="text-slate-300" />
            <span>Verification: <span className="font-semibold text-slate-500">{bp.verificationStatus || "PENDING"}</span></span>
            <span className="text-slate-200">·</span>
            <span>Role: <span className="font-semibold text-slate-500">{bp.role || "—"}</span></span>
            <span className="text-slate-200">·</span>
            <span>Type: <span className="font-semibold text-slate-500">{bp.employeeExperience || "—"}</span></span>
            {isEditing && (
              <span className="ml-auto px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold animate-pulse">
                ✏️ EDITING MODE
              </span>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white border-x border-b border-slate-200 overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="bg-slate-50/80 border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.12 }}
              className="p-5 md:p-6 space-y-5">

              {/* ── DETAILS ── */}
              {activeTab === "details" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card title="Contact Information">
                    <F label="Phone Number" field="contactNumber" {...fp} />
                    <Static label="Work Email" value={bp.email} />
                    <F label="Personal Email" field="personalEmail" type="email" {...fp} />
                    <F label="Emergency Contact" field="emergencyContactNumber" {...fp} />
                    <S label="Gender" field="gender" options={Object.values(GenderMap)} displayVal={bp.gender} {...fp} />
                    <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)}
                      formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  </Card>

                  <Card title="Employment Overview">
                    <F label="Designation" field="designation" {...fp} />
                    <Static label="Role" value={bp.role} />
                    <Static label="Reporting Manager" value={bp.reportingName} />
                    <F label="Joining Date" field="joiningDate" type="date" {...fp} />
                    <Static label="Biometric" value={bp.biometricStatus} />
                    <Static label="VPN Status" value={bp.vpnStatus} />
                    <div className="col-span-full pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="React, Node.js, Spring Boot..."
                          value={formData.skillSet || ""}
                          onChange={e => onChange('skillSet', e.target.value)} />
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {bp.skillSet?.length
                            ? bp.skillSet.map((s: string, i: number) => (
                              <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg border border-indigo-100">{s}</span>
                            ))
                            : <span className="text-slate-300 italic text-xs">No skills added</span>}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ── PERSONAL ── */}
              {activeTab === "personal" && (
                <Card title="Personal Information" icon={<HiOutlineIdentification />} cols={3}>
                  <F label="First Name" field="firstName" {...fp} />
                  <F label="Last Name" field="lastName" {...fp} />
                  <S label="Gender" field="gender" options={Object.values(GenderMap)} displayVal={bp.gender} {...fp} />
                  <F label="Date of Birth" field="dateOfBirth" type="date" {...fp} />
                  <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)}
                    formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  <S label="Marital Status" field="maritalStatus" options={Object.values(MaritalStatusMap)} displayVal={bp.maritalStatus} {...fp} />
                  <F label="Personal Email" field="personalEmail" type="email" {...fp} />
                  <F label="Emergency Contact" field="emergencyContactNumber" {...fp} />

                  {/* Aadhar */}
                  <div className="col-span-full flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar Number</label>
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        {(['p1', 'p2', 'p3'] as const).map((p, i) => (
                          <React.Fragment key={p}>
                            {i > 0 && <span className="text-slate-300 font-bold">—</span>}
                            <input id={`aadhar-${p}`} placeholder="XXXX"
                              className="w-full text-center border border-indigo-200 rounded-xl px-2 py-2.5 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 tracking-widest"
                              value={aadharParts[p]} onChange={e => handleAadharChange(p, e.target.value)} />
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-700 min-h-10 flex items-center tracking-widest">
                        {bp.aadharNumber ? `XXXX-XXXX-${bp.aadharNumber.slice(-4)}` : <span className="text-slate-300 italic text-xs font-sans">Not specified</span>}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* ── ADDRESS ── */}
              {activeTab === "address" && (
                <Card title="Address Details" icon={<HiOutlineLocationMarker />}>
                  <TA label="Present Residence" field="presentAddress" {...fp} />
                  <TA label="Permanent Address" field="permanentAddress" {...fp} />
                  <Static label="Branch" value={bp.branch} />
                  <Static label="Country" value={bp.country} />
                </Card>
              )}

              {/* ── FINANCIAL ── */}
              {activeTab === "financial" && (
                <Card title="Financial Details" icon={<HiOutlineCreditCard />}>
                  <F label="Bank Name" field="bankName" {...fp} />
                  {/* Account number — masked in view mode */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</label>
                    {isEditing ? (
                      <input className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        value={formData.accountNumber || ""} onChange={e => onChange('accountNumber', e.target.value)}
                        placeholder="Account number" />
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-700 min-h-10 flex items-center">
                        {formData.accountNumber
                          ? `XXXXXXXX${formData.accountNumber.slice(-4)}`
                          : <span className="text-slate-300 italic text-xs font-sans">Not specified</span>}
                      </div>
                    )}
                  </div>
                  <F label="IFSC Code" field="ifscCode" {...fp} />
                  <F label="Bank Branch" field="bankBranchName" {...fp} />
                  <Static label="PF Number" value={bp.pfNumber} />
                  <Static label="Company" value={bp.companyName} />
                  {isExperienced && <F label="UAN Number" field="uanNumber" {...fp} />}
                </Card>
              )}

              {/* ── EMPLOYMENT ── */}
              {activeTab === "employment" && (
                <div className="space-y-5">
                  <Card title="Employment Details" icon={<HiOutlineOfficeBuilding />} cols={3}>
                    <F label="Designation" field="designation" {...fp} />
                    <Static label="Department" value={bp.departmentName} />
                    <Static label="Branch" value={bp.branch} />
                    <Static label="Joining Date" value={formatDate(bp.joiningDate)} />
                    <Static label="Experience Type" value={bp.employeeExperience} />
                    <Static label="Reporting Manager" value={bp.reportingName} />
                    <Static label="Biometric Status" value={bp.biometricStatus} />
                    <Static label="VPN Status" value={bp.vpnStatus} />
                    <div className="col-span-full pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={formData.skillSet || ""} onChange={e => onChange('skillSet', e.target.value)}
                          placeholder="React, Spring Boot, MySQL..." />
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {bp.skillSet?.length
                            ? bp.skillSet.map((s: string, i: number) => (
                              <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg border border-indigo-100">{s}</span>
                            ))
                            : <span className="text-slate-300 italic text-xs">No skills added</span>}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Experience History */}
                  {isExperienced && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience History</h3>
                        {isEditing && (
                          <button onClick={addExperience}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                            <FaPlus size={9} /> Add Experience
                          </button>
                        )}
                      </div>

                      {(formData.experiences || []).length === 0 ? (
                        <div className="text-center py-8 text-slate-300">
                          <p className="text-sm italic">No experience history</p>
                          {isEditing && (
                            <button onClick={addExperience}
                              className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                              + Add your first experience
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(formData.experiences || []).map((exp: any, idx: number) => (
                            <ExpCard key={idx} index={idx} exp={exp} isEditing={isEditing}
                              canDelete={(formData.experiences || []).length > 1}
                              expFiles={expFilesList[idx] || { experienceCerts: null, joiningLetters: null, relievingLetters: null }}
                              onUpdate={updateExperience} onDelete={deleteExperience} onFile={handleExpFile} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── FAMILY ── */}
              {activeTab === "family" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Father */}
                    <Card title="Father's Details">
                      {isEditing && (
                        <label className="col-span-full flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                          <input type="checkbox" className="rounded"
                            checked={formData.fatherAlive ?? true}
                            onChange={e => onChange('fatherAlive', e.target.checked)} />
                          <span>Father is alive</span>
                        </label>
                      )}
                      <F label="Full Name" field="fatherName" {...fp} />
                      <F label="Date of Birth" field="fatherDateOfBirth" type="date" {...fp} />
                      <F label="Occupation" field="fatherOccupation" span {...fp} />
                    </Card>

                    {/* Mother */}
                    <Card title="Mother's Details">
                      {isEditing && (
                        <label className="col-span-full flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                          <input type="checkbox" className="rounded"
                            checked={formData.motherAlive ?? true}
                            onChange={e => onChange('motherAlive', e.target.checked)} />
                          <span>Mother is alive</span>
                        </label>
                      )}
                      <F label="Full Name" field="motherName" {...fp} />
                      <F label="Date of Birth" field="motherDateOfBirth" type="date" {...fp} />
                      <F label="Occupation" field="motherOccupation" span {...fp} />
                    </Card>
                  </div>

                  {/* Spouse — only if married */}
                  {(formData.maritalStatus === "MARRIED" || bp.maritalStatus === "MARRIED") && (
                    <Card title="Spouse Details">
                      <F label="Spouse Name" field="spouseName" {...fp} />
                      <F label="Contact Number" field="spouseContactNumber" {...fp} />
                      <F label="Occupation" field="spouseOccupation" {...fp} />
                      <F label="Date of Birth" field="spouseDateOfBirth" type="date" {...fp} />
                    </Card>
                  )}
                </div>
              )}

              {/* ── DOCUMENTS ── */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uploaded Documents</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <DocPath label="ID Proof" path={bp.idProofPath} />
                    <DocPath label="Passport Photo" path={bp.passportPhotoPath} />
                    {!isExperienced ? (
                      <>
                        <DocPath label="10th Marksheet" path={bp.tenthMarksheetPath} />
                        <DocPath label="12th Marksheet" path={bp.twelfthMarksheetPath} />
                        <DocPath label="Degree Certificate" path={bp.degreeCertificatePath} />
                        <DocPath label="Offer Letter" path={bp.offerLetterPath} />
                      </>
                    ) : (
                      <>
                        {bp.experiencedDocuments?.map((doc: any, i: number) => (
                          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <DocPath label="Experience Certificate" path={doc.experienceCertPath} />
                            <DocPath label="Joining Letter" path={doc.joiningLetterPath} />
                            <DocPath label="Relieving Letter" path={doc.relievingLetterPath} />
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100" />
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest shrink-0">Upload / Replace</p>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <FileRow label="ID Proof" fileKey="idProof" files={commonFiles} onFile={handleCommonFile} />
                        <FileRow label="Passport Photo" fileKey="passportPhoto" files={commonFiles} onFile={handleCommonFile} />
                        {!isExperienced ? (
                          <>
                            <FileRow label="10th Marksheet" fileKey="tenthMarksheet" files={commonFiles} onFile={handleCommonFile} />
                            <FileRow label="12th Marksheet" fileKey="twelfthMarksheet" files={commonFiles} onFile={handleCommonFile} />
                            <FileRow label="Degree Certificate" fileKey="degreeCertificate" files={commonFiles} onFile={handleCommonFile} />
                            <FileRow label="Offer Letter" fileKey="offerLetter" files={commonFiles} onFile={handleCommonFile} />
                          </>
                        ) : (
                          <>
                            <FileRow label="Joining Letter" fileKey="offerLetter" files={commonFiles} onFile={handleCommonFile} />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Rejected warning */}
              <AnimatePresence>
                {bp.verificationStatus === "REJECTED" && (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <HiOutlineShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">HR Review Required</p>
                      <p className="text-sm font-semibold text-rose-800">"{bp.hrRemarks}"</p>
                      <p className="text-xs text-rose-500/80 mt-1">Please edit and resubmit your profile for verification.</p>
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

export default EmployeeProfile;