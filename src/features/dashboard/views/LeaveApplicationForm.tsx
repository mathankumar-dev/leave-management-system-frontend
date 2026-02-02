import React, { useState } from "react";
import { FaSpinner, FaPaperclip, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import SuccessModal from "../../../components/ui/SuccessModal";
import { useDashboard } from "../hooks/useDashboard";

const LeaveApplicationForm: React.FC = () => {
  const { applyLeave, loading, error } = useDashboard();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    startHalfDay: false,
    endHalfDay: false,
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null as File | null
  });

  /* ---------------- LOGIC ---------------- */
  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return "--";
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    let diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff <= 0) return "--";
    if (formData.startHalfDay) diff -= 0.5;
    if (formData.endHalfDay && diff > 0.5) diff -= 0.5;
    return diff;
  };

  const totalDays = calculateTotalDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string | Blob);
    });
    payload.append("totalDays", String(totalDays));
    const result = await applyLeave(payload);
    if (result) setSubmitted(true);
  };

  if (submitted) {
    return <SuccessModal title="Request Sent!" onClose={() => setSubmitted(false)} message="Your leave has been submitted." />;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6">
      {/* Responsive Container: Less padding and smaller radius on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-10"
      >
        <header className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#1e266d]">Apply for Leave</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Fill in the details to request time off.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          
          {/* 1. LEAVE TYPE DROPDOWN */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">Leave Category</label>
            <div className="relative group">
              <select
                required
                value={formData.type}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 appearance-none font-semibold text-[#1e266d] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer text-sm md:text-base"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="">Select Category</option>
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Comp Off</option>
              </select>
              <FaChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 pointer-events-none text-[10px]" />
            </div>
          </div>

          {/* 2. DATE GRID: Stacked on mobile, 2-column on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">Start Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 font-semibold text-[#1e266d] outline-none text-sm md:text-base"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <HalfDayToggle 
                label="Half Day" 
                active={formData.startHalfDay} 
                onClick={() => setFormData({...formData, startHalfDay: !formData.startHalfDay})} 
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">End Date</label>
                <input
                  type="date"
                  required
                  min={formData.startDate}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 font-semibold text-[#1e266d] outline-none text-sm md:text-base"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <HalfDayToggle 
                label="Ending Half Day" 
                active={formData.endHalfDay} 
                onClick={() => setFormData({...formData, endHalfDay: !formData.endHalfDay})} 
              />
            </div>
          </div>

          {/* 3. TOTAL DAYS PREVIEW */}
          <div className="bg-[#f8faff] rounded-xl md:rounded-2xl p-4 md:p-5 border border-indigo-50 flex items-center justify-between">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Calculated Duration</span>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Automated Calculation</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-[#1e266d]">{totalDays}</span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Days</span>
            </div>
          </div>

          {/* 4. REASON */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">Reason for absence</label>
            <textarea
              rows={3}
              required
              placeholder="Briefly explain your leave..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 font-medium text-[#1e266d] outline-none text-sm md:text-base"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          {/* 5. FOOTER ACTIONS */}
          <div className="pt-2 space-y-3">
            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 transition-all cursor-pointer group">
              <FaPaperclip className="text-xs md:text-sm" />
              <span className="text-xs md:text-sm font-bold truncate max-w-[80%]">
                {formData.attachment ? formData.attachment.name : "Attach Documents"}
              </span>
              <input type="file" className="hidden" onChange={(e) => setFormData({...formData, attachment: e.target.files?.[0] || null})} />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e266d] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-lg shadow-indigo-900/10 active:scale-[0.98] transition-all flex justify-center items-center gap-3"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit Application"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const HalfDayToggle = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <div className="flex items-center justify-between bg-slate-50/50 px-3 py-2 rounded-lg md:rounded-xl border border-slate-100">
    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">{label}</span>
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-4.5 md:w-10 md:h-5 rounded-full relative transition-colors duration-300 ${active ? "bg-indigo-500" : "bg-slate-200"}`}
    >
      <motion.div 
        animate={{ x: active ? 18 : 2 }}
        className="absolute top-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

export default LeaveApplicationForm;