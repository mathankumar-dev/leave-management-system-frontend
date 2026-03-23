import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { PUBLIC_HOLIDAYS_2026 } from "../../../shared/constants/holidays";



const LeavePolicies: React.FC = () => {
  const navigate = useNavigate();

  const generalGuidelines = [
    "Leave entitlements run on a calendar year basis (January to December).",
    "Employees joining during the year receive leaves on a pro-rata basis.",
    "Approval (except sick leave) must be obtained as far in advance as possible.",
    "New hires are not eligible for Annual Leave during their probation period.",
  ];

  const leaveTypes = [
    {
      type: "Annual Leave (AL)",
      details: [
        "Maximum 10 days of unutilized AL can be carried forward to the next year.",
        "Cannot be encashed under any circumstances.",
        "Cannot be clubbed with other categories except medical emergencies/SL.",
      ],
    },
    {
      type: "Sick Leave (SL)",
      details: [
        "Provided at the beginning of the year or at joining (pro-rated).",
        "Cannot be carried forward or encashed; unused SL lapses at year-end.",
      ],
    },
    {
      type: "Maternity & Paternity",
      details: [
        "Maternity Leave (ML) requires 2 months' advance notice for handovers.",
        "ML can be clubbed with all other leave categories.",
        "Paternity Leave must be availed within a month of childbirth or adoption.",
      ],
    },
  ];

  // Helper to format dates for the UI (e.g., 2026-01-15 -> Jan 15, 2026)
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="logo" className="h-10 w-10" />
            <span className="text-2xl font-black text-slate-800">
              Wenxt <span className="text-indigo-600">Technologies</span>
            </span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">
        {/* PAGE TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Leave Policy Guidelines</h1>
          {/* <p className="text-slate-500">Effective from 01 July 2023</p> */}
        </div>

        {/* POLICY SUMMARY TABLE (India) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 p-4">
            <h2 className="text-white font-bold uppercase text-xs tracking-widest">Entitlements: India</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Public Holidays</p>
                <p className="text-2xl font-black text-indigo-600">10</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Annual Leave</p>
                <p className="text-2xl font-black text-indigo-600">18</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sick Leave</p>
                <p className="text-2xl font-black text-indigo-600">12</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Maternity</p>
                <p className="text-2xl font-black text-indigo-600">90</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Paternity</p>
                <p className="text-2xl font-black text-indigo-600">5</p>
              </div>
            </div>
          </div>
        </div>



        {/* DETAILED SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-indigo-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-80">General Guidelines</h3>
            <ul className="space-y-4 text-sm font-medium">
              {generalGuidelines.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="opacity-50">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            {leaveTypes.map((category, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-indigo-600 mb-3">{category.type}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {category.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* PUBLIC HOLIDAYS SECTION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">📅</span>
            Public Holidays 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {Object.entries(PUBLIC_HOLIDAYS_2026).map(([date, name]) => (
              <div key={date} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm font-semibold text-slate-700">{name}</span>
                <span className="text-xs font-medium text-black bg-primary-500/20 px-2 py-1 rounded-md">
                  {formatDate(date)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER NOTE */}
        <footer className="bg-slate-100 p-6 rounded-3xl text-center border border-dashed border-slate-300">
          <p className="text-xs text-slate-500 italic">
            Confidential Notice: For Internal Circulation Only. Wenxt Technologies. All Rights Reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LeavePolicies;