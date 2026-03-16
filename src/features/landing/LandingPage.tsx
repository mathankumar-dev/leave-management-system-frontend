import "./landing.css";
import logo from "../assets/logo.png";
const LandingPage = () => {
  return (
    <>
      {/* HEADER */}

      <header>

        <div className="logo">
          <img src={logo} alt="logo"/>
          <h2>Wenxt Technologies</h2>
        </div>

        <nav>
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

      </header>

      {/* HERO */}

      <section className="hero">

        <div>
          <h1>Smart HRMS System</h1>
          <p>Manage Employees, Leave & Payroll in One Platform</p>
          <a className="btn" href="#">Get Started</a>
        </div>

      </section>

      {/* FEATURES */}

      <section className="features">

        <h2>HRMS Features</h2>

        <div className="feature-container">

          <div className="feature">
            <h3>Leave Management</h3>
            <p>Employees can apply leave and HR can approve instantly.</p>
          </div>

          <div className="feature">
            <h3>Payroll System</h3>
            <p>Automated salary calculation and payslip generation.</p>
          </div>

          <div className="feature">
            <h3>Employee Portal</h3>
            <p>Employees can check leave status and salary.</p>
          </div>

        </div>

      </section>

      {/* ABOUT */}

      <section className="about">

        <h2>About Us</h2>

        <div className="about-container">

          <div className="about-text">

            <p>
              WENXT Technologies LLC is headquartered in Dubai with an offshore
              office in Chennai providing Insurance Technology solutions.
            </p>

            <p>
              We help organizations with digital transformation and modern HR tools.
            </p>

            <p>
              We have customers across UAE, Oman, Saudi Arabia, Bahrain,
              Egypt, USA and India.
            </p>

          </div>

          <div className="about-stats">

            <div className="stat-box">
              <b>25+</b><br/>
              Customers
            </div>

            <div className="stat-box">
              <b>50+</b><br/>
              Projects
            </div>

            <div className="stat-box">
              <b>12</b><br/>
              Countries
            </div>

          </div>

        </div>

      </section>

      {/* BENEFITS */}

      <section className="benefits">

        <h2>Benefits</h2>

        <div className="benefit-list">

          <div className="benefit">✔ Time Saving</div>
          <div className="benefit">✔ Accurate Data</div>
          <div className="benefit">✔ Easy HR Management</div>
          <div className="benefit">✔ Employee Transparency</div>

        </div>

      </section>

      {/* CONTACT */}

      <section className="contact">

        <h2>Start Managing Your Workforce Today</h2>

        <p>
          📧 <a href="mailto:support@wenxttech.com">
          support@wenxttech.com
          </a>
        </p>

        <a className="btn" href="#">Contact Us</a>

      </section>

      {/* FOOTER */}

      <footer>
        <p>© 2026 Wenxt Technologies | HRMS System</p>
        <p>All Rights Reserved</p>
      </footer>

    </>
  );
};

export default LandingPage;