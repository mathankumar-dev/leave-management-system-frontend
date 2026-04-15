import { authService } from "@/features/auth/api/authApi";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import api from "@/services/apiClient";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, FailureModal } from "@/shared/components";
import { BloodGroupMap, GenderMap, MaritalStatusMap } from "@/shared/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaEdit, FaEnvelope, FaFileAlt, FaPhone,
  FaSave, FaTimes, FaTrash, FaPlus, FaEye, FaCamera
} from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  HiCheckCircle, HiOutlineCreditCard,
  HiOutlineIdentification, HiOutlineShieldCheck
} from "react-icons/hi2";

type ExperienceType = 'FRESHER' | 'EXPERIENCED';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

// FIX: Backend ChildDto uses childDateOfBirth (LocalDate), NOT age (int)
interface ChildEntry {
  childName: string;
  gender: string;
  childDateOfBirth: string; // "YYYY-MM-DD" — maps to LocalDate on backend
}

// ═══════════════════════════════════════════════════════════════
// FIELD COMPONENTS — ALL OUTSIDE (fixes focus loss bug)
// ═══════════════════════════════════════════════════════════════

interface FP { formData: any; isEditing: boolean; onChange: (f: string, v: any) => void; }

const F: React.FC<{ label: string; field: string; type?: string; span?: boolean; fullSpan?: boolean } & FP> =
  ({ label, field, type = "text", span = false, fullSpan = false, formData, isEditing, onChange }) => (
    <div className={`flex flex-col gap-1 ${fullSpan ? "col-span-full" : span ? "col-span-full sm:col-span-2" : ""}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {isEditing ? (
        <input type={type}
          className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          value={formData[field] || ""}
          onChange={e => onChange(field, e.target.value)}
          placeholder={label} />
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
          <span className={formData[field] ? "" : "text-slate-300 italic text-xs"}>
            {formData[field] || "—"}
          </span>
        </div>
      )}
    </div>
  );

// Read-only field — system-managed, never editable
const RO: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 min-h-10 flex items-center">
      <span className={value ? "" : "text-slate-300 italic text-xs"}>{value || "—"}</span>
    </div>
  </div>
);

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
        <span className={displayVal || formData[field] ? "" : "text-slate-300 italic text-xs"}>
          {displayVal || formData[field] || "—"}
        </span>
      </div>
    )}
  </div>
);

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
          <span className={formData[field] ? "" : "text-slate-300 italic text-xs"}>
            {formData[field] || "—"}
          </span>
        </div>
      )}
    </div>
  );

// ═══════════════════════════════════════════════════════════════
// DOCUMENT HELPERS
// ═══════════════════════════════════════════════════════════════

const viewDocument = async (path: string) => {
  try {
    const response = await api.get(`/documents/view?path=${encodeURIComponent(path)}`, { responseType: "blob" });
    const fileURL = URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
    window.open(fileURL);
  } catch (error) {
    console.error("Error viewing document:", error);
  }
};

// DocCard:
//   Normal mode → View button (if file exists)
//   Edit mode   → View button (if file exists) + Change/Replace/Upload button
const DocCard: React.FC<{
  label: string; path?: string | null; isEditing: boolean;
  fileKey: string; files: Record<string, any>;
  onFile: (key: string, file: File | null) => void;
}> = ({ label, path, isEditing, fileKey, files, onFile }) => {
  const selectedFile = files[fileKey] as File | null;
  const hasUpload = !!selectedFile;
  const hasExisting = !!path;

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg shrink-0 ${hasExisting || hasUpload ? 'bg-emerald-100' : 'bg-slate-100'}`}>
          <FaFileAlt className={`text-sm ${hasExisting || hasUpload ? 'text-emerald-500' : 'text-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] text-slate-400">
            {hasUpload ? `New: ${selectedFile!.name}` : hasExisting ? "Uploaded ✓" : "Not uploaded"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {/* View — always shown when file exists (both view and edit mode) */}
        {hasExisting && (
          <button onClick={() => viewDocument(path!)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors">
            <FaEye size={9} /> View
          </button>
        )}
        {/* Change — only in edit mode */}
        {isEditing && (
          <label className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold cursor-pointer rounded-lg border transition-all ${hasUpload ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}>
            {hasUpload ? "Change" : hasExisting ? "Replace" : "Upload"}
            <input type="file" hidden onChange={e => onFile(fileKey, e.target.files?.[0] || null)} />
          </label>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHILD CARD — FIX: childDateOfBirth (date) instead of age (number)
// ═══════════════════════════════════════════════════════════════

const ChildCard: React.FC<{
  child: ChildEntry; index: number; isEditing: boolean; canDelete: boolean;
  onUpdate: (i: number, field: string, value: any) => void;
  onDelete: (i: number) => void;
}> = ({ child, index, isEditing, canDelete, onUpdate, onDelete }) => (
  <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3 relative">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
        Child #{index + 1}
      </span>
      {isEditing && canDelete && (
        <button onClick={() => onDelete(index)}
          className="flex items-center gap-1 text-[10px] px-2 py-1 bg-rose-50 text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-500 hover:text-white transition-colors font-bold">
          <FaTrash size={9} /> Remove
        </button>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
        {isEditing ? (
          <input className="border border-indigo-200 rounded-xl px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Child's name" value={child.childName || ""}
            onChange={e => onUpdate(index, "childName", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {child.childName || <span className="text-slate-300 italic text-xs">—</span>}
          </div>
        )}
      </div>
      {/* Gender */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
        {isEditing ? (
          <select className="border border-indigo-200 rounded-xl px-3 py-2 text-sm font-medium bg-white focus:outline-none"
            value={child.gender || "MALE"} onChange={e => onUpdate(index, "gender", e.target.value)}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {child.gender ? (child.gender === "MALE" ? "Male" : "Female") : "—"}
          </div>
        )}
      </div>
      {/* FIX: Date of Birth — backend ChildDto.childDateOfBirth is LocalDate */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
        {isEditing ? (
          <input type="date"
            className="border border-indigo-200 rounded-xl px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={child.childDateOfBirth || ""}
            onChange={e => onUpdate(index, "childDateOfBirth", e.target.value)} />
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
            {child.childDateOfBirth
              ? new Date(child.childDateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : <span className="text-slate-300 italic text-xs">—</span>}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// EXPERIENCE CARD
// ═══════════════════════════════════════════════════════════════

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
      {['companyName', 'role', 'fromDate', 'endDate'].map(field => (
        <div key={field} className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {field === 'companyName' ? 'Company Name' : field === 'role' ? 'Role / Designation' : field === 'fromDate' ? 'From Date' : 'End Date'}
          </label>
          {isEditing ? (
            <input
              type={field.includes('Date') ? 'date' : 'text'}
              className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder={field === 'companyName' ? 'e.g. Infosys Ltd.' : field === 'role' ? 'e.g. Senior Developer' : ''}
              value={exp[field] || ""}
              onChange={e => onUpdate(index, field, e.target.value)} />
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 min-h-10 flex items-center">
              <span className={exp[field] ? "" : "text-slate-300 italic text-xs"}>{exp[field] || "—"}</span>
            </div>
          )}
        </div>
      ))}
    </div>
    {/* Documents — View always shown; Change only in edit mode */}
    <div className="pt-3 border-t border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Documents</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <DocCard label="Experience Cert" path={exp.experienceCertPath} isEditing={isEditing}
          fileKey="experienceCerts" files={expFiles as any} onFile={(_, f) => onFile(index, "experienceCerts", f)} />
        <DocCard label="Joining Letter" path={exp.joiningLetterPath} isEditing={isEditing}
          fileKey="joiningLetters" files={expFiles as any} onFile={(_, f) => onFile(index, "joiningLetters", f)} />
        <DocCard label="Relieving Letter" path={exp.relievingLetterPath} isEditing={isEditing}
          fileKey="relievingLetters" files={expFiles as any} onFile={(_, f) => onFile(index, "relievingLetters", f)} />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// CARD WRAPPER & STATUS BADGE
// ═══════════════════════════════════════════════════════════════

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
  const [formData, setFormData] = useState<any>({ experiences: [], children: [] });
  const [originalData, setOriginalData] = useState<any>({});
  const [aadharParts, setAadharParts] = useState({ p1: "", p2: "", p3: "" });
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const [commonFiles, setCommonFiles] = useState<Record<string, any>>({
    idProof: null, passportPhoto: null,
    tenthMarksheet: null, twelfthMarksheet: null,
    degreeCertificate: null, offerLetter: null,
  });

  const [expFilesList, setExpFilesList] = useState<ExpFiles[]>([
    { experienceCerts: null, joiningLetters: null, relievingLetters: null }
  ]);

  useEffect(() => {
    if (!authLoading && user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id, authLoading]);

  // Pre-fill form — FIX: map backend ChildDto.childDateOfBirth correctly
  useEffect(() => {
    if (!backendProfile) return;
    setProfile({ ...backendProfile });
    const bp = backendProfile as any;
    const isExp = bp.employeeExperience === "EXPERIENCED";
    const expDocs = bp.experiencedDocuments;
    const experiences = isExp ? (expDocs?.length ? expDocs : [{}]) : [];

    // FIX: backend returns childDateOfBirth string, not age
    const children = (bp.children || []).map((c: any) => ({
      childName: c.childName || "",
      gender: c.gender || "MALE",
      childDateOfBirth: c.childDateOfBirth || "",
    }));

    const mapped = {
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
      pfNumber: bp.pfNumber || "",
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
      children,
      experiences,
    };

    setFormData(mapped);
    setOriginalData(mapped);
    setExpFilesList(experiences.map(() => ({ experienceCerts: null, joiningLetters: null, relievingLetters: null })));

    const aadhar = bp.aadharNumber || "";
    setAadharParts({ p1: aadhar.slice(0, 4), p2: aadhar.slice(4, 8), p3: aadhar.slice(8, 12) });
  }, [backendProfile]);

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
    setExpFilesList(prev => { const u = [...prev]; u[index] = { ...u[index], [key]: file }; return u; });

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setProfilePicPreview(null);
    }
  };

  // Experience handlers
  const updateExperience = (index: number, field: string, value: any) =>
    setFormData((prev: any) => {
      const updated = [...(prev.experiences || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });

  const addExperience = () => {
    setFormData((prev: any) => ({ ...prev, experiences: [...(prev.experiences || []), {}] }));
    setExpFilesList(prev => [...prev, { experienceCerts: null, joiningLetters: null, relievingLetters: null }]);
  };

  const deleteExperience = (index: number) => {
    setFormData((prev: any) => ({ ...prev, experiences: (prev.experiences || []).filter((_: any, i: number) => i !== index) }));
    setExpFilesList(prev => prev.filter((_, i) => i !== index));
  };

  // Children handlers
  const updateChild = (index: number, field: string, value: any) =>
    setFormData((prev: any) => {
      const updated = [...(prev.children || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, children: updated };
    });

  // FIX: initialize with childDateOfBirth, not age
  const addChild = () =>
    setFormData((prev: any) => ({
      ...prev,
      children: [...(prev.children || []), { childName: "", gender: "MALE", childDateOfBirth: "" }]
    }));

  const deleteChild = (index: number) =>
    setFormData((prev: any) => ({
      ...prev,
      children: (prev.children || []).filter((_: any, i: number) => i !== index)
    }));

  // ── BUILD PAYLOAD — matches ProfileUpdateRequest exactly ──────
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
      pfNumber: formData.pfNumber,
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
      // FIX: send childName + gender + childDateOfBirth — matches ChildDto exactly
      children: (formData.children || []).map((c: ChildEntry) => ({
        childName: c.childName,
        gender: c.gender,
        childDateOfBirth: c.childDateOfBirth || null,
      })),
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

  // ── BUILD FILES — matches @PutMapping multipart keys ─────────
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
      await authService.updateProfileDetails(String(user.id), type, buildPayload(isExp), buildFiles(isExp));
      await fetchEmployeeProfile(user.id);
      setIsEditing(false);
      setProfilePicPreview(null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Failed to update profile.");
      setShowFailure(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setProfilePicPreview(null);
  };

  if (authLoading || loading)
    return <div className="flex h-[80vh] items-center justify-center"><CustomLoader label="Loading Profile..." /></div>;
  if (!profile) return <div className="p-8 text-center text-slate-400">No profile data found</div>;

  const bp = profile as any;
  const formatDate = (d?: string | Date) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "—";
  const isExperienced = bp.employeeExperience === "EXPERIENCED";
  const isMarried = formData.maritalStatus === "MARRIED" || bp.maritalStatus === "MARRIED";
  const fp = { formData, isEditing, onChange };

  const TABS = [
    { id: "details",    label: "Details" },
    { id: "personal",   label: "Personal" },
    { id: "address",    label: "Address" },
    { id: "financial",  label: "Financial" },
    { id: "employment", label: "Employment" },
    { id: "family",     label: "Family" },
    { id: "documents",  label: "Documents" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-0">

        {/* ── HEADER ── */}
        <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start gap-5">

            {/* Profile picture with camera overlay in edit mode */}
            <div className="relative shrink-0 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center overflow-hidden shadow-sm">
                {profilePicPreview
                  ? <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-black text-rose-600">{profile.name?.charAt(0)}</span>
                }
              </div>
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-white text-lg" />
                  </button>
                  {/* Small camera badge always visible in edit mode */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow cursor-pointer"
                    onClick={() => profilePicInputRef.current?.click()}>
                    <FaCamera className="text-white text-[8px]" />
                  </div>
                </>
              )}
              <input ref={profilePicInputRef} type="file" accept="image/*" hidden onChange={handleProfilePicChange} />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              {isEditing ? (
                <input
                  className="text-xl font-bold text-slate-800 border-b-2 border-indigo-300 bg-transparent focus:outline-none focus:border-indigo-500 w-full"
                  value={formData.name || ""}
                  onChange={e => onChange('name', e.target.value)}
                  placeholder="Full Name" />
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                  <StatusBadge status={bp.verificationStatus} />
                </div>
              )}
              <p className="text-xs font-semibold text-indigo-600">{formData.designation || bp.designation || "—"}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5"><FaEnvelope className="text-[10px]" /> {bp.email || "—"}</span>
                <span className="flex items-center gap-1.5"><FaPhone className="text-[10px]" /> {formData.contactNumber || bp.contactNumber || "—"}</span>
                <span className="flex items-center gap-1.5"><HiOutlineOfficeBuilding /> {bp.branch || "—"}</span>
                <span className="flex items-center gap-1.5"><HiOutlineLocationMarker /> Joined {formatDate(bp.joiningDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <FaEdit className="text-xs" /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50 min-w-20 justify-center">
                    {saving ? <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FaSave className="text-xs" /> Save</>}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
            <HiOutlineShieldCheck className="text-slate-300" />
            <span>Verification: <span className="font-semibold text-slate-500">{bp.verificationStatus || "PENDING"}</span></span>
            <span className="text-slate-200">·</span>
            <span>Role: <span className="font-semibold text-slate-500">{bp.role || "—"}</span></span>
            <span className="text-slate-200">·</span>
            <span>Type: <span className="font-semibold text-slate-500">{bp.employeeExperience || "—"}</span></span>
            {isEditing && <span className="ml-auto px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold animate-pulse">✏️ EDITING MODE</span>}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="bg-white border-x border-b border-slate-200 overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
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
                    <F label="Phone Number"    field="contactNumber"           {...fp} />
                    <RO label="Work Email"     value={bp.email} />
                    <F label="Personal Email"  field="personalEmail" type="email" {...fp} />
                    <F label="Emergency Contact" field="emergencyContactNumber" {...fp} />
                    <S label="Gender"     field="gender"     options={Object.values(GenderMap)}     displayVal={bp.gender}     {...fp} />
                    <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  </Card>
                  <Card title="Employment Overview">
                    <F label="Designation"  field="designation"  {...fp} />
                    <F label="Joining Date" field="joiningDate" type="date" {...fp} />
                    <RO label="Reporting Manager" value={bp.reportingName} />
                    <RO label="Role"              value={bp.role} />
                    <RO label="Biometric"         value={bp.biometricStatus} />
                    <RO label="VPN Status"        value={bp.vpnStatus} />
                    <div className="col-span-full pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          placeholder="React, Node.js, Spring Boot..."
                          value={formData.skillSet || ""} onChange={e => onChange('skillSet', e.target.value)} />
                      ) : (
                        <div className="flex flex-wrap gap-1.5 min-h-9 items-center">
                          {bp.skillSet?.length
                            ? bp.skillSet.map((s: string, i: number) => <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg border border-indigo-100">{s}</span>)
                            : <span className="text-slate-300 italic text-xs">—</span>}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ── PERSONAL ── */}
              {activeTab === "personal" && (
                <Card title="Personal Information" icon={<HiOutlineIdentification />} cols={3}>
                  <F label="First Name"  field="firstName"  {...fp} />
                  <F label="Last Name"   field="lastName"   {...fp} />
                  <S label="Gender"      field="gender"     options={Object.values(GenderMap)}     displayVal={bp.gender}     {...fp} />
                  <F label="Date of Birth" field="dateOfBirth" type="date" {...fp} />
                  <S label="Blood Group" field="bloodGroup" options={Object.values(BloodGroupMap)} formatOpt={v => v.replace(/_/g, ' ')} displayVal={bp.bloodGroup} {...fp} />
                  <S label="Marital Status" field="maritalStatus" options={Object.values(MaritalStatusMap)} displayVal={bp.maritalStatus} {...fp} />
                  <F label="Personal Email"     field="personalEmail"           type="email" {...fp} />
                  <F label="Emergency Contact"  field="emergencyContactNumber"              {...fp} />
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
                        {bp.aadharNumber ? `XXXX-XXXX-${bp.aadharNumber.slice(-4)}` : <span className="text-slate-300 italic text-xs font-sans">—</span>}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* ── ADDRESS ── */}
              {activeTab === "address" && (
                <Card title="Address Details" icon={<HiOutlineLocationMarker />}>
                  <TA label="Present Residence" field="presentAddress"  {...fp} />
                  <TA label="Permanent Address"  field="permanentAddress" {...fp} />
                </Card>
              )}

              {/* ── FINANCIAL ── */}
              {activeTab === "financial" && (
                <Card title="Financial Details" icon={<HiOutlineCreditCard />}>
                  <F label="Bank Name"    field="bankName"       {...fp} />
                  <F label="IFSC Code"    field="ifscCode"       {...fp} />
                  <F label="Bank Branch"  field="bankBranchName" {...fp} />
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</label>
                    {isEditing ? (
                      <input className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        value={formData.accountNumber || ""} onChange={e => onChange('accountNumber', e.target.value)} placeholder="Account number" />
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-700 min-h-10 flex items-center">
                        {formData.accountNumber ? `XXXXXXXX${formData.accountNumber.slice(-4)}` : <span className="text-slate-300 italic text-xs font-sans">—</span>}
                      </div>
                    )}
                  </div>
                  <F label="PF Number" field="pfNumber" {...fp} />
                  <RO label="Company" value={bp.companyName} />
                  {isExperienced && <F label="UAN Number" field="uanNumber" {...fp} />}
                </Card>
              )}

              {/* ── EMPLOYMENT ── FIX: correct field names from ProfileResponse */}
              {activeTab === "employment" && (
                <div className="space-y-5">
                  <Card title="Employment Details" icon={<HiOutlineOfficeBuilding />} cols={3}>
                    <F  label="Designation"       field="designation"  {...fp} />
                    {/* These come from Employee entity — read-only for employees */}
                    <RO label="Department"        value={bp.departmentName} />
                    <RO label="Branch"            value={bp.branch} />
                    <RO label="Country"           value={bp.country} />
                    <RO label="Company"           value={bp.companyName} />
                    <F  label="Joining Date"      field="joiningDate" type="date" {...fp} />
                    <RO label="Experience Type"   value={bp.employeeExperience} />
                    <RO label="Reporting Manager" value={bp.reportingName} />
                    <RO label="Biometric Status"  value={bp.biometricStatus} />
                    <RO label="VPN Status"        value={bp.vpnStatus} />
                    <div className="col-span-full pt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                      {isEditing ? (
                        <input className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={formData.skillSet || ""} onChange={e => onChange('skillSet', e.target.value)} placeholder="React, Spring Boot, MySQL..." />
                      ) : (
                        <div className="flex flex-wrap gap-1.5 min-h-9 items-center">
                          {bp.skillSet?.length
                            ? bp.skillSet.map((s: string, i: number) => <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg border border-indigo-100">{s}</span>)
                            : <span className="text-slate-300 italic text-xs">—</span>}
                        </div>
                      )}
                    </div>
                  </Card>

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
                        <div className="text-center py-8">
                          <p className="text-sm text-slate-300 italic">No experience history</p>
                          {isEditing && <button onClick={addExperience} className="mt-2 text-xs text-indigo-500 font-semibold">+ Add first experience</button>}
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
                    <Card title="Father's Details">
                      {isEditing && (
                        <label className="col-span-full flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                          <input type="checkbox" className="rounded" checked={formData.fatherAlive ?? true}
                            onChange={e => onChange('fatherAlive', e.target.checked)} />
                          <span>Father is alive</span>
                        </label>
                      )}
                      <F label="Full Name"    field="fatherName"        {...fp} />
                      <F label="Date of Birth" field="fatherDateOfBirth" type="date" {...fp} />
                      <F label="Occupation"   field="fatherOccupation"  span {...fp} />
                    </Card>
                    <Card title="Mother's Details">
                      {isEditing && (
                        <label className="col-span-full flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                          <input type="checkbox" className="rounded" checked={formData.motherAlive ?? true}
                            onChange={e => onChange('motherAlive', e.target.checked)} />
                          <span>Mother is alive</span>
                        </label>
                      )}
                      <F label="Full Name"    field="motherName"        {...fp} />
                      <F label="Date of Birth" field="motherDateOfBirth" type="date" {...fp} />
                      <F label="Occupation"   field="motherOccupation"  span {...fp} />
                    </Card>
                  </div>

                  {isMarried && (
                    <Card title="Spouse Details">
                      <F label="Spouse Name"    field="spouseName"          {...fp} />
                      <F label="Contact Number" field="spouseContactNumber" {...fp} />
                      <F label="Occupation"     field="spouseOccupation"    {...fp} />
                      <F label="Date of Birth"  field="spouseDateOfBirth"   type="date" {...fp} />
                    </Card>
                  )}

                  {isMarried && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Children</h3>
                        {isEditing && (
                          <button onClick={addChild}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-violet-200 text-violet-600 text-xs font-bold rounded-xl hover:bg-violet-50 transition-colors">
                            <FaPlus size={9} /> Add Child
                          </button>
                        )}
                      </div>
                      {(formData.children || []).length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-sm text-slate-300 italic">No children added</p>
                          {isEditing && <button onClick={addChild} className="mt-2 text-xs text-violet-500 font-semibold">+ Add child</button>}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(formData.children || []).map((child: ChildEntry, idx: number) => (
                            <ChildCard key={idx} index={idx} child={child} isEditing={isEditing}
                              canDelete={(formData.children || []).length > 0}
                              onUpdate={updateChild} onDelete={deleteChild} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── DOCUMENTS ──
                   Normal mode: ID Proof + Passport Photo → View only
                                Experience docs → View only
                   Edit mode:   all above + Change/Replace button
                   Academic docs shown only for FRESHER employees
              */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Documents</h3>

                  {/* Identity Documents — ID Proof + Passport Photo only */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Identity Documents</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DocCard label="ID Proof"       path={bp.idProofPath}      isEditing={isEditing} fileKey="idProof"      files={commonFiles} onFile={handleCommonFile} />
                      <DocCard label="Passport Photo" path={bp.passportPhotoPath} isEditing={isEditing} fileKey="passportPhoto" files={commonFiles} onFile={handleCommonFile} />
                    </div>
                  </div>

                  {/* Academic docs — FRESHER only */}
                  {!isExperienced && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Academic & Joining Documents</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <DocCard label="10th Marksheet"     path={bp.tenthMarksheetPath}    isEditing={isEditing} fileKey="tenthMarksheet"    files={commonFiles} onFile={handleCommonFile} />
                        <DocCard label="12th Marksheet"     path={bp.twelfthMarksheetPath}  isEditing={isEditing} fileKey="twelfthMarksheet"  files={commonFiles} onFile={handleCommonFile} />
                        <DocCard label="Degree Certificate" path={bp.degreeCertificatePath} isEditing={isEditing} fileKey="degreeCertificate" files={commonFiles} onFile={handleCommonFile} />
                        <DocCard label="Offer Letter"       path={bp.offerLetterPath}       isEditing={isEditing} fileKey="offerLetter"       files={commonFiles} onFile={handleCommonFile} />
                      </div>
                    </div>
                  )}

                  {/* Experience Documents — EXPERIENCED only */}
                  {isExperienced && (formData.experiences || []).length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Experience Documents</p>
                      <div className="space-y-4">
                        {(formData.experiences || []).map((exp: any, idx: number) => (
                          <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                            <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block uppercase tracking-widest">
                              {exp.companyName || `Company #${idx + 1}`}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* View always visible; Change only in edit mode */}
                              <DocCard label="Experience Cert" path={exp.experienceCertPath} isEditing={isEditing}
                                fileKey="experienceCerts" files={expFilesList[idx] as any || {}}
                                onFile={(_, f) => handleExpFile(idx, "experienceCerts", f)} />
                              <DocCard label="Joining Letter"  path={exp.joiningLetterPath}  isEditing={isEditing}
                                fileKey="joiningLetters"  files={expFilesList[idx] as any || {}}
                                onFile={(_, f) => handleExpFile(idx, "joiningLetters", f)} />
                              <DocCard label="Relieving Letter" path={exp.relievingLetterPath} isEditing={isEditing}
                                fileKey="relievingLetters" files={expFilesList[idx] as any || {}}
                                onFile={(_, f) => handleExpFile(idx, "relievingLetters", f)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* HR Rejection Banner */}
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

      {showFailure && <FailureModal title="Update Failed" message={errorMessage} onClose={() => setShowFailure(false)} />}
    </>
  );
};

export default EmployeeProfile;