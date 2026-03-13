import api from '../../../../../api/axiosInstance';
import { type SalaryStructure, type Payslip, type EmployeeSalaryRequest, type EmployeeSalary } from '../types';


export const payslipService = {

  // POST /api/salary-structure
  getSalaryStructure: async (role: string): Promise<SalaryStructure> => {
    const response = await api.post<SalaryStructure>(`/salary-structure/`, { role });
    return response.data;
  },

  //PUT api/salary-structure => update
  updateSalaryStructure: async (role: string, data: Omit<SalaryStructure, 'role'>): Promise<SalaryStructure> => {
    const response = await api.put<SalaryStructure>(`/salary-structure/${role}`, data);
    return response.data;
  },

  // GET /api/salary-structure/all → all roles fetch
  getAllSalaryStructures: async (): Promise<SalaryStructure[]> => {
    const response = await api.get<SalaryStructure[]>('/salary-structure/all');
    return response.data;
  },

  // POST /api/employee-salary → set basic salary
  postEmployeeSalary: async (data: EmployeeSalaryRequest): Promise<EmployeeSalary> => {
    const response = await api.post<EmployeeSalary>('/employee-salary/assign', data);
    return response.data;
  },

  // GET /api/employee-salary/{employeeId} → fetch saved basic salary
  getEmployeeSalary: async (employeeId: number): Promise<EmployeeSalary> => {
    const response = await api.get<EmployeeSalary[]>(`/employee-salary/history/${employeeId}`, { silent: [404, 500] });
    return response.data[0];
  },

  // POST /api/payroll/generate → generate all employees payroll
  generatePayroll: async (year: number, month: number): Promise<void> => {
    await api.post(`/payroll/generate?year=${year}&month=${month}`);
  },

  // GET /api/payslip/{employeeId}/{year}/{month} → specific payslip
  getPayslip: async (employeeId: number, year: number, month: number): Promise<Payslip> => {
    const response = await api.get<Payslip>(`/payslip/employee/${employeeId}/${year}/${month}`, { silent: [404, 500] });
    return response.data;
  },

  //DELETE /api/payslip/payroll/{year}/{month} => delete payroll
  deletePayroll: async (year: number, month: number): Promise<void> =>
  void (await api.delete(`/payslip/payroll/${year}/${month}`)),

  // GET /api/payslip/export/{year}/{month} → all employees CSV
  exportPayslip: async (year: number, month: number): Promise<Payslip[]> => {
    const response = await api.get<Payslip[]>(`/payslip/payroll/${year}/${month}`);
    return response.data;
  },

};