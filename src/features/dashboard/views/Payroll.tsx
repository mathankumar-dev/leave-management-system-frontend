import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePayroll } from "./hr/hooks/PayRollHook";
// import { usePayroll } from "./hooks/usePayroll";

interface Payslip {
  employeeId: number;
  month: number;
  year: number;

  basicSalary: number;
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;

  pf: number;
  esi: number;
  professionalTax: number;
  lop: number;

  netSalary: number;
  generatedDate: string;
}

const PayrollView: React.FC = () => {
  const { user } = useAuth();
  const { fetchPayroll, downloadPayslip, loading, error } = usePayroll();

  const [payslip, setPayslip] = useState<Payslip | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const now = new Date();
    fetchPayroll(now.getFullYear(), now.getMonth() + 1).then((data) => {
      setPayslip(data);
    });
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  if (!payslip)
    return <div className="p-10 text-center text-gray-500">Payslip not generated</div>;

  const totalIncome =
    (payslip.basicSalary ?? 0) +
    (payslip.hra ?? 0) +
    (payslip.conveyance ?? 0) +
    (payslip.medical ?? 0) +
    (payslip.otherAllowance ?? 0);

  const totalDeduction =
    (payslip.pf ?? 0) +
    (payslip.esi ?? 0) +
    (payslip.professionalTax ?? 0) +
    (payslip.lop ?? 0);

  return (
    <div className="max-w-4xl mx-auto bg-white border shadow p-8">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-xl font-bold">MONTHLY SALARY PAYSLIP</h1>
        <p className="text-sm text-gray-500">
          Month: {payslip.month}/{payslip.year}
        </p>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <Info label="Employee ID" value={payslip.employeeId} />
        <Info label="Generated Date" value={payslip.generatedDate} />
      </div>

      {/* Income vs Deduction Table */}
      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Income</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Deduction</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <Row left="Basic Salary" leftVal={payslip.basicSalary} right="PF" rightVal={payslip.pf} />
          <Row left="House Rent Allowance" leftVal={payslip.hra} right="ESI" rightVal={payslip.esi} />
          <Row left="Conveyance" leftVal={payslip.conveyance} right="Professional Tax" rightVal={payslip.professionalTax} />
          <Row left="Medical" leftVal={payslip.medical} right="Loss Of Pay" rightVal={payslip.lop} />
          <Row left="Other Allowance" leftVal={payslip.otherAllowance} right="" rightVal={0} />
          <tr className="font-bold">
            <td className="border p-2">Total</td>
            <td className="border p-2">{totalIncome}</td>
            <td className="border p-2">Total Deduction</td>
            <td className="border p-2">{totalDeduction}</td>
          </tr>
        </tbody>
      </table>

      {/* Net Salary */}
      <div className="text-right text-lg font-bold mb-6">Net Salary: {payslip.netSalary}</div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => downloadPayslip(payslip.year, payslip.month)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

const Row = ({ left, leftVal, right, rightVal }: any) => (
  <tr>
    <td className="border p-2">{left}</td>
    <td className="border p-2">{leftVal}</td>
    <td className="border p-2">{right}</td>
    <td className="border p-2">{rightVal || ""}</td>
  </tr>
);

const Info = ({ label, value }: any) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default PayrollView;