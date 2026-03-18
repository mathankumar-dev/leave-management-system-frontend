import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

interface User {
  name: string;
  role: string;
  designation: string;
  status: "Active" | "Inactive";
  email: string;
  avatar: string;
}

const users: User[] = [
  {
    name: "Robert Vance",
    role: "CFO",
    designation: "Chief Financial Officer",
    status: "Active",
    email: "rvance@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=1",
  },
  {
    name: "Elena Rodriguez",
    role: "Manager",
    designation: "AI Manager",
    status: "Active",
    email: "erod@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=2",
  },
  {
    name: "Marcus Wei",
    role: "Team Leader",
    designation: "Frontend Lead",
    status: "Inactive",
    email: "mwei@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=3",
  },
  {
    name: "Sarah Jenkins",
    role: "HR",
    designation: "People & Culture",
    status: "Active",
    email: "sjenks@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=4",
  },
  {
    name: "David Miller",
    role: "Admin",
    designation: "System Administrator",
    status: "Active",
    email: "dmiller@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=5",
  },
  {
    name: "Priya Sharma",
    role: "Employee",
    designation: "Software Developer",
    status: "Active",
    email: "priya@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=6",
  },
  {
    name: "Arun Kumar",
    role: "Employee",
    designation: "Backend Developer",
    status: "Inactive",
    email: "arun@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=7",
  },
  {
    name: "Meena Raj",
    role: "Admin",
    designation: "HR Administrator",
    status: "Active",
    email: "meena@wenxt.tech",
    avatar: "https://i.pravatar.cc/100?u=8",
  },
];

const Dashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("All Staff");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const adminUser = users.find((u) => u.role === "Admin");
    if (adminUser) setCurrentUser(adminUser);
  }, []);

  const filteredUsers = users
    .filter((user) =>
      selectedRole === "All Staff"
        ? true
        : user.role.toLowerCase() === selectedRole.toLowerCase()
    )
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logo} className="h-10 w-10" />
              <span className="text-2xl font-black">
                Wenxt <span className="text-indigo-600">Technologies</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Current User
                </p>
                <p className="text-sm font-bold">
                  {currentUser
                    ? `${currentUser.name} (${currentUser.role})`
                    : "Guest"}
                </p>
              </div>

              <img
                src={currentUser?.avatar || "https://i.pravatar.cc/150?u=guest"}
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>

          <nav className="flex space-x-8 mt-1">
            {["Dashboard", "Leave Request", "Payroll", "Reports", "Settings"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-bold text-slate-500 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 pb-2"
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>
      </header>
<section className="w-full py-12 px-6 bg-slate-50">
  <div className="grid md:grid-cols-3 gap-8 text-center">

    {/* VISION */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-3xl hover:scale-105 transition shadow-lg">
      <h2 className="text-2xl font-bold mb-2">VISION</h2>
      <p className="text-sm">
        Pioneering Insurance industry through Strategic Innovation and Digital-First solutions.
      </p>
    </div>

    {/* MISSION */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-3xl hover:scale-105 transition shadow-lg">
      <h2 className="text-2xl font-bold mb-4">MISSION</h2>
      <p className="text-sm mb-3">
        Empowering the Future of Insurance with purpose-driven solutions
      </p>
      <p className="text-sm">
        Driving sustainable innovation in delivering breakthrough solutions
      </p>
    </div>

    {/* VALUES */}
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-3xl hover:scale-105 transition shadow-lg">
      <h2 className="text-2xl font-bold mb-4">VALUES</h2>
      <p className="text-sm mb-3">
        Building an inclusive culture that focuses on growth and opportunity for all our stakeholders
      </p>
      <p className="text-sm">
        Integrity in everything we do
      </p>
    </div>

  </div>
</section>

      {/* MAIN */}
      <div className="flex flex-1 w-full p-6 gap-8">

        {/* SIDEBAR */}
        <aside className="w-80 hidden lg:block space-y-6">

          {/* THOUGHT */}
          <div className="bg-violet-100 p-6 rounded-3xl border border-violet-200">
            <p className=" text-indigo-700 font-bold mb-2">
              Thoughts
            </p>
            <p className="text-sm italic text-slate-700">
              "Insurtech isn't just about code; it's about engineering trust."
            </p>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-100 p-6 rounded-3xl border border-indigo-200">
            <h3 className="font-bold text-indigo-700 mb-3">📢 Announcements</h3>

            <div className="mb-3 p-3 bg-white rounded-xl border-l-4 border-amber-400">
              <p className="font-bold text-sm">Q4 Compliance Audit</p>
              <p className="text-xs text-slate-500">Finish before Friday</p>
            </div>

            <div className="mb-3 p-3 bg-white rounded-xl border-l-4 border-indigo-400">
              <p className="font-bold text-sm">Performance Update</p>
              <p className="text-xs text-slate-500">New modules live</p>
            </div>
          </div>

          {/* FLASH NEWS */}
          <div className="bg-violet-100 p-6 rounded-3xl border border-violet-200">
            <h3 className="font-bold text-violet-700 mb-3">⚡ Flash News</h3>

            <p className="text-xs font-bold text-violet-500">MARKET WIN</p>
            <p className="text-sm mb-3">
              Wenxt secured Global Claims Platform 🚀
            </p>

            <hr className="border-violet-200 mb-3" />

            <p className="text-xs font-bold text-violet-500">PRODUCT LAUNCH</p>
            <p className="text-sm">InsureAI v2.1 live</p>
          </div>

        </aside>

        {/* CONTENT */}
        <main className="flex-1">
          <div className="bg-white p-8 rounded-3xl border shadow-sm">

            <div className="flex justify-between mb-6">
              <h1 className="text-3xl font-bold">Welcome</h1>
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-xl h-10 mt-8 mr-16"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["All Staff", "Employee", "Manager", "HR", "Team Leader", "Admin", "CFO"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedRole(item)}
                  className={`px-4 py-2 rounded-xl text-xs ${
                    selectedRole === item
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <table className="w-full">
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 flex items-center gap-3">
                      <img src={user.avatar} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td>{user.role}</td>
                    <td>{user.designation}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;