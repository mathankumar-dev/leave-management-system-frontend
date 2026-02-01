import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";

interface FailureModalProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const FailureModal: React.FC<FailureModalProps> = ({ title, message, buttonText = "Try Again", onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const modalUI = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center border-b-[12px] border-rose-500/10"
      >
        <motion.div
          animate={{ x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner"
        >
          <FaTimesCircle />
        </motion.div>

        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed px-4">{message}</p>

        <button
          onClick={onClose}
          className="w-full bg-rose-600 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
        >
          {buttonText}
        </button>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
};

export default FailureModal;