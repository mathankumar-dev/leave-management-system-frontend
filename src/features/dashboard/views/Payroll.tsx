import React, { useEffect, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";

const PayrollView = () => {

  const { payslip, fetchPayslip, download, loading, error } = useDashboard();

  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // fetch once when page loads
  useEffect(() => {
    fetchPayslip(year, month);
  }, [year,month]);

  const search = () => {
    fetchPayslip(year, month);
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border shadow p-8">

      <h1 className="text-xl font-bold text-center mb-6">
        Employee Payslip
      </h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {/* SEARCH SECTION */}
      <div className="flex gap-4 mb-6">

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2"
          placeholder="Year"
        />

        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2"
          placeholder="Month"
        />

        <button
          onClick={search}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

      </div>

      {/* NO PAYSLIP */}
      {!payslip && (
        <div className="text-center text-gray-500">
          No Payslip Found
        </div>
      )}

      {/* PAYSLIP DISPLAY */}
      {payslip && (
        <>
          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">

            <Info
              label="Employee ID"
              value={payslip.employeeId}
            />

            <Info
              label="Month"
              value={`${payslip.month}/${payslip.year}`}
            />

          </div>

          {/* SALARY TABLE */}
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

              <Row
                left="Basic"
                leftVal={payslip.basicSalary}
                right="PF"
                rightVal={payslip.pf}
              />

              <Row
                left="HRA"
                leftVal={payslip.hra}
                right="ESI"
                rightVal={payslip.esi}
              />

              <Row
                left="Conveyance"
                leftVal={payslip.conveyance}
                right="Professional Tax"
                rightVal={payslip.professionalTax}
              />

              <Row
                left="Medical"
                leftVal={payslip.medical}
                right="LOP"
                rightVal={payslip.lop}
              />

              <Row
                left="Other Allowance"
                leftVal={payslip.otherAllowance}
                right=""
                rightVal=""
              />

            </tbody>
          </table>

          {/* NET SALARY */}
          <div className="text-right text-lg font-bold mb-6">
            Net Salary : ₹ {payslip.netSalary ?? 0}
          </div>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={() => download(year, month)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>

        </>
      )}

    </div>
  );
};





/* ---------- TABLE ROW ---------- */

const Row = ({ left, leftVal, right, rightVal }: any) => (

  <tr>

    <td className="border p-2">
      {left}
    </td>

    <td className="border p-2">
      {leftVal ?? 0}
    </td>

    <td className="border p-2">
      {right}
    </td>

    <td className="border p-2">
      {rightVal ?? 0}
    </td>

  </tr>

);





/* ---------- INFO BLOCK ---------- */

const Info = ({ label, value }: any) => (

  <div>

    <p className="text-gray-500">
      {label}
    </p>

    <p className="font-medium">
      {value ?? "-"}
    </p>

  </div>

);

export default PayrollView;