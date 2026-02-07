import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUserPlus,
  FaEllipsisV,
  FaEnvelope,
  FaUserEdit,
  FaUserSlash,
  FaUserCheck,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";

import type { Employee } from "../../types";
import { MOCK_TEAM_MEMBERS } from "../../../../mockData";
// import { MOCK_TEAM_MEMBERS } from "../";

/* ----------------------- HELPERS ----------------------- */

const generatePassword = () => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!";
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

/* ----------------------- COMPONENT ----------------------- */

const EmployeesView = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]); // soft delete UI-only

  /* ----------------------- LOAD MOCK DATA ----------------------- */

  useEffect(() => {
    setEmployees(MOCK_TEAM_MEMBERS);
  }, []);

  /* ----------------------- UPDATE LAYER ----------------------- */

  const updateEmployee = (id: number, changes: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, ...changes } : emp))
    );
  };

  /* ----------------------- FILTER ----------------------- */

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (hiddenIds.includes(emp.id)) return false;

      return `${emp.name} ${emp.email} ${emp.dept} ${emp.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [employees, searchTerm, hiddenIds]);

  /* ----------------------- ACTIONS ----------------------- */

  const toggleStatus = (emp: Employee) => {
    updateEmployee(emp.id, {
      status: emp.status === "ACTIVE" ? "ON LEAVE" : "ACTIVE",
    });
  };

  const toggleRole = (emp: Employee) => {
    updateEmployee(emp.id, {
      role: emp.role === "MANAGER" ? "EMPLOYEE" : "MANAGER",
    });
  };

  const editProfile = (emp: Employee) => {
    const dept = prompt("Enter new department", emp.dept);
    if (dept) updateEmployee(emp.id, { dept });
  };

  const resetPassword = (emp: Employee) => {
    const newPassword = generatePassword();
    alert(`New password for ${emp.name}:\n\n${newPassword}`);
  };

  const softDelete = (emp: Employee) => {
    if (confirm(`Remove ${emp.name} from active list?`)) {
      setHiddenIds(prev => [...prev, emp.id]);
    }
  };

  /* ----------------------- UI ----------------------- */

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-xs text-slate-500">
            Total Members: {filteredEmployees.length}
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold">
          <FaUserPlus /> Add Employee
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search name, email, department or role..."
          className="w-full pl-11 py-3 border rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y">
            <AnimatePresence>
              {filteredEmployees.map(emp => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50"
                >
                  <td className="p-4">
                    <p className="font-bold">{emp.name}</p>
                    <p className="text-xs text-slate-400 flex gap-1">
                      <FaEnvelope /> {emp.email}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-xs font-semibold">{emp.dept}</p>
                    <p className="text-[10px] font-bold text-indigo-600">
                      {emp.role}
                    </p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === emp.id ? null : emp.id)
                      }
                      className="p-2 hover:bg-slate-100 rounded"
                    >
                      <FaEllipsisV />
                    </button>

                    {activeMenuId === emp.id && (
                      <div className="absolute right-4 mt-2 w-56 bg-white border rounded-lg shadow-lg z-20">
                        <MenuItem
                          icon={
                            emp.status === "ACTIVE" ? (
                              <FaUserSlash />
                            ) : (
                              <FaUserCheck />
                            )
                          }
                          label={
                            emp.status === "ACTIVE"
                              ? "Mark On Leave"
                              : "Activate"
                          }
                          onClick={() => toggleStatus(emp)}
                        />
                        <MenuItem
                          icon={<FaUserEdit />}
                          label="Edit Profile"
                          onClick={() => editProfile(emp)}
                        />
                        <MenuItem
                          icon={<FaSyncAlt />}
                          label="Change Role"
                          onClick={() => toggleRole(emp)}
                        />
                        <MenuItem
                          icon={<FaSyncAlt />}
                          label="Reset Password"
                          onClick={() => resetPassword(emp)}
                        />
                        <MenuItem
                          icon={<FaTrash />}
                          label="Soft Remove"
                          danger
                          onClick={() => softDelete(emp)}
                        />
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ----------------------- MENU ITEM ----------------------- */

const MenuItem = ({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 ${
      danger ? "text-rose-600" : ""
    }`}
  >
    {icon} {label}
  </button>
);

export default EmployeesView;
