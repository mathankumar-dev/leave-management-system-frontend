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

const FailureModal: React.FC<FailureModalProps> = ({ 
  title, 
  message, 
  buttonText = "Try Again", 
  onClose 
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const modalUI = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
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
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        // CHANGED: rounded-xl (matches Success Modal and Popup)
        className="relative bg-white w-full max-w-sm rounded-xl p-8 shadow-2xl text-center border border-slate-100"
      >
        <motion.div
          // Subtler shake animation for a pro feel
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ duration: 0.4, delay: 0.2 }}
          // CHANGED: rounded-lg (~8px) for icon container
          className="w-16 h-16 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm"
        >
          <FaTimesCircle />
        </motion.div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-2">
          {message}
        </p>

        <button
          onClick={onClose}
          // CHANGED: rounded-lg and standard font-bold for consistency
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-md shadow-rose-100 active:scale-[0.98]"
        >
          {buttonText}
        </button>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
};

export default FailureModal;