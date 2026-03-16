import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import leaveImg from "../../../assets/leave.png";


// import {leave.png } from "@/assets/leave.png";

import { 
  ChevronRight, 
  ChevronLeft, 
  Paperclip, 
  Calendar, 
  FileText, 
  CheckCircle2,
  Clock,
  Umbrella,
  Heart,
  Coffee,
  Award
} from "lucide-react";

const LeaveApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    startDate: "",
    endDate: "",
    startHalfDay: false,
    endHalfDay: false,
    reason: "",
    attachment: null as File | null
  });

  const nextStep = () => setStep((p) => Math.min(3, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

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

  const leaveCategories = [
    { name: "Annual", icon: Umbrella, color: "blue", desc: "Planned vacation time" },
    { name: "Sick", icon: Heart, color: "red", desc: "Health recovery" },
    { name: "Casual", icon: Coffee, color: "amber", desc: "Personal matters" },
    { name: "Comp Off", icon: Award, color: "green", desc: "Compensatory leave" }
  ];

  // --- Step Progress Component ---
  const ProgressHeader = () => (
    <div className="flex items-center justify-between mb-10 px-4 relative">
      {/* Progress line background */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-10" />
      {/* Active progress line */}
      <motion.div 
        className="absolute top-5 left-0 h-0.5 bg-indigo-600 -z-10"
        initial={{ width: "0%" }}
        animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex flex-col items-center gap-2">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: step >= num ? 1 : 0.9,
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 font-bold shadow-sm ${
              step > num 
                ? "bg-indigo-600 border-indigo-600 text-white" 
                : step === num
                ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30"
                : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            {step > num ? <CheckCircle2 size={20} /> : num}
          </motion.div>
          <span className={`text-xs font-bold transition-colors ${
            step >= num ? "text-indigo-600" : "text-slate-400"
          }`}>
            {num === 1 ? "Category" : num === 2 ? "Dates" : "Details"}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5">
        
        {/* Left Side: Image/Branding Section */}
        <div className="lg:col-span-5 bg-linear-to-br rounded-2xl flex flex-col justify-between shadow-2xl shadow-indigo-900/20 border border-indigo-500/20 w-full">
          <img src={leaveImg} alt="Leave" className="w-full h-full object-cover rounded-2xl" />
        

          {/* <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl rotate-6 mb-6 flex items-center justify-center shadow-xl border border-white/30">
                <Calendar className="text-white -rotate-6" size={40} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Time Off<br />Request
              </h1>
              <p className="text-indigo-200 text-base leading-relaxed">
                Take the time you need. We've got you covered with a seamless leave application process.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Quick & Easy</p>
                    <p className="text-xs text-indigo-200">Submit in just 3 simple steps</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Instant Processing</p>
                    <p className="text-xs text-indigo-200">Fast approval workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-indigo-200/60 text-xs">
              Step {step} of 3 • {step === 1 ? "Select Category" : step === 2 ? "Choose Dates" : "Add Details"}
            </p>
          </div> */}
        </div>

        {/* Right Side: Step Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 md:p-10">
          <ProgressHeader />

          <AnimatePresence mode="wait">
            {/* STEP 1: Leave Category */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Select Leave Category</h2>
                  <p className="text-slate-500 text-sm">Choose the type of leave you need</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leaveCategories.map(({ name, icon: Icon, color, desc }) => (
                    <button
                      key={name}
                      onClick={() => setFormData({ ...formData, category: name })}
                      className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                        formData.category === name 
                          ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10 scale-[1.02]" 
                          : "border-slate-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all ${
                        formData.category === name 
                          ? "bg-indigo-600 text-white scale-110" 
                          : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }`}>
                        <Icon size={22} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">{name} Leave</h3>
                      <p className="text-xs text-slate-500">{desc}</p>
                      
                      {/* Radio indicator */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          formData.category === name 
                            ? "border-indigo-600 bg-indigo-600" 
                            : "border-slate-300"
                        }`}>
                          {formData.category === name && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  disabled={!formData.category}
                  onClick={nextStep}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                >
                  Continue <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Dates */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 mb-2">When are you away?</h2>
                  <p className="text-slate-500 text-sm">Select your leave dates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DateInput 
                    label="Starting Date" 
                    value={formData.startDate} 
                    onChange={(v: any) => setFormData({...formData, startDate: v})}
                    halfDay={formData.startHalfDay}
                    onHalfDayChange={() => setFormData({...formData, startHalfDay: !formData.startHalfDay})}
                  />
                  <DateInput 
                    label="Ending Date" 
                    value={formData.endDate}
                    min={formData.startDate}
                    onChange={(v: any) => setFormData({...formData, endDate: v})}
                    halfDay={formData.endHalfDay}
                    onHalfDayChange={() => setFormData({...formData, endHalfDay: !formData.endHalfDay})}
                  />
                </div>

                {/* Calculated Days Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-1">
                        Calculated Duration
                      </span>
                      <p className="text-xs font-medium text-slate-500">Automatically calculated</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-slate-800">{calculateTotalDays()}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase">Days</span>
                    </div>
                  </div>
                </motion.div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={prevStep} 
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.startDate || !formData.endDate}
                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Continue <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Final Details</h2>
                  <p className="text-slate-500 text-sm">Tell us more about your request</p>
                </div>

                <div className="space-y-5">
                  {/* Reason Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Reason for Absence
                    </label>
                    <textarea 
                      placeholder="Please provide details about your leave request..."
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 h-36 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 resize-none"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    />
                  </div>

                  {/* File Attachment */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Attach Documents (Optional)
                    </label>
                    <label className="flex items-center gap-4 p-5 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <Paperclip size={20} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-semibold text-sm">
                          {formData.attachment ? formData.attachment.name : "Click to upload supporting documents"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG up to 10MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, attachment: e.target.files?.[0] || null})}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={prevStep} 
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button 
                    disabled={!formData.reason}
                    onClick={() => console.log("Submitted:", formData)}
                    className="flex-[2] bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-500/30 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <CheckCircle2 size={20} /> Submit Application
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DateInput = ({ label, value, onChange, halfDay, onHalfDayChange, min }: any) => (
  <div className="space-y-3">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
      {label}
    </label>
    <input 
      type="date" 
      min={min}
      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button 
      type="button"
      onClick={onHalfDayChange}
      className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all ${
        halfDay 
          ? "bg-amber-100 text-amber-700 border-2 border-amber-300" 
          : "bg-slate-100 text-slate-500 border-2 border-slate-200 hover:bg-slate-200"
      }`}
    >
      <Clock size={14} /> {halfDay ? "Half Day Active" : "Set Half Day"}
    </button>
  </div>
);

export default LeaveApplicationForm;