import logo from "@/assets/images/bg-rm-logo-HRES.png";
import { motion } from "framer-motion";
import React from "react";
import LoginForm from "../components/LoginForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden flex">
      <div className="flex flex-row w-full">

        {/* LEFT SIDE: FORM PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2
            }}
            className='w-full max-w-md'
          >
            <LoginForm />
          </motion.div>
        </div>

        {/* RIGHT SIDE: GRAPHIC PANEL */}
        {/* Added flex, items-center, and justify-center to the container below */}
        <div className="hidden lg:flex lg:w-1/2  relative overflow-hidden items-center justify-center">
          
          {/* Background Gradient */}
          {/* <div className="absolute inset-0 bg-linear-to-br from-[#0edd99] via-white to-[#0da8bf] opacity-90" /> */}

          {/* Decorative shapes - set to absolute so they don't push the logo */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-64 bg-blue-400/30 rounded-full rotate-45 blur-xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-96 bg-primary-500/20 rounded-full rotate-45 blur-2xl" />
          </div>

          {/* LOGO: Now centered within the flex container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10 flex items-center justify-center"
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="max-w-[80%] h-auto object-contain" 
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;