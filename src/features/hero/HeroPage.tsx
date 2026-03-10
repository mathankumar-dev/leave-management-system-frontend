import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaShieldAlt, FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import WenxtLogo from "../../components/ui/WenxtLogo";
import { FLASH_NEWS } from "../../constants/flash";
import { DAILY_MOTIVATION } from "../../constants/quotes";

import logoSVG from '../../assets/logo.svg';
const quotes = Object.values(DAILY_MOTIVATION);
const newsItems = Object.values(FLASH_NEWS);

const HeroPage: React.FC = () => {
    const navigate = useNavigate();
    const [newsIndex, setNewsIndex] = useState(0);

    const quoteIndex = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + 
                     ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        return dayOfYear % quotes.length;
    }, []);

    useEffect(() => {
        const newsInterval = setInterval(() => {
            setNewsIndex((prev) => (prev + 1) % newsItems.length);
        }, 7000);

        return () => clearInterval(newsInterval);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white selection:bg-indigo-100">

            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-12 lg:p-24 relative overflow-hidden">
                
                <div className="mb-6 flex items-center gap-3 bg-indigo-50 p-3 rounded-tr-xl rounded-br-xl border-l-4 border-indigo-600 max-w-sm">
                    <FaBullhorn className="text-indigo-600 animate-pulse flex-shrink-0" />
                    <div className="overflow-hidden h-5 flex-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={newsIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-indigo-900 font-bold text-xs md:text-sm block truncate"
                            >
                                {newsItems[newsIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-32 mb-12 border-l-4 border-slate-900 pl-6 flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Daily Inspiration
                    </span>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-900 font-black italic text-2xl md:text-3xl lg:text-4xl leading-tight"
                    >
                        "{quotes[quoteIndex]}"
                    </motion.p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center p-12 lg:p-24 bg-white border-l border-slate-100">
                <div className="max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <WenxtLogo />

                        <div className="mt-8 mb-12 text-slate-500 font-medium leading-relaxed">
                            Welcome back. Empowering your team with seamless technology 
                            and real-time collaboration tools. Log in to your secure workspace.
                        </div>

                        <button
                            onClick={() => navigate("/login")}
                            className="group flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:translate-y-1 active:shadow-none"
                        >
                            Get Started <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>

                    <div className="mt-24 pt-8 border-t border-slate-100 flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 cursor-pointer hover:text-slate-900 transition-colors">
                            <FaShieldAlt /> Privacy Policy
                        </div>
                        <div className="text-[10px] font-black uppercase text-slate-400 cursor-pointer hover:text-slate-900 transition-colors">
                            Terms of Service
                        </div>
                        <div className="text-[10px] font-black uppercase text-slate-400">
                            © 2026 Wenxt Technologies
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroPage;