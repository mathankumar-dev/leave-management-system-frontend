import logo from "../../assets/logo.svg";
import heroBg from "../../assets/bg-img.jpeg"; 
import CTAButton from "../../components/ui/CTAButton";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    // min-h-screen ensures the page is at least as tall as the screen
    // overflow-y-auto ensures the page can actually scroll
    <div className="min-h-screen w-full bg-white text-slate-900 scroll-smooth overflow-y-auto">
      
      {/* HEADER - Sticky with Blur Effect */}
      <header className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <h2 className="text-xl font-bold tracking-tight">Wenxt Technologies</h2>
        </div>

        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="mailto:support@wenxttech.com" className="hover:text-indigo-600 transition-colors">Contact</a>
        </nav>
      </header>

      {/* HERO SECTION with Background Image */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroBg})`,
          }}
        />
        
        {/* White Overlay for Readability */}
        <div className="absolute inset-0 z-10 bg-white/70 md:bg-white/60" />

        {/* Content Layer */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Smart HRMS <br className="hidden md:block" /> System
          </h1>
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl font-medium">
            Manage Employees, Leave & Payroll in One Platform. Tailored for modern digital transformation.
          </p>
          <CTAButton onClick={() => navigate("/login")} label={"Get Started"} />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">HRMS Features</h2>
          <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Leave Management", desc: "Employees can apply leave and Team Members can approve instantly." },
            { title: "Payroll System", desc: "Automated salary calculation and payslip generation." },
            { title: "Employee Portal", desc: "Access dashboards to check leave status and salary." }
          ].map((f, i) => (
            <div key={i} className="p-10 bg-white border border-slate-100 rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-600">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION - Dark Theme */}
      <section id="about" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">About Us</h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
              <p>
                WENXT Technologies LLC is headquartered in Dubai with an offshore office in Chennai providing Insurance Technology solutions.
              </p>
              <p>
                We have customers across UAE, Oman, Saudi Arabia, Bahrain, Egypt, USA and India.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { val: "25+", label: "Customers" },
              { val: "50+", label: "Projects" },
              { val: "12", label: "Countries" }
            ].map((s, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 text-center">
                <b className="text-4xl text-indigo-400 block mb-1">{s.val}</b>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 px-6 text-center bg-slate-50">
        <h2 className="text-3xl font-bold mb-12">Why Choose WorkSphere?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["Time Saving", "Accurate Data", "Easy Management", "Transparency"].map((b) => (
            <div key={b} className="px-8 py-4 bg-white shadow-sm text-slate-700 rounded-2xl font-bold text-sm border border-slate-200 flex items-center gap-3">
              <span className="text-emerald-500 text-lg">✔</span> {b}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT/CTA SECTION */}
      <section className="py-24 px-6 bg-indigo-600 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Managing Your Workforce Today</h2>
        <p className="mb-10 text-indigo-100 text-lg max-w-xl mx-auto">
          Join 25+ organizations transforming their HR processes with our ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
            Contact Us
          </button>
          <a href="mailto:support@wenxttech.com" className="text-white font-medium underline underline-offset-4">
            support@wenxttech.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center text-slate-400 text-sm bg-white">
        <div className="mb-4 flex justify-center gap-6">
          <a href="#" className="hover:text-slate-600">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600">Terms of Service</a>
        </div>
        <p>© 2026 Wenxt Technologies | WorkSphere HRMS</p>
        <p className="mt-1 font-medium text-slate-300">All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;