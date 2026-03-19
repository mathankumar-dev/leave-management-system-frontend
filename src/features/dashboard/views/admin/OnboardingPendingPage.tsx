import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import type { PendingOnboardingResponse } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisV, FaUserCheck, FaUserSlash, FaCheck } from 'react-icons/fa';

const OnboardingPendingPage: React.FC = () => {
    const { fetchOnboardingRequests, handleOnboardingDecision, loading, error } = useDashboard();
    const [requests, setRequests] = useState<PendingOnboardingResponse[]>([]);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    // State for the Decision Modal
    const [decisionModal, setDecisionModal] = useState<{
        isOpen: boolean;
        employeeId: number | null;
        bio: boolean;
        vpn: boolean;
    }>({ isOpen: false, employeeId: null, bio: false, vpn: false });

    useEffect(() => {
        const getData = async () => {
            const data = await fetchOnboardingRequests();
            setRequests(data || []);
        };
        getData();
    }, [fetchOnboardingRequests]);

    const submitDecision = async () => {
        if (!decisionModal.employeeId) return;

        const promises = [];
        if (decisionModal.bio) {
            promises.push(handleOnboardingDecision(decisionModal.employeeId, 'BIO', 'PROVIDED'));
        }
        if (decisionModal.vpn) {
            promises.push(handleOnboardingDecision(decisionModal.employeeId, 'VPN', 'PROVIDED'));
        }

        await Promise.all(promises);

        // Refresh local state
        const data = await fetchOnboardingRequests();
        setRequests(data || []);
        setDecisionModal({ isOpen: false, employeeId: null, bio: false, vpn: false });
    };

    if (error) return <div className="p-6 text-red-500 text-center font-black text-[10px] uppercase tracking-widest">Error: {error}</div>;

    return (
        <div className="w-full relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Pending Onboarding</h1>
                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
                    {requests.length} Requests Found
                </span>
            </div>

            <div className="relative w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm min-h-[450px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-800 text-white">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Member Identity</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Role</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Onboarding Status</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Options</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {requests.map((req) => (
                                <tr key={req.id} className="transition-colors duration-150 group hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-sm flex items-center justify-center text-[11px] font-black border transition-all bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-900 group-hover:text-white">
                                                {req.name?.charAt(0) || "?"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{req.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400 lowercase">{req.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-tighter">
                                            {req.role.replace(/_/g, " ")}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <StatusRow label="Bio" status={req.biometricStatus} />
                                            <StatusRow label="VPN" status={req.vpnStatus} />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right relative">

                                        <button
                                            onClick={() => {
                                                setDecisionModal({ isOpen: true, employeeId: req.id, bio: true, vpn: true });
                                                setActiveMenu(null);
                                            }}
                                            className="w-full bg-emerald-50 border-green-400  rounded-4xl text-center  px-3 py-2.5 text-[10px] font-black uppercase text-emerald-600 hover:bg-green-300 flex items-center gap-2"
                                        >
                                            <FaCheck size={12} /> Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Action Modal Overlay */}
                <AnimatePresence>
                    {decisionModal.isOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white border border-slate-200 rounded-sm shadow-2xl w-full max-w-[320px] overflow-hidden">
                                <div className="bg-slate-900 px-4 py-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Authorization Control</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select access modules to approve:</p>

                                    <SelectionCard
                                        label="Biometric System"
                                        active={decisionModal.bio}
                                        onClick={() => setDecisionModal(prev => ({ ...prev, bio: !prev.bio }))}
                                    />
                                    <SelectionCard
                                        label="VPN Network Access"
                                        active={decisionModal.vpn}
                                        onClick={() => setDecisionModal(prev => ({ ...prev, vpn: !prev.vpn }))}
                                    />

                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={() => setDecisionModal({ isOpen: false, employeeId: null, bio: false, vpn: false })}
                                            className="flex-1 px-3 py-3 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={!decisionModal.bio && !decisionModal.vpn}
                                            onClick={submitDecision}
                                            className="flex-1 px-3 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Fetching Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Processing Directory...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const SelectionCard = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`p-3 border flex items-center justify-between cursor-pointer transition-all ${active ? 'border-slate-900 bg-slate-50' : 'border-slate-100 opacity-60'}`}
    >
        <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">{label}</span>
        <div className={`h-4 w-4 rounded-sm border flex items-center justify-center transition-all ${active ? 'bg-slate-900 border-slate-900' : 'border-slate-200'}`}>
            {active && <FaCheck size={8} className="text-white" />}
        </div>
    </div>
);

const StatusRow = ({ label, status }: { label: string, status: string }) => (
    <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold text-slate-400 uppercase w-12 text-right">{label}:</span>
        <div className={`h-1.5 w-1.5 rounded-full ${status === 'COMPLETED' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : status === 'PENDING' ? "bg-amber-400" : "bg-red-400"}`} />
        <span className={`text-[9px] font-black uppercase ${status === 'COMPLETED' ? "text-slate-600" : status === 'PENDING' ? "text-amber-600" : "text-red-400"}`}>
            {status}
        </span>
    </div>
);

export default OnboardingPendingPage;