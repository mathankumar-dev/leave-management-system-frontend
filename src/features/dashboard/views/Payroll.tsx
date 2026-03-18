import React, { useEffect, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PayrollView: React.FC = () => {
  const { payslip, fetchPayslip, loading, error } = useDashboard();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    fetchPayslip(year, month);
  }, [year, month]);

  const search = () => fetchPayslip(year, month);

  const formatCurrency = (val: any) =>
    val ? `₹ ${Number(val).toLocaleString("en-IN")}` : "₹ 0";

 const downloadPDF = () => {
  if (!payslip) return;
  setLoadingPDF(true);

  try {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(16);
    pdf.text("WENXT TECHNOLOGIES PRIVATE LIMITED", 105, 15, { align: "center" });
    pdf.setFontSize(10);
    pdf.text("Monthly Salary Payslip", 105, 22, { align: "center" });

    // Employee Details
    const details: [string, any][] = [
      ["Employee ID", payslip.employeeId],
      ["Month / Year", `${payslip.month}/${payslip.year}`],
      ["LOP Days", payslip.lopDays],
      ["Employee Name", payslip.employeeName ?? "--"],
      ["Designation", payslip.designation ?? "--"],
      ["UAN No", payslip.uan ?? "--"],
      ["PF Number", payslip.pf ?? "--"],
      ["Bank", payslip.bank ?? "--"],
      ["Account No", payslip.accountNumber ?? "--"],
    ];

    let startY = 30;
    details.forEach(([label, value]) => {
      pdf.text(`${label}: ${value}`, 14, startY);
      startY += 7;
    });
    startY += 5;

    // Salary Table
    autoTable(pdf, {
      startY,
      head: [["Income", "Amount", "Deductions", "Amount"]],
      body: [
        ["Basic Salary", formatCurrency(payslip.basicSalary), "PF", formatCurrency(payslip.pf)],
        ["HRA", formatCurrency(payslip.hra), "ESI", formatCurrency(payslip.esi)],
        ["Conveyance", formatCurrency(payslip.conveyance), "Professional Tax", formatCurrency(payslip.professionalTax)],
        ["Medical", formatCurrency(payslip.medical), "TDS", formatCurrency(payslip.tds)],
        ["Other Allowance", formatCurrency(payslip.otherAllowance), "LOP", formatCurrency(payslip.lop)],
        ["Variable Pay", formatCurrency(payslip.variablePay), "", ""],
        ["Bonus", formatCurrency(payslip.bonus), "", ""],
        ["Incentive", formatCurrency(payslip.incentive), "", ""],
        ["Stipend", formatCurrency(payslip.stipend), "", ""],
      ],
      foot: [
        [
          "Gross Salary",
          formatCurrency(payslip.grossSalary),
          "Total Deduction",
          formatCurrency(Number(payslip.grossSalary || 0) - Number(payslip.netSalary || 0)),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [220, 220, 220] },
    });

    const finalY = (pdf as any).lastAutoTable?.finalY || startY + 20;

    pdf.setFontSize(12);
    pdf.text(`Net Salary: ${formatCurrency(payslip.netSalary)}`, 150, finalY + 10);
    pdf.setFontSize(10);
    pdf.text(`Salary in Words: ${payslip.salaryInWords ?? "--"}`, 14, finalY + 20);

    pdf.text("Employee Signature", 14, finalY + 35);
    pdf.text("Authorized Signatory", 150, finalY + 35);

    // --- NEW: Open in new tab instead of file:/// ---
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Optional: also download
    pdf.save(`Payslip-${month}-${year}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  } finally {
    setLoadingPDF(false);
  }
};

  // Rows for UI Table
  const salaryRows = [
    ["Basic Salary", payslip?.basicSalary, "PF", payslip?.pf],
    ["HRA", payslip?.hra, "ESI", payslip?.esi],
    ["Conveyance", payslip?.conveyance, "Professional Tax", payslip?.professionalTax],
    ["Medical", payslip?.medical, "TDS", payslip?.tds],
    ["Other Allowance", payslip?.otherAllowance, "LOP", payslip?.lop],
    ["Variable Pay", payslip?.variablePay, "", ""],
    ["Bonus", payslip?.bonus, "", ""],
    ["Incentive", payslip?.incentive, "", ""],
    ["Stipend", payslip?.stipend, "", ""],
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white border shadow p-8">
      <h1 className="text-xl font-bold text-center mb-6">Employee Payslip</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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
        <button onClick={search} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        <button
          onClick={downloadPDF}
          disabled={loadingPDF || !payslip}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loadingPDF ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {!payslip && <div className="text-center text-gray-500">No Payslip Found</div>}

      {payslip && (
        <>
          <div className="bg-white border shadow-lg p-8 mb-6">
            <div className="text-center border-b pb-4 mb-6">
              <h2 className="text-lg font-bold">WENXT TECHNOLOGIES PRIVATE LIMITED</h2>
              <p className="text-xs text-gray-500">Monthly Salary Payslip</p>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm mb-6">
              <Info label="Employee ID" value={payslip.employeeId} />
              <Info label="Month / Year" value={`${payslip.month}/${payslip.year}`} />
              <Info label="LOP Days" value={payslip.lopDays} />
              <Info label="Employee Name" value={payslip.employeeName ?? "--"} />
              <Info label="Designation" value={payslip.designation ?? "--"} />
              <Info label="UAN No" value={payslip.uan ?? "--"} />
              <Info label="PF Number" value={payslip.pf ?? "--"} />
              <Info label="Bank" value={payslip.bank ?? "--"} />
              <Info label="Account No" value={payslip.accountNumber ?? "--"} />
            </div>

            {/* Salary Table */}
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Income</th>
                  <th className="border px-2 py-1">Amount</th>
                  <th className="border px-2 py-1">Deductions</th>
                  <th className="border px-2 py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {salaryRows.map(([left, leftVal, right, rightVal], i) => (
                  <Row key={i} left={left} leftVal={leftVal} right={right} rightVal={rightVal} />
                ))}
                <tr className="font-bold">
                  <td className="border px-2 py-1">Gross Salary</td>
                  <td className="border px-2 py-1">{formatCurrency(payslip.grossSalary)}</td>
                  <td className="border px-2 py-1">Total Deduction</td>
                  <td className="border px-2 py-1">{formatCurrency(Number(payslip.grossSalary || 0) - Number(payslip.netSalary || 0))}</td>
                </tr>
                <tr className="font-bold">
                  <td className="border px-2 py-1">Net Salary</td>
                  <td className="border px-2 py-1" colSpan={3}>{formatCurrency(payslip.netSalary)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Row component
const Row: React.FC<{ left: string; leftVal: any; right: string; rightVal: any }> = ({ left, leftVal, right, rightVal }) => (
  <tr>
    <td className="border px-2 py-1">{left}</td>
    <td className="border px-2 py-1">{leftVal ?? "₹ 0"}</td>
    <td className="border px-2 py-1">{right}</td>
    <td className="border px-2 py-1">{rightVal ?? "₹ 0"}</td>
  </tr>
);

// Info component
const Info: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value ?? "-"}</p>
  </div>
);

export default PayrollView;