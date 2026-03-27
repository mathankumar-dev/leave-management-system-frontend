import wenxtdashboard from "@/assets/images/wenxtimage.png";
import logo from "@/assets/svg/logo.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
/* ── Count-up Hook ── */
export function useCountUp(target: number, animate: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!animate || hasRun.current) return;
    hasRun.current = true;
    const STEPS = 72;
    const step = target / STEPS;
    const delay = duration / STEPS;
    let cur = 0;
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setCount(target);
        setDone(true);
        clearInterval(id);
      } else {
        setCount(Math.floor(cur));
      }
    }, delay);
    return () => clearInterval(id);
  }, [animate, target, duration]);

  return { count, done };
}

/* ── Navbar ── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "Features", "About", "Contact"];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200" : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          {/* <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center overflow-hidden">
             <span className="text-white font-black text-xl">W</span>

          </div> */}
          <img src={logo} alt="" height={50} width={50} />
          {/* <span className="text-slate-900 font-semibold text-subheading hidden sm:block">WeNxt Technologies</span> */}
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center justify-end gap-2">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand transition-colors relative group">
                {l}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* <a href="#contact" className="hidden md:block bg-brand text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark hover:scale-105 transition-all shadow-md">
            Get Started
          </a> */}

          <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)}>
            <span className={`h-0.5 w-6 bg-slate-800 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-6 bg-slate-800 transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-slate-800 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-b border-slate-200 overflow-hidden transition-all duration-300 ${open ? "max-h-64 py-4" : "max-h-0"}`}>
        {links.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="block px-8 py-3 text-base font-semibold text-slate-600 hover:bg-blue-50" onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ── Hero Section ── */
export function Hero() {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-bg">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-160 h-160 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-100 h-100 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] mb-6 ">
            Simplifying <span className="text-primary-500">Leave </span>&  <span className="text-primary-500">Workforce</span> Management
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
            Manage employee leaves, track attendance, and streamline HR operations — all in one place.          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <button onClick={() => navigate('login')} className="bg-brand text-white px-8 py-3.5 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-all hover:scale-105 shadow-xl shadow-blue-500/30">
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="border-2 border-brand text-brand px-8 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition-all hover:scale-105">
              Explore Features
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <span className="text-sm text-slate-500">Trusted by <strong className="text-slate-800">25+ insurers</strong> worldwide</span>
          </div>
        </div>

        <div className="relative flex justify-center">
          {/* Main Hero Image Placeholder */}
          <div className="w-full max-w-lg aspect-square bg-slate-200 rounded-[50px] shadow-2xl animate-float overflow-hidden relative border-8 border-white">
            {/* <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              [Hero Image: Wenxt Dashboard]
            </div> */}
            <img src={wenxtdashboard} alt="" />
          </div>

          {/* Floating Badge (Example) */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl text-green-600">✅</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
              <p className="text-sm font-bold text-slate-800">25+ Clients Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Section ── */
export function HomeStats() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimate(true); }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const stats = [
    { target: 25, suffix: "+", label: "Customers", icon: "🤝", desc: "Insurance organisations trust WeNxt globally" },
    { target: 50, suffix: "+", label: "Projects", icon: "🚀", desc: "Successful implementations delivered on time" },
    { target: 12, suffix: "", label: "Countries", icon: "🌍", desc: "Nations where our platforms run in production" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-brand-bg to-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-brand uppercase tracking-widest font-bold text-sm mb-3">Impact at a Glance</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 ">Trusted. Proven. Global.</h2>
        <p className="text-slate-500 mb-16 max-w-xl mx-auto">We are building insurance technology across borders and lines of business.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s) => {
            const { count, done } = useCountUp(s.target, animate);
            return (
              <div key={s.label} className="bg-white border-2 border-slate-100 p-10 rounded-3xl hover:border-brand hover:-translate-y-2 transition-all group">
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-brand">{count}</span>
                  <span className={`text-3xl font-bold text-brand transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>{s.suffix}</span>
                </div>
                <p className="font-bold text-slate-800 uppercase tracking-wide text-sm mb-2">{s.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Features ── */
export function Features() {
  const features = [
    { icon: "🧠", title: "By Insurance Experts", desc: "Built by practitioners with 25+ years of domain expertise in life and health.", color: "bg-blue-50 text-blue-600" },
    { icon: "🔌", title: "API-Driven Integration", desc: "Open RESTful APIs connect your CRM and portals in days—not months.", color: "bg-emerald-50 text-emerald-600" },
    { icon: "☁️", title: "Cloud-Based", desc: "Elastic cloud infrastructure eliminates CAPEX. Scale instantly as you grow.", color: "bg-violet-50 text-violet-600" },
    { icon: "🎛️", title: "No-Code Config", desc: "Launch new insurance lines without touching a single line of code.", color: "bg-amber-50 text-amber-600" },
    { icon: "💱", title: "Multi-Currency", desc: "Handle local tax and FX requirements across 12+ countries seamlessly.", color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand uppercase tracking-widest font-bold text-sm mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900  ">Platform Capabilities</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group ${i >= 3 ? 'lg:col-span-1' : ''}`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{f.desc}</p>
              <button className="text-brand text-xs font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">Learn more →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
export function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} height={50} width={50} alt="" />
            <span className="font-bold">WeNxt Technologies</span>
          </div>
          <p className="text-sm leading-relaxed"> Manage employee leaves, track attendance, and streamline HR operations — all in one place.</p>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><span>🌐</span> <a href="#" className="hover:text-brand">www.wenxttech.com</a></li>
            <li className="flex gap-3"><span>📍</span> <span>S-Floor, Fayola Towers, Chennai, TN</span></li>
            <li className="flex gap-3"><span>✉️</span> <a href="mailto:info@wenxttech.com" className="hover:text-brand">info@wenxttech.com</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {["Home", "Features", "About", "Contact"].map(l => (
              <li key={l}><a href="#" className="hover:text-brand transition-all hover:pl-2">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Stay Updated</h4>
          <form className="flex flex-col gap-3">
            <input type="email" placeholder="your@email.com" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand text-white" />
            <button className="bg-brand text-white font-bold py-2.5 rounded-lg text-sm hover:bg-brand-dark transition-all">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <span>© 2026 WENXT Technologies Pvt Ltd. All rights reserved.</span>

      </div>
    </footer>
  );
}

/* ── Main Export ── */
export default function LandingPage() {
  return (
    <div className="selection:bg-brand selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <HomeStats />
        <Features />
      </main>
      <Footer />
    </div>
  );
}