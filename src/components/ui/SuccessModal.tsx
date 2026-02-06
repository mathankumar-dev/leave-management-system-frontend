import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

interface SuccessModalProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title, message, buttonText, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const modalUI = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        // CHANGED: rounded-xl (~12px) for the main card to match modal
        className="relative bg-white w-full max-w-sm rounded-xl p-8 shadow-2xl text-center border border-slate-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          // CHANGED: rounded-lg (~8px) for the icon container
          className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm"
        >
          <FaCheckCircle />
        </motion.div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          // CHANGED: rounded-lg and adjusted typography to match "Continue" button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
        >
          {buttonText || "Continue"}
        </button>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
};

export default SuccessModal;