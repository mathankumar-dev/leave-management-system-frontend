import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50 overflow-hidden flex items-center justify-center">
      <div className="flex  justify-center min-h-screen w-full">



        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-50 relative">


          <motion.div initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
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