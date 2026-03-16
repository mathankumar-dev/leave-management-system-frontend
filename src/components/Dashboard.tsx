import { useEffect, useState } from "react";
import "../components/dashboard.css";
import logo from "../assets/logo.png";

const Dashboard = () => {

  const quotes = [
    "Dream big and dare to fail.",
    "Push yourself because no one else will do it for you.",
    "Great things never come from comfort zones.",
    "Small progress is still progress.",
    "Success comes from consistency."
  ];

  const [date, setDate] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {

    setDate(new Date().toDateString());

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (
    <>
      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="logo">
          <img src={logo} alt="logo" />
          <span>Wenxt HRMS</span>
        </div>

        <a href="#">Dashboard</a>
        <a href="#">Employees</a>
        <a href="#">Leave</a>
        <a href="#">Attendance</a>
        <a href="#">Payroll</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>

      </div>

      {/* HEADER */}

      <div className="header">

        <h3>Welcome Dharshuu 👋</h3>

        <div className="date">
          📅 {date}
        </div>

      </div>

      {/* MAIN */}

      <div className="main">

        <div className="card">

          <h3>📰 Flash News</h3>

          <div className="news">
            <span>
              HR Policy Update Released | Training on March 20 | Company Annual Meet Coming Soon
            </span>
          </div>

        </div>

        <div className="card">

          <h3>🌟 Daily Motivation</h3>

          <div className="quote">
            {quotes[quoteIndex]}
          </div>

        </div>

        <div className="card">

          <h3>📢 Announcement</h3>

          <p>
            Tomorrow is Traditional Dress Day. Please wear ethnic attire.
          </p>

        </div>

        <div className="card">

          <h3>🎉 Celebrations</h3>

          <p>🎂 Rahul Birthday - March 16</p>
          <p>🏆 Employee of the Month - Priya</p>
          <p>🎓 HR Workshop - March 20</p>

        </div>

      </div>
    </>
  );
};

export default Dashboard;