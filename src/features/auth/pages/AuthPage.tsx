import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFingerprint, FaQuoteLeft } from "react-icons/fa";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden flex items-center justify-center">
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
        className={`flex min-h-screen w-full transition-all duration-700 ${isLogin ? "flex-row" : "flex-row-reverse"}`}
      >
        {/* BRANDING PANEL */}
        <motion.div
          layout
          className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-16"
        >
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
          </div>

          <motion.div layout className="relative z-10 max-w-lg">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-12">
              <FaFingerprint className="text-slate-900 text-3xl" />
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-8">
              {isLogin ? "Leave Management System" : "Employee Registration"}
            </h2>
            <div className="pt-8 border-t border-white/10">
              <FaQuoteLeft className="text-indigo-500 text-3xl mb-4 opacity-50" />
              <p className="text-slate-300 text-xl font-medium italic">
                {isLogin 
                  ? "Rest is not idleness... it is by no means a waste of time."
                  : "Maintain core employee details for seamless reporting."}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.div 
          layout
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
        >
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  <>
                    {/* LoginForm no longer needs props as it uses useAuth() internally */}
                    <LoginForm /> 
                    <p className="mt-8 text-center text-sm font-bold text-slate-500">
                      Don't have an account?{" "}
                      <button 
                        onClick={() => setIsLogin(false)}
                        className="text-indigo-600 font-black uppercase tracking-widest text-[11px] hover:underline transition-all"
                      >
                        Sign Up
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <RegisterForm onToggle={() => setIsLogin(true)} />
                    <p className="mt-8 text-center text-sm font-bold text-slate-500">
                      Already have an account?{" "}
                      <button 
                        onClick={() => setIsLogin(true)}
                        className="text-indigo-600 font-black uppercase tracking-widest text-[11px] hover:underline transition-all"
                      >
                        Sign In
                      </button>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;