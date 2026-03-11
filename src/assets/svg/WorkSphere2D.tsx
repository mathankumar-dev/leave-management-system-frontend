import { motion } from "framer-motion";

const modules = [
    { name: "LMS", color: "bg-teal-500", x: -120, y: -80, delay: 0 },
    { name: "HR", color: "bg-slate-800", x: 120, y: -80, delay: 0.5 },
    { name: "Payroll", color: "bg-primary-500", x: -100, y: 80, delay: 0.2 },
    { name: "Employee", color: "bg-yellow-600", x: 100, y: 80, delay: 0.7 },
];

const WorkSphere2D = () => {
    return (
        <div className="relative flex items-center justify-center w-full h-96 overflow-hidden">
            {modules.map((mod) => (
                <motion.div
                    key={mod.name}
                    initial={{ x: mod.x, y: mod.y }}
                    animate={{
                        y: [mod.y - 10, mod.y + 10, mod.y - 10],
                        rotate: [-1, 1, -1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: mod.delay
                    }}
                    className={`absolute p-4 rounded-xl shadow-sm text-white font-bold ${mod.color} cursor-pointer hover:scale-110 transition-transform`}
                >
                    {mod.name}
                </motion.div>
            ))}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="z-10 relative flex items-center justify-center w-76 h-76 rounded-full border overflow-hidden shadow-[0_0_50px_rgba(13,148,136,0.2)]"
            >
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                    <defs>
                        <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                            <stop offset="60%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                        <mask id="sphereMask">
                            <circle cx="50" cy="50" r="50" fill="url(#fade)" />
                        </mask>
                    </defs>

                    <g mask="url(#sphereMask)" stroke="#0D9488" strokeWidth="0.5" fill="none">
                        <ellipse cx="50" cy="50" rx="50" ry="10" />
                        <ellipse cx="50" cy="50" rx="50" ry="25" />
                        <ellipse cx="50" cy="50" rx="50" ry="40" />
                        <line x1="0" y1="50" x2="100" y2="50" />

                        <ellipse cx="50" cy="50" rx="10" ry="50" />
                        <ellipse cx="50" cy="50" rx="25" ry="50" />
                        <ellipse cx="50" cy="50" rx="40" ry="50" />
                        <line x1="50" y1="0" x2="50" y2="100" />
                    </g>
                </svg>

                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] pointer-events-none" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(13,148,136,0.4)] pointer-events-none" />

                <h1 className="z-20 text-2xl font-black text-black pointer-events-none">
                    Work<span className="text-primary-500">Sphere</span>
                </h1>
            </motion.div>



        </div>
    );
};

export default WorkSphere2D;