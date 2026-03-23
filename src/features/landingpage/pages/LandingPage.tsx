import React, { useEffect } from "react";
import logo from "@/assets/images/bg-rm-logo-HRES.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {

  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-1000 flex justify-between items-center px-[10%] py-5 bg-white shadow-md">
        <div className="flex items-center gap-2.5">
          <img src={logo} className="w-10" alt="logo" />
          <span className="font-bold text-lg">WENXT <span className="text-primary-500">Technologies </span></span>
        </div>

        <div className="hidden md:flex gap-6">
          {["Home", "Features", "About", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative transition-colors hover:text-purple-600 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-500 after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="relative flex items-center justify-center text-center text-white py-32 px-[10%] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1551434678-e076c223a692')`
        }}
      >
        <div>
          <img src={logo} className="w-80 drop-shadow-2xl drop-shadow-black" alt="logo" />
        </div>

        <div className="max-w-2xl flex flex-col items-center gap-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Simplifying Leave & Workforce Management
          </h1>

          <p className="text-lg opacity-90">
            Manage employee leaves, track attendance, and streamline HR operations — all in one place.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="mt-2.5 px-7 py-3 bg-[#12b9b3] text-white font-semibold rounded-full transition-transform hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-[#12b9b3]"
          >
            Access Dashboard
          </button>
        </div>
      </section>

      {/* STATS */}
      <div
        data-aos="zoom-in"
        className="relative z-10 flex flex-col md:flex-row justify-around items-center gap-5 w-4/5 mx-auto -mt-12 p-10 bg-white rounded-xl shadow-2xl"
      >
        {[
          { label: "Customers", val: "25+" },
          { label: "Projects", val: "50+" },
          { label: "Countries", val: "12" },
        ].map((stat, i) => (
          <div key={i} className="text-center animate-bounce-slow">
            <h2 className="text-3xl font-bold text-purple-600">{stat.val}</h2>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section id="about" className="py-24 px-[10%] bg-gray-50">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1" data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-5">About Us</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">WENXT Technologies LLC</strong> is headquartered in Dubai having an offshore office in Chennai, is a subsidiary of MaanSarovar Tech Solutions which has been delivering Insurance Technology solutions since 1999.
              </p>
              <p>
                We have more than two decades of experience in providing Digital Solutions to the Insurance industry. We help insurers by providing digital tools with the right digital strategy, architecture, and tools.
              </p>
              <p>
                We have 25+ reference customers across UAE, Oman, Saudi Arabia, Bahrain, USA, India & more.
              </p>
            </div>
          </div>
          <div className="flex-1" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
              alt="team"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-[10%] text-center">
        <h2 className="text-3xl font-bold mb-10">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-aos="zoom-in" className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-lg">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-16 mx-auto mb-4" alt="Strategy" />
            <h3 className="font-bold text-xl mb-2">Digital Strategy</h3>
            <p className="text-gray-500">Transform your business digitally</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="100" className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-lg">
            <img src="https://cdn-icons-png.flaticon.com/512/2721/2721297.png" className="w-16 mx-auto mb-4" alt="Arch" />
            <h3 className="font-bold text-xl mb-2">Tech Architecture</h3>
            <p className="text-gray-500">Modern scalable systems</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200" className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-lg">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" className="w-16 mx-auto mb-4" alt="Integration" />
            <h3 className="font-bold text-xl mb-2">Integration</h3>
            <p className="text-gray-500">Seamless connectivity</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#7a4db3] text-white py-14 px-[10%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">WENXT Technologies</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              S-Floor, Fayola Towers, 200 Feet Radial Rd,<br />
              Pallikaranai, Chennai, Tamil Nadu - 600100
            </p>
            <p className="mt-3 text-sm">Email: support@wenxttech.com</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <div className="flex flex-col gap-2 text-gray-200 text-sm">
              <a href="#home" className="hover:underline">Home</a>
              <a href="#features" className="hover:underline">Features</a>
              <a href="#about" className="hover:underline">About</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Global Presence</h4>
            <p className="text-gray-200 text-sm">UAE, Oman, Saudi Arabia, USA, India & more</p>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-white/20 text-center text-sm text-gray-200">
          <p>© 2026 WENXT Technologies | <a href="#" className="hover:underline">Terms</a> | <a href="#" className="hover:underline">Policies</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;