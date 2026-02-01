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
        className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm"
        >
          <FaCheckCircle />
        </motion.div>

        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          {buttonText || "CONTINUE"}
        </button>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
};

export default SuccessModal;