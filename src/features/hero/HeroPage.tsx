import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaShieldAlt, FaBullhorn, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FLASH_NEWS } from "../../constants/flash";
import { DAILY_MOTIVATION } from "../../constants/quotes";
import EMPortalLogo from "../../assets/svg/EmployeePortalSVG";
import NameSVG from "../../assets/svg/NameSVG";
import WorkSphere2D from "../../assets/svg/WorkSphere2D";

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
        <div className="relative min-h-screen w-full flex flex-col bg-white selection:bg-indigo-100 overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-24 right-10 max-w-xs bg-white border border-slate-100 shadow-lg rounded-lg p-4"
            >
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">
                    Inspiration
                </p>

                <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-sm font-semibold italic text-slate-800"
                >
                    "{quotes[quoteIndex]}"
                </motion.p>
            </motion.div>

            <header className="w-full h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-16">
                <div className="h-10 w-45 flex">
                    <NameSVG />

                </div>

                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-slate-900 font-bold text-sm uppercase tracking-tighter hover:bg-primary-500 hover:text-white transition-all active:scale-95"
                >
                    <FaLock className="text-xs" /> Login
                </button>
            </header>

            <main className="flex-1 flex flex-col md:flex-row">


                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 lg:p-24 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="flex flex-col font-black italic text-slate-900 leading-[0.8]">
                            <span className="text-4xl lg:text-7xl tracking-tight opacity-90">
                                WORK
                            </span>
                            <span className="text-7xl lg:text-9xl not-italic uppercase tracking-tighter text-primary-500 -ml-1 lg:-ml-2">
                                Sphere.
                            </span>
                        </h1>

                        <p className="text-slate-500 text-lg max-w-sm font-medium leading-relaxed">
                            A high-performance portal for tracking leaves, managing team metrics,
                            and keeping your workspace architectural and clean.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-primary-500 transition-all  active:translate-y-1 active:shadow-none"
                        >
                            Get Started <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </motion.div>

                    {/* <div className="space-y-4 pt-8">
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600 max-w-md">
                            <FaBullhorn className="text-indigo-600 animate-bounce shrink-0" />
                            <div className="overflow-hidden h-5 flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={newsIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-slate-700 font-bold text-xs block truncate"
                                    >
                                        {newsItems[newsIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div> */}
                </div>

                {/* RIGHT COLUMN*/}
                <div className="w-full md:w-1/2  flex items-center justify-center p-12 ">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-lg drop-shadow-2xl"
                    >
                        <WorkSphere2D />
                    </motion.div>
                </div>
            </main>

            {/* FOOTER SECTION */}
            <footer className="w-full p-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-8">
                    <button onClick={() => navigate("/privacy-policy")} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2">
                        <FaShieldAlt /> Privacy Policy
                    </button>
                    <button onClick={() => navigate("/terms-of-service")} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors">
                        Terms of Service
                    </button>
                </div>
                <div className="text-[10px] font-black uppercase text-slate-300">
                    © 2026 Wenxt Technologies • v1.0.0
                </div>
            </footer>
        </div>
    );
};

export default HeroPage;