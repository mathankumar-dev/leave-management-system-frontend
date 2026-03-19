import React, { useEffect } from "react";
import "./landing.css";
import logo from "../assets/logo.png";

import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="logo" />
          <span>WENXT Technologies</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Driving Growth through Insurance Technology</h1>

          <p>
            Providing digital tools with the right strategy and architecture.
          </p>

          <button className="hero-btn">Get Started</button>
        </div>
      </section>

      {/* STATS */}
      <div className="stats" data-aos="zoom-in">
        <div className="stat-item">
          <h2>25+</h2>
          <p>Customers</p>
        </div>
        <div className="stat-item">
          <h2>50+</h2>
          <p>Projects</p>
        </div>
        <div className="stat-item">
          <h2>12</h2>
          <p>Countries</p>
        </div>
      </div>

      {/* ABOUT */}
      <section className="about-new" id="about">
        <div className="about-wrapper">

          <div className="about-text" data-aos="fade-right">
            <h2>About Us</h2>

            <p>
              <strong>WENXT Technologies LLC</strong> is headquartered in Dubai having an offshore office in Chennai, is a subsidiary of MaanSarovar Tech Solutions which has been delivering Insurance Technology solutions since 1999.
            </p>

            <p>
              We have more than two decades of experience in providing Digital Solutions to the Insurance industry. We help insurers by providing digital tools with the right digital strategy, approach, technology architecture, and tools to generate growth and competitive advantage in the insurance space.
            </p>

            <p>
              We have 25+ reference customers across UAE, Oman, Saudi Arabia, Bahrain, Lebanon, Egypt, Qatar, Dubai, USA, Tanzania, Zambia & India.
            </p>
          </div>

          <div className="about-image" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
              alt="team"
            />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <h2>Our Approach</h2>

        <div className="feature-grid">

          <div className="feature-card" data-aos="zoom-in">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
            <h3>Digital Strategy</h3>
            <p>Transform your business digitally</p>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="100">
            <img src="https://cdn-icons-png.flaticon.com/512/2721/2721297.png" />
            <h3>Tech Architecture</h3>
            <p>Modern scalable systems</p>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" />
            <h3>Integration</h3>
            <p>Seamless connectivity</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="footer-top">

          <div>
            <h3>WENXT Technologies</h3>
            <p>
              S-Floor, Fayola Towers, 200 Feet Radial Rd,<br />
              Pallikaranai, Chennai, Tamil Nadu - 600100
            </p>
            <p>Email: support@wenxttech.com</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p><a href="#home">Home</a></p>
            <p><a href="#features">Features</a></p>
            <p><a href="#about">About</a></p>
          </div>

          <div>
            <h4>Global Presence</h4>
            <p>UAE, Oman, Saudi Arabia, USA, India & more</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 WENXT Technologies</p>
          <p>
            <a href="#">Terms & Conditions</a> |{" "}
            <a href="#">Policies</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;