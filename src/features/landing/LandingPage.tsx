import logo from "../../assets/logo.svg";
import heroBg from "../../assets/bg-img.jpeg"; 
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f6f9] text-slate-900 scroll-smooth overflow-y-auto">
      
      <header className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-12 py-4 bg-neutral-800 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <h2 className="text-xl font-bold tracking-tight">Wenxt Technologies</h2>
        </div>

        <nav className="flex gap-8 text-sm font-bold uppercase tracking-wide">
          <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          <a href="mailto:support@wenxttech.com" className="hover:text-blue-400 transition-colors">Contact</a>
        </nav>
      </header>

      {/* HERO SECTION - Using your Gradient & Unsplash style */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBg})`,
          }}
        />
        
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Employee Management
             <br className="hidden md:block" /> System
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl font-medium">
            Manage Employees, Leave & Payroll in One Platform.
          </p>

          <button 
            onClick={() => navigate("/login")}
            className="bg-[#2563eb] hover:bg-blue-700 text-white px-10 py-4 rounded-md font-bold text-lg transition-all shadow-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES SECTION - White Background like your CSS */}
      <section id="features" className="py-20 px-12 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">HRMS Features</h2>
          <div className="h-1 w-20 bg-[#2563eb] mx-auto" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-8">
          {[
            { title: "Leave Management", desc: "Employees can apply leave and Team Members can approve instantly." },
            { title: "Payroll System", desc: "Automated salary calculation and payslip generation." },
            { title: "Employee Portal", desc: "Access dashboards to check leave status and salary." }
          ].map((f, i) => (
            <div key={i} className="w-75 p-8 bg-[#f1f5f9] rounded-xl border border-slate-100 hover:shadow-lg transition-all text-center">
              <h3 className="text-xl font-bold mb-4 text-slate-800">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION - Light Gray (#e2e8f0) from your CSS */}
      <section id="about" className="py-20 px-12 bg-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-3/5 space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">About Us</h2>
            <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
              <p>WENXT Technologies LLC provides Insurance Technology solutions globally.</p>
              <p>Serving UAE, Oman, Saudi Arabia, Egypt, USA, and India.</p>
            </div>
          </div>
          
          <div className="lg:w-2/5 w-full flex flex-col gap-4">
            {[
              { val: "25+", label: "Customers" },
              { val: "50+", label: "Projects" }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <b className="text-3xl text-[#2563eb] block">{s.val}</b>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS - Pure White */}
      <section className="py-20 px-12 text-center bg-white">
        <h2 className="text-3xl font-bold mb-12 text-slate-800">Why Choose WorkSphere?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["Time Saving", "Accurate Data", "Easy Management", "Transparency"].map((b) => (
            <div key={b} className="px-10 py-5 bg-[#f1f5f9] text-slate-700 rounded-lg font-bold border border-slate-200">
              <span className="text-blue-600 mr-2">✔</span> {b}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT - Dark Navy from CSS */}
      <section className="py-16 px-6 bg-neutral-800 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Start Managing Your Workforce Today</h2>
        <a href="mailto:support@wenxttech.com" className="text-[#60a5fa] text-xl font-medium hover:underline">
          support@wenxttech.com
        </a>
      </section>

      {/* FOOTER - Extra Dark */}
      <footer className="py-8 bg-[#020617] text-neutral-400 text-center text-sm">
        <p>© 2026 Wenxt Technologies | WorkSphere HRMS</p>
        <p className="mt-1 opacity-50">All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;