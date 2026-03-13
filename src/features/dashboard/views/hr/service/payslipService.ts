import api from '../../../../../api/axiosInstance';
import { type SalaryStructure, type Payslip, type PayslipRequest, type EmployeeSalaryRequest, type EmployeeSalary } from '../types';

// ─── CSV row type for export ──────────────────────────────────────
export interface PayslipExportRow {
  employeeId: number;
  year: number;
  month: number;
  basic: number;
  hra: number;
  transport: number;
  pf: number;
  tax: number;
  lop: number;
  netSalary: number;
}

export const payslipService = {

  // POST /api/payslip/generate → new payslip create
  generatePayslip: async (data: PayslipRequest): Promise<Payslip> => {
    const response = await api.post<Payslip>('/payslip/generate', data);
    return response.data;
  },

  // GET /api/salary-structure
  getSalaryStructure: async (role : string ): Promise<SalaryStructure> => {
    const response = await api.get<SalaryStructure>(`/salary-structure/${role}`);
    return response.data;
  },

  // POST /api/employee-salary → set basic salary
  setEmployeeSalary: async (data: EmployeeSalaryRequest): Promise<EmployeeSalary> => {
    const response = await api.post<EmployeeSalary>('/employee-salary/assign', data);
    return response.data;
  },

  // GET /api/employee-salary/{employeeId} → fetch saved basic salary
  getEmployeeSalary: async (employeeId: number): Promise<EmployeeSalary> => {
    const response = await api.get<EmployeeSalary>(`/employee-salary/${employeeId}`, { silent: [404,500] });
    return response.data;
  },

  // POST /api/payroll/generate → generate all employees payroll
  generatePayroll: async (year: number, month: number): Promise<void> => {
    await api.post(`/payroll/generate?year=${year}&month=${month}`);
  },

  // GET /api/payslip/{employeeId}/{year}/{month} → specific payslip
  getPayslip: async (employeeId: number, year: number, month: number): Promise<Payslip> => {
    const response = await api.get<Payslip>(`/payslip/${employeeId}/${year}/${month}`, { silent: [404,500] });
    return response.data;
  },

  // GET /api/payslip/export/{year}/{month} → all employees CSV
  exportPayslip: async (year: number, month: number): Promise<PayslipExportRow[]> => {
    const response = await api.get<string>(`/payslip/export/${year}/${month}`);
    // CSV parse pannuvom
    const lines = (response.data as unknown as string).trim().split('\n');
    const rows = lines.slice(1); // header skip
    return rows.map(line => {
      const [employeeId, year, month, basic, hra, transport, pf, tax, lop, netSalary] = line.split(',');
      return {
        employeeId: parseInt(employeeId),
        year: parseInt(year),
        month: parseInt(month),
        basic: parseFloat(basic),
        hra: parseFloat(hra),
        transport: parseFloat(transport),
        pf: parseFloat(pf),
        tax: parseFloat(tax),
        lop: parseFloat(lop),
        netSalary: parseFloat(netSalary),
      };
    });
  },

  // GET /api/payslip/export/range → history (keep for backward compat)
  exportPayslipRange: async (
    _employeeId: number,
    startYear: number, startMonth: number,
    endYear: number, endMonth: number
  ): Promise<Payslip[]> => {
    const response = await api.get<Payslip[]>(
      `/payslip/export/range?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`
    );
    return response.data;
  },

};