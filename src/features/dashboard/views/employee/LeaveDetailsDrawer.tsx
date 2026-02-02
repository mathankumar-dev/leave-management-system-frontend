import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  title: string | null;
  onClose: () => void;
}

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" }
};

const LeaveDetailsDrawer: React.FC<Props> = ({ open, title, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-2xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black">{title} Details</h2>
              <button onClick={onClose}>✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <p>• Total Allocated: 24 days</p>
              <p>• Used: 5 days</p>
              <p>• Remaining: 19 days</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeaveDetailsDrawer;
