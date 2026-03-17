import React from "react";
import logo from "../../assets/logo.svg";
import { useState, useEffect} from "react";
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
}
];

const LaunchPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("All Staff");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleLogin = (user: User) => {
  setCurrentUser(user);
};
useEffect(() => {
  // Auto login first Admin user for demo/testing
  const adminUser = users.find(u => u.role === "ADMIN");
  if (adminUser) {
    setCurrentUser(adminUser);
  }
}, []);
  const filteredUsers = users
    .filter(user =>
      selectedRole === "All Staff"
        ? true
        : user.role.toLowerCase() === selectedRole.toLowerCase()
    )
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">

          <div className="py-3 flex items-center justify-between">

            <div className="flex items-center space-x-3">
              <div className=" rounded-lg p-1">
                <img
                  src={logo}
                  alt="logoicon"
                  className="h-10 w-10"
                />
              </div>
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
    {currentUser ? `${currentUser.name} (${currentUser.role})` : "Guest"}
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

      {/* MAIN */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8">

        {/* SIDEBAR */}
        <aside className="w-80 hidden lg:block space-y-6">
<div className="bg-indigo-700 p-6 rounded-3xl text-white 
            hover:-translate-y-1.25 hover:scale-102 transition-transform duration-300">
            <p className="text-xs uppercase mb-2">Thought of the Day</p>
            <p className="italic">
              "Insurtech isn't just about code; it's about engineering trust."
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm 
            hover:-translate-y-1.25 hover:scale-102 transition-transform duration-300">
            <h3 className="font-bold mb-4">📢Announcements</h3>

            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="font-bold">Q4 Compliance Audit</p>
                <p className="text-xs text-slate-500">
                  Finalize logs by Friday
                </p>
              </div>

              <div className="border-l-4 border-indigo-400 pl-3">
                <p className="font-bold">Performance Modules</p>
                <p className="text-xs text-slate-500">
                  New templates live
                </p>
              </div>
            </div>
          </div>
          <div className="flash-card w-full">
            <div className="flash-header">
              <span className="icon">⚡</span>
              <h3>Flash News</h3>
            </div>

            <div className="flash-item">
              <p className="tag">MARKET WIN</p>
              <p className="text">
                Wenxt secured the 'Global Claims Platform' contract! 🚀
              </p>
            </div>

            <div className="divider"></div>

            <div className="flash-item">
              <p className="tag">PRODUCT LAUNCH</p>
              <p className="text">
                'InsureAI v2.1' is now live for internal testing.
              </p>
            </div>
          </div>
    
        </aside>

        {/* CONTENT */}
        <main className="flex-1 space-y-6">

          <div className="bg-white p-8 rounded-3xl border shadow-sm">

            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Welcome</h1>
                <p className="text-sm text-slate-500">
                  Access Wenxt Technologies global talent pool
                </p>
              </div>

              <input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="px-4 py-2 border rounded-xl w-72 h-10 mt-8"
/>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
  {["All Staff", "Employee", "Manager", "HR", "Team Leader", "Admin", "CFO"].map((item) => (
    <button
      key={item}
      onClick={() => setSelectedRole(item)}
      className={`px-4 py-2 rounded-xl text-xs transition ${
        selectedRole === item
          ? "bg-indigo-500 text-white"
          : "bg-slate-100 hover:bg-indigo-500 hover:text-white"
      }`}
    >
      {item}
    </button>
  ))}
</div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 border-b">
                    <th className="pb-3">Profile</th>
                    <th className="pb-3 text-center">Role</th>
                    <th className="pb-3">Designation</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, i) =>(
                    <tr key={i} className="hover:bg-slate-50">

                      <td className="py-4 flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </td>

                      <td className="text-center">{user.role}</td>

                      <td>{user.designation}</td>

                      <td className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {user.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default LaunchPage;