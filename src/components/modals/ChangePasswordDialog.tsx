import React from "react";
import { ShieldAlert, ArrowRight, Lock } from "lucide-react";

interface ChangePasswordDialogProps {
    onClose: () => void;
    onGoToSettings: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ onClose, onGoToSettings }) => {
    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-300">

                <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="text-amber-600 w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-neutral-900">Update Your Password</h3>

                    <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            You are currently using a <span className="font-semibold text-neutral-900">default password</span> assigned by your Administrator.
                        </p>
                    </div>

                    <p className="text-neutral-500 mt-4 text-sm">
                        For your security, please create a unique password before continuing with your work.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex flex-col gap-3">
                    <button
                        onClick={onGoToSettings}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-200"
                    >
                        Change Password Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-500 font-medium py-3 rounded-xl transition-colors text-sm"
                    >
                        I'll do it later (Skip for now)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordDialog;