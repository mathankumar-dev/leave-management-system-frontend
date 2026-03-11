import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomLoader from "../../../components/ui/CustomLoader";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePayroll } from "./hr/hooks/PayRollHook";

interface PayrollRecord {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  lopDeduction: number;
  netSalary: number;
  generatedDate: string;
}

const PayrollView: React.FC = () => {
  const { user } = useAuth();
  const { fetchPayroll, loading } = usePayroll();

  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadPayroll = async () => {
      const data = await fetchPayroll(user.id);
      setPayroll(data);
    };

    loadPayroll();
  }, [user?.id, fetchPayroll]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CustomLoader label="Loading Payroll" />
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500">
        Payroll has not been generated yet
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header>
        <h2 className="text-lg font-bold text-slate-900">Payroll Summary</h2>
        <p className="text-xs text-slate-500">
          Salary breakdown for {payroll.month}/{payroll.year}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm"
      >
        {/* Net Salary */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-emerald-500 text-xl" />
            <div>
              <p className="text-xs text-slate-500 uppercase">Net Salary</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{(payroll.netSalary ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <FaCalendarAlt />
            Generated{" "}
            {payroll.generatedDate
              ? new Date(payroll.generatedDate).toLocaleDateString()
              : "-"}
          </div>
        </div>

        {/* Earnings */}
        <div className="mb-6">
          <h3 className="text-xs font-black text-slate-500 uppercase mb-3">
            Earnings
          </h3>

          <div className="space-y-2 text-sm">
            <Row label="Basic Salary" value={payroll.basicSalary} />
            <Row label="HRA" value={payroll.hra} />
            <Row label="Transport Allowance" value={payroll.transportAllowance} />
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="text-xs font-black text-slate-500 uppercase mb-3">
            Deductions
          </h3>

          <div className="space-y-2 text-sm">
            <Row label="PF Deduction" value={payroll.pfDeduction} />
            <Row label="Tax Deduction" value={payroll.taxDeduction} />
            <Row label="Loss Of Pay" value={payroll.lopDeduction} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Row = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value?: number;
  bold?: boolean;
}) => (
  <div className="flex justify-between">
    <span className={`text-slate-600 ${bold ? "font-bold" : ""}`}>
      {label}
    </span>
    <span className={`text-slate-900 ${bold ? "font-bold" : ""}`}>
      ₹{(value ?? 0).toLocaleString()}
    </span>
  </div>
);

export default PayrollView;