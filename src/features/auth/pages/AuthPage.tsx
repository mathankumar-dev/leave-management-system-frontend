import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50 overflow-hidden flex items-center justify-center">
      <div className="flex min-h-screen w-full">
        
        {/* BRANDING PANEL */}
        <div className="hidden lg:flex w-1/2 bg-neutral-950 relative overflow-hidden items-center justify-center p-16">
          
          {/* VIBRANT GRADIENT BLOBS - Increased size and opacity */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-left glow - Your Base Blue #0066ff */}
            <div className="absolute top-[-20%] left-[-20%] w-200 h-200 bg-primary-500 rounded-full blur-[150px] opacity-40 animate-pulse" />
            
            {/* Bottom-right glow - Darker Blue #0052cc */}
            <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-primary-700 rounded-full blur-[130px] opacity-30" />
          </div>

          <div className="relative z-10 max-w-lg">

            
            <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
              Employee Leave <br /> 
              <span className="text-primary-500">Application</span>
            </h2>
            
            <p className="text-white text-lg font-medium leading-relaxed max-w-md">
              A centralized system to manage your leave requests, track balances, and stay updated with team availability.
            </p>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-50 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Professional "Spring" ease
            className="w-full max-w-md"
          >
            <LoginForm /> 

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;