import React from "react";
import { motion } from "framer-motion";
import { HiMiniUserGroup } from "react-icons/hi2";
import LoginForm from "../components/LoginForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50 overflow-hidden flex items-center justify-center">
      <div className="flex min-h-screen w-full">
        
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-[#60466C] relative overflow-hidden items-center justify-center p-16">
            <motion.div initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.2
                    }} className='flex flex-col items-center z-10'>
                    <HiMiniUserGroup size={100} className="mb-4 text-white" />
                    <h1 className='text-3xl text-white font-bold uppercase text-center leading-tight'>
                        Employee Management <br /> Portal
                    </h1>
                </motion.div>
        </div>

        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-50 relative">


                      <motion.div initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.2
                    }} className=' w-full max-w-md'>
 <LoginForm />
            </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;