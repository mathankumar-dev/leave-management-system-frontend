import { authService } from "@/features/auth/api/authApi";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, FailureModal } from "@/shared/components";
import { BloodGroupMap, GenderMap, MaritalStatusMap } from "@/shared/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEnvelope, FaFileAlt, FaPhone, FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiCheckCircle, HiOutlineCreditCard, HiOutlineIdentification, HiOutlineShieldCheck } from "react-icons/hi2";

type ExperienceType = 'FRESHER' | 'EXPERIENCED';

// ═══════════════════════════════════════════════════════════════
// ALL COMPONENTS OUTSIDE — fixes focus loss bug
// ═══════════════════════════════════════════════════════════════

// ── Text Input Field ──────────────────────────────────────────
interface FieldProps {
  label: string; field: string; type?: string; fullWidth?: boolean;
  formData: any; isEditing: boolean; onChange: (field: string, value: any) => void;
}
const F: React.FC<FieldProps> = ({ label, field, type = "text", fullWidth = false, formData, isEditing, onChange }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? "col-span-full" : ""}`}>
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <input type={type} className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20" value={formData[field] || ""} onChange={e => onChange(field, e.target.value)} placeholder={label} />
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
        {formData[field] || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

// ── Select Field ──────────────────────────────────────────────
interface SelectProps {
  label: string; field: string; options: string[]; formatOpt?: (v: string) => string;
  displayVal?: string | null; formData: any; isEditing: boolean; onChange: (field: string, value: any) => void;
}
const S: React.FC<SelectProps> = ({ label, field, options, formatOpt, displayVal, formData, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <select className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:outline-none" value={formData[field]} onChange={e => onChange(field, e.target.value)}>
        {options.map(v => <option key={v} value={v}>{formatOpt ? formatOpt(v) : v}</option>)}
      </select>
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
        {displayVal || formData[field] || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

// ── Static (read-only) Field ──────────────────────────────────
const Static: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
      {value || <span className="text-slate-300 italic text-xs">Not Specified</span>}
    </div>
  </div>
);

// ── Textarea Field ────────────────────────────────────────────
interface TAProps { label: string; field: string; formData: any; isEditing: boolean; onChange: (field: string, value: any) => void; }
const TA: React.FC<TAProps> = ({ label, field, formData, isEditing, onChange }) => (
  <div className="flex flex-col gap-1 col-span-full">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {isEditing ? (
      <textarea rows={3} className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:outline-none resize-none" value={formData[field] || ""} onChange={e => onChange(field, e.target.value)} />
    ) : (
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-16">
        {formData[field] || <span className="text-slate-300 italic text-xs">Not Specified</span>}
      </div>
    )}
  </div>
);

// ── Doc View Path ─────────────────────────────────────────────
const DocPath: React.FC<{ label: string; path?: string | null }> = ({ label, path }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
    <div className="flex items-center gap-2 overflow-hidden">
      <FaFileAlt className={`shrink-0 text-sm ${path ? 'text-emerald-500' : 'text-slate-300'}`} />
      <div>
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</p>
        <p className="text-[10px] text-slate-400">{path ? "Uploaded ✓" : "Not uploaded"}</p>
      </div>
    </div>
    {path && <a href={`/${path}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-600 hover:underline shrink-0 ml-2">View</a>}
  </div>
);

// ── File Upload Row ───────────────────────────────────────────
const FileRow: React.FC<{
  label: string; fileKey: string;
  files: Record<string, File | File[] | null>;
  onFile: (key: string, file: File | null) => void;
  onMultiFile?: (key: string, list: FileList | null) => void;
  multiple?: boolean;
}> = ({ label, fileKey, files, onFile, onMultiFile, multiple = false }) => (
  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all">
    <div className="flex items-center gap-2 overflow-hidden">
      <div className={`p-1.5 rounded-lg shrink-0 ${files?.[fileKey] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
        <HiCheckCircle size={14} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold text-slate-700 uppercase">{label}</p>
        <p className="text-[10px] text-slate-400 truncate">
          {Array.isArray(files?.[fileKey]) ? `${(files?.[fileKey] as File[]).length} files` : (files?.[fileKey] as File)?.name || "Not selected"}
        </p>
      </div>
    </div>
    <label className="cursor-pointer shrink-0 bg-slate-50 hover:bg-indigo-600 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border border-slate-200 text-slate-600">
      {files?.[fileKey] ? "CHANGE" : "UPLOAD"}
      <input type="file" hidden multiple={multiple}
        onChange={e => multiple ? onMultiFile?.(fileKey, e.target.files) : onFile(fileKey, e.target.files?.[0] || null)} />
    </label>
  </div>
);

// ── Experience Card — OUTSIDE to fix focus bug ────────────────
interface ExpFiles {
  offerLetter: File | null;
  relievingLetters: File | null;
  joiningLetters: File | null;
  experienceCerts: File | null;
}
interface ExpCardProps {
  exp: any; index: number; isEditing: boolean; canDelete: boolean;
  expFiles: ExpFiles;
  onUpdate: (index: number, field: string, value: any) => void;
  onDelete: (index: number) => void;
  onFile: (index: number, key: keyof ExpFiles, file: File | null) => void;
}
const ExpCard: React.FC<ExpCardProps> = ({ exp, index, isEditing, canDelete, expFiles, onUpdate, onDelete, onFile }) => (
  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 relative space-y-4">

    {/* Delete button */}
    {isEditing && canDelete && (
      <button onClick={() => onDelete(index)}
        className="absolute top-3 right-3 flex items-center gap-1 text-[10px] px-2 py-1 bg-rose-50 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
        <FaTrash size={9} /> Delete
      </button>
    )}

    {/* Fields — view mode: Static, edit mode: input */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Company Name */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
        {isEditing ? (
          <input className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Company Name" value={exp.companyName || ""}
            onChange={e => onUpdate(index, "companyName", e.target.value)} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {exp.companyName || <span className="text-slate-300 italic text-xs">Not Specified</span>}
          </div>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</label>
        {isEditing ? (
          <input className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Role / Designation" value={exp.role || ""}
            onChange={e => onUpdate(index, "role", e.target.value)} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {exp.role || <span className="text-slate-300 italic text-xs">Not Specified</span>}
          </div>
        )}
      </div>

      {/* From Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Date</label>
        {isEditing ? (
          <input type="date" className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={exp.fromDate || ""} onChange={e => onUpdate(index, "fromDate", e.target.value)} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {exp.fromDate || <span className="text-slate-300 italic text-xs">Not Specified</span>}
          </div>
        )}
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</label>
        {isEditing ? (
          <input type="date" className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={exp.endDate || ""} onChange={e => onUpdate(index, "endDate", e.target.value)} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {exp.endDate || <span className="text-slate-300 italic text-xs">Not Specified</span>}
          </div>
        )}
      </div>
    </div>

    {/* Documents section */}
    <div className="pt-3 border-t border-slate-200">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Documents</p>

      {/* View mode — show existing uploaded docs */}
      {!isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DocPath label="Offer Letter" path={exp.offerLetterPath} />
          <DocPath label="Relieving Letter" path={exp.relievingLetterPath} />
          <DocPath label="Experience Certificate" path={exp.certificatePath} />
        </div>
      )}

      {/* Edit mode — upload new docs */}
      {/* Edit mode — upload new docs */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FileRow
            label="Experience Certificate"
            fileKey="experienceCerts"
            files={expFiles as any}
            onFile={(_, f) => onFile(index, "experienceCerts", f)}
          />
          <FileRow
            label="Joining Letter"
            fileKey="joiningLetters"
            files={expFiles as any}
            onFile={(_, f) => onFile(index, "joiningLetters", f)}
          />
          <FileRow
            label="Relieving Letter"
            fileKey="relievingLetters"
            files={expFiles as any}
            onFile={(_, f) => onFile(index, "relievingLetters", f)}
          />
        </div>
      )}
    </div>
  </div>
);

// ── Card wrapper ──────────────────────────────────────────────
const Card: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
      {icon && React.cloneElement(icon as React.ReactElement, { size: 14 } as any)}
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

// ── Status Badge ──────────────────────────────────────────────
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
  const { user, isLoading: authLoading, setUser } = useAuth();
  const { profile: backendProfile, loading, fetchEmployeeProfile } = useEmployee();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });

  // ── Files state — separated: common + per-experience ─────────
  const [commonFiles, setCommonFiles] = useState<Record<string, File | File[] | null>>({
    idProof: null, passportPhoto: null,
    tenthMarksheet: null, twelfthMarksheet: null,
    degreeCertificate: null, offerLetter: null,
    relievingLetter: null,
  });

  const [expFilesList, setExpFilesList] = useState<ExpFiles[]>([
    {
      offerLetter: null,
      joiningLetters: null,
      relievingLetters: null,
      experienceCerts: null
    }
  ]);

  // ── Auth guard ────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id, authLoading]);

  // ── Pre-fill form from backend ────────────────────────────────
  useEffect(() => {
    if (!backendProfile) return;
    setProfile({ ...backendProfile });
    const bp = backendProfile as any;
    const isExp = bp.employeeExperience === "EXPERIENCED";

    const expDocs = bp.experiencedDocuments;
    const experiences = isExp
      ? (expDocs?.length ? expDocs : [{}])
      : [];

    setFormData({
      firstName: bp.firstName || bp.name?.split(' ')[0] || "",
      lastName: bp.lastName || bp.name?.split(' ').slice(1).join(' ') || "",
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
      uanNumber: bp.uanNumber || "",
      experiences,
    });

    // Init expFilesList to match number of experiences
    setExpFilesList(experiences.map(() => ({ 
  offerLetter: null, 
  joiningLetters: null, 
  relievingLetters: null, 
  experienceCerts: null  
})));

    const aadhar = bp.aadharNumber || "";
    setAadharParts({ p1: aadhar.slice(0, 4), p2: aadhar.slice(4, 8), p3: aadhar.slice(8, 12) });
  }, [backendProfile]);

  // ── Sync aadhar parts → formData ─────────────────────────────
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
  

  // ── Handlers ──────────────────────────────────────────────────
  const handleInputChange = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, [field]: value }));

  const handleCommonFile = (key: string, file: File | null) =>
    setCommonFiles(prev => ({ ...prev, [key]: file }));

  const handleCommonMultiFile = (key: string, fileList: FileList | null) => {
    if (fileList) setCommonFiles(prev => ({ ...prev, [key]: Array.from(fileList) }));
  };

  const handleExpFile = (index: number, key: keyof ExpFiles, file: File | null) => {
    setExpFilesList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: file };
      return updated;
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const addExperience = () => {
    setFormData((prev: any) => ({
      ...prev,
      experiences: [...prev.experiences, {}]
    }));
    setExpFilesList(prev => [...prev, {
      offerLetter: null,
      joiningLetters: null,
      relievingLetters: null,
      experienceCerts: null
    }]);
  };

  const deleteExperience = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      experiences: prev.experiences.filter((_: any, i: number) => i !== index)
    }));
    setExpFilesList(prev => prev.filter((_, i) => i !== index));
  };

  // ── Flatten files for API ─────────────────────────────────────
  const flattenFiles = () => {
    const flat: Record<string, File> = {};

    // Common files (single files)
    Object.entries(commonFiles).forEach(([key, val]) => {
      if (val && !Array.isArray(val)) {
        flat[key] = val;
      }
    });

    // Experience files — indexed by experience position
    expFilesList.forEach((expFiles, idx) => {
      if (expFiles.experienceCerts) flat[`experienceCerts_${idx}`] = expFiles.experienceCerts;
      if (expFiles.joiningLetters) flat[`joiningLetters_${idx}`] = expFiles.joiningLetters;
      if (expFiles.relievingLetters) flat[`relievingLetters_${idx}`] = expFiles.relievingLetters;
      if (expFiles.offerLetter) flat[`offerLetter_${idx}`] = expFiles.offerLetter;
    });

    return flat;
  };

  const cleanExperiences = (formData.experiences || []).map((exp: any) => ({
  id: exp.id || null,
  companyName: exp.companyName || null,
  role: exp.role || null,
  fromDate: exp.fromDate || null,    
  endDate: exp.endDate || null,      
}));

  const { experiences, ...rest } = formData;

// ── Date Validation ───────────────────────────────────────────
const validateDates = () => {
  const today = new Date().toISOString().split('T')[0];
  
  if (formData.dateOfBirth && formData.dateOfBirth > today) {
    alert("Date of birth cannot be in the future!");
    return false;
  }
  
  formData.experiences?.forEach((exp: any, i: number) => {
    if (exp.fromDate && exp.fromDate > today) {
      alert(`Experience ${i+1}: From date cannot be in the future!`);
      return false;
    }
    if (exp.endDate && exp.endDate > today) {
      alert(`Experience ${i+1}: End date cannot be in the future!`);
      return false;
    }
    if (exp.fromDate && exp.endDate && exp.fromDate >= exp.endDate) {
      alert(`Experience ${i+1}: From date must be before end date!`);
      return false;
    }
  });
  return true;
};

// ── Clean Form Data ───────────────────────────────────────────
const cleanFormData = (data: any) => {
  const cleaned: any = { ...data };
  
  // Convert empty strings to null for dates
  const dateFields = [
    'dateOfBirth', 'fatherDateOfBirth', 'motherDateOfBirth', 'spouseDateOfBirth'
  ];
  
  dateFields.forEach(field => {
    if (cleaned[field] === '') cleaned[field] = null;
  });
  
  return cleaned;
};

// ── Save ──────────────────────────────────────────────────────
const handleSave = async () => {
  if (!validateDates()) return;
  if (!user?.id) return;
  
  try {
    setSaving(true);
    const isExp = (user as any)?.employeeExperience === "EXPERIENCED";
    const type: ExperienceType = isExp ? "EXPERIENCED" : "FRESHER";
    
    const cleanedRest = cleanFormData(rest);
    const payload = {
      ...cleanedRest,
      experiences: cleanExperiences,
    };
    
    console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
    
    await authService.updateProfileDetails(String(user.id), type, payload, flattenFiles());
    const updated = await authService.getEmployeeProfile(user.id);
    setUser(updated);
    setIsEditing(false);
    alert('Profile updated successfully! ✅');
  } catch (err: any) {
    console.error('❌ Save error:', err);
    setErrorMessage(err?.response?.data?.message || "Failed to update profile.");
    setShowFailure(true);
  } finally {
    setSaving(false);
  }
};

  // ── Guards ────────────────────────────────────────────────────
  if (authLoading || loading)
    return <div className="flex h-[80vh] items-center justify-center"><CustomLoader label="Loading Profile..." /></div>;
  if (!profile) return <div>No profile data found</div>;

  const bp = profile as any;      
  const formatDate = (d?: string | Date) =>
    d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";
  const isExperienced = bp.employeeExperience === "EXPERIENCED";

  // Shared props passed to field components
  const fp = { formData, isEditing, onChange: handleInputChange };

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
                <span className="flex items-center gap-1.5"><HiOutlineOfficeBuilding className="text-slate-400" />{bp.designation || "—"}</span>
                <span className="flex items-center gap-1.5"><HiOutlineLocationMarker className="text-slate-400" />{formatDate(bp.joiningDate)}</span>
                <StatusBadge status={bp.verificationStatus} />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 shrink-0">
              {/* <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <FaPrint className="text-xs text-slate-400" /> Print
              </button> */}
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
            Verification Status: <span className="font-semibold text-slate-500">{bp.verificationStatus || "PENDING"}</span>
            {isEditing && <span className="ml-auto px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold">EDITING MODE</span>}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white border-x border-slate-200 border-b">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="p-6">

              {/* ── DETAILS ── */}
              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Contact Information">
                    <F label="Phone Number" field="contactNumber" {...fp} />
                    <Static label="Work Email" value={bp.email} />
                    <F label="Personal Email" field="personalEmail" type="email" {...fp} />
                    <F label="Emergency Contact" field="emergencyContactNumber" {...fp} />
                    <S label="Gender" field="gender" options={Object.values(GenderMap)} displayVal={bp.gender} {...fp} />
                    <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  </Card>
                  <Card title="Employment Details">
                    <F label="Designation" field="designation" {...fp} />
                    <Static label="Role" value={bp.role} />
                    <Static label="Reporting Manager" value={bp.reportingName} />
                    <Static label="Joining Date" value={formatDate(bp.joiningDate)} />
                    <Static label="Experience Type" value={bp.employeeExperience} />
                    <Static label="Biometric Status" value={bp.biometricStatus} />
                    <div className="col-span-full pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none" placeholder="React, Spring Boot..." value={formData.skillSet || ""} onChange={e => handleInputChange('skillSet', e.target.value)} />
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {bp.skillSet?.map((s: string, i: number) => <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase">{s}</span>)}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ── PERSONAL ── */}
              {activeTab === "personal" && (
                <Card title="Personal Profile" icon={<HiOutlineIdentification />}>
                  <F label="First Name" field="firstName" {...fp} />
                  <F label="Last Name" field="lastName" {...fp} />
                  <S label="Gender" field="gender" options={Object.values(GenderMap)} displayVal={bp.gender} {...fp} />
                  <F label="Date of Birth" field="dateOfBirth" type="date" {...fp} />
                  <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  <S label="Marital Status" field="maritalStatus" options={Object.values(MaritalStatusMap)} displayVal={bp.maritalStatus} {...fp} />
                  <F label="Personal Email" field="personalEmail" type="email" {...fp} />
                  <F label="Emergency Contact" field="emergencyContactNumber" {...fp} />
                  {/* Aadhar */}
                  {isEditing ? (
                    <div className="flex flex-col gap-1 col-span-full">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhar Number</label>
                      <div className="flex items-center gap-3">
                        {(['p1', 'p2', 'p3'] as const).map((p, i) => (
                          <React.Fragment key={p}>
                            {i > 0 && <span className="text-slate-300">-</span>}
                            <input id={`edit-aadhar-${p}`} placeholder="XXXX" className="w-full text-center border border-indigo-200 rounded-lg px-2 py-2 text-sm font-mono bg-white focus:outline-none" value={aadharParts[p]} onChange={e => handleAadharChange(p, e.target.value)} />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Static label="Aadhar Number" value={bp.aadharNumber ? `****-****-${bp.aadharNumber.slice(-4)}` : "-"} />
                  )}
                </Card>
              )}

              {/* ── ADDRESS ── */}
              {activeTab === "address" && (
                <Card title="Address Registry" icon={<HiOutlineLocationMarker />}>
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
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</label>
                    {isEditing ? (
                      <input className="border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none" value={formData.accountNumber || ""} onChange={e => handleInputChange('accountNumber', e.target.value)} />
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
                        {formData.accountNumber ? `****${formData.accountNumber.slice(-4)}` : <span className="text-slate-300 italic text-xs">Not Specified</span>}
                      </div>
                    )}
                  </div>
                  <F label="IFSC Code" field="ifscCode" {...fp} />
                  <F label="Branch Name" field="bankBranchName" {...fp} />
                  <Static label="PF Number" value={bp.pfNumber} />
                  <Static label="Company" value={bp.companyName} />
                  {isExperienced && <F label="UAN Number" field="uanNumber" {...fp} />}
                </Card>
              )}

              {/* ── EMPLOYMENT ── */}
              {activeTab === "employment" && (
                <div className="space-y-6">
                  <Card title="Employment Details" icon={<HiOutlineOfficeBuilding />}>
                    <F label="Designation" field="designation" {...fp} />
                    <Static label="Department" value={bp.departmentName} />
                    <Static label="Branch" value={bp.branch} />
                    <Static label="Joining Date" value={formatDate(bp.joiningDate)} />
                    <Static label="Experience Type" value={bp.employeeExperience} />
                    <Static label="Reporting Manager" value={bp.reportingName} />
                    <Static label="Biometric Status" value={bp.biometricStatus} />
                    <Static label="VPN Status" value={bp.vpnStatus} />
                    <div className="col-span-full pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none" value={formData.skillSet || ""} onChange={e => handleInputChange('skillSet', e.target.value)} />
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {bp.skillSet?.map((s: string, i: number) => <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase">{s}</span>)}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Experience History */}
                  {isExperienced && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience History</p>
                        {isEditing && (
                          <button onClick={addExperience}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                            <FaPlus size={9} /> Add Experience
                          </button>
                        )}
                      </div>

                      {/* Each experience card */}
                      {(formData.experiences || []).map((exp: any, idx: number) => (
                       // In Employment tab, fix ExpCard call:
<ExpCard
  key={idx}
  index={idx}
  exp={exp}
  isEditing={isEditing}
  canDelete={(formData.experiences || []).length > 1}
  expFiles={expFilesList[idx] || { 
    offerLetter: null, 
    joiningLetters: null, 
    relievingLetters: null, 
    experienceCerts: null  // 👈 Fix: match ExpFiles interface
  }}
  onUpdate={updateExperience}
  onDelete={deleteExperience}
  onFile={handleExpFile}
/>
                      ))}

                      {(!formData.experiences || formData.experiences.length === 0) && (
                        <p className="text-sm text-slate-400 italic text-center py-4">No experience history added</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── FAMILY ── */}
              {activeTab === "family" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Father's Details">
                    {isEditing && (
                      <label className="flex items-center gap-2 text-xs text-slate-500 col-span-full cursor-pointer">
                        <input type="checkbox" checked={formData.fatherAlive ?? true} onChange={e => handleInputChange('fatherAlive', e.target.checked)} />
                        Alive?
                      </label>
                    )}
                    <F label="Name" field="fatherName" {...fp} />
                    <F label="Date of Birth" field="fatherDateOfBirth" type="date" {...fp} />
                    <F label="Occupation" field="fatherOccupation" {...fp} />
                  </Card>
                  <Card title="Mother's Details">
                    {isEditing && (
                      <label className="flex items-center gap-2 text-xs text-slate-500 col-span-full cursor-pointer">
                        <input type="checkbox" checked={formData.motherAlive ?? true} onChange={e => handleInputChange('motherAlive', e.target.checked)} />
                        Alive?
                      </label>
                    )}
                    <F label="Name" field="motherName" {...fp} />
                    <F label="Date of Birth" field="motherDateOfBirth" type="date" {...fp} />
                    <F label="Occupation" field="motherOccupation" {...fp} />
                  </Card>
                  {(formData.maritalStatus === "MARRIED" || bp.maritalStatus === "MARRIED") && (
                    <div className="md:col-span-2">
                      <Card title="Spouse Details">
                        <F label="Spouse Name" field="spouseName" {...fp} />
                        <F label="Contact Number" field="spouseContactNumber" {...fp} />
                        <F label="Occupation" field="spouseOccupation" {...fp} />
                        <F label="Date of Birth" field="spouseDateOfBirth" type="date" {...fp} />
                      </Card>
                    </div>
                  )}
                </div>  
              )}

              {/* ── DOCUMENTS ── */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Documents</h3>

                  {/* View — existing docs */}
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
                        <DocPath label="Joining Letter" path={bp.offerLetterPath} />
                        <DocPath label="Relieving Letter" path={bp.relievingLetterPath} />
                        <DocPath label="Experience Certificate" path={bp.experienceCertificatePath} />
                      </>
                    )}
                  </div>

                  {/* Edit — upload new */}
                  {isEditing && (
                    <>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Upload / Replace</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <FileRow label="ID Proof" fileKey="idProof" files={commonFiles} onFile={handleCommonFile} onMultiFile={handleCommonMultiFile} />
                        {!isExperienced ? (
                          <>
                            <FileRow label="10th Marksheet" fileKey="tenthMarksheet" files={commonFiles} onFile={handleCommonFile} onMultiFile={handleCommonMultiFile} />
                            <FileRow label="12th Marksheet" fileKey="twelfthMarksheet" files={commonFiles} onFile={handleCommonFile} onMultiFile={handleCommonMultiFile} />
                            <FileRow label="Degree Certificate" fileKey="degreeCertificate" files={commonFiles} onFile={handleCommonFile} onMultiFile={handleCommonMultiFile} />
                            <FileRow label="Offer Letter" fileKey="offerLetter" files={commonFiles} onFile={handleCommonFile} onMultiFile={handleCommonMultiFile} />
                          </>
                        ) : (
                          <>
                            <FileRow label="ID Proof" fileKey="idProof" files={commonFiles} onFile={handleCommonFile} />
                            <FileRow label="Passport Photo" fileKey="passportPhoto" files={commonFiles} onFile={handleCommonFile} />
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
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                      <HiOutlineShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">HR Review Required</p>
                      <p className="text-sm font-semibold text-rose-800">"{bp.hrRemarks}"</p>
                      <p className="text-xs text-rose-500 mt-1">Please update your records and resubmit.</p>
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

export default EmployeeProfile; 