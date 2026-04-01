
import loginAnimation from "@/assets/animations/login.json"; // Your .json file
import Lottie from "lottie-react"; // Standard Lottie component
import { motion } from "framer-motion";
import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden flex selection:bg-brand selection:text-white">
      <div className="flex flex-row w-full">

        {/* LEFT SIDE: FORM PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='w-full max-w-md'
          >
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-brand mb-8 transition-all duration-300"
            >
              <FaArrowCircleLeft className="text-2xl transition-transform group-hover:-translate-x-1" />
            </button>

            <LoginForm />
          </motion.div>
        </div>

        {/* RIGHT SIDE: GRAPHIC PANEL */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-brand-bg">

          {/* Background Blobs for consistency with Landing Page */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-120 h-120 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-100 h-100 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/20 to-brand/5" />

          {/* LOTTIE ANIMATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
            className="relative z-10 flex items-center justify-center w-full max-w-112.5"
          >
            <Lottie 
              animationData={loginAnimation} 
              loop={true} 
              autoplay={true} 
            />
          </motion.div>

          {/* Footer Branding */}
          <div className="absolute bottom-8 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            © 2026 WENXT Technologies
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;