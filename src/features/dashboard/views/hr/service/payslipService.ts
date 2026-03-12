import api from '../../../../../api/axiosInstance';
import {type SalaryStructure, type Payslip, type PayslipRequest, type EmployeeSalaryRequest, type EmployeeSalary } from '../types';

export const payslipService = {

  // POST /api/payslip/generate → new payslip create
  generatePayslip: async (data: PayslipRequest): Promise<Payslip> => {
    const response = await api.post<Payslip>('/payslip/generate', data);
    return response.data;
  },

  //GET : api/salary-structure
  getSalaryStructure : async() : Promise<SalaryStructure> => {
    const response = await api.get<SalaryStructure>('/salary-structure');
    return response.data;
  },

  //POST : api/employee-salary
  setEmployeeSalary : async(data : EmployeeSalaryRequest): Promise<EmployeeSalary> => {
    const response = await api.post<EmployeeSalary>('/employee-salary', data);
    return response.data;
  },

  // POST : /api/payroll/generate
  generatePayroll: async (year: number, month: number): Promise<void> => {
    await api.post(`/payroll/generate?year=${year}&month=${month}`);
  },

  // GET : /api/payslip/{employeeId}/{year}/{month}
  getPayslip: async (employeeId: number, year: number, month: number): Promise<Payslip> => {
    const response = await api.get<Payslip>(`/payslip/${employeeId}/${year}/${month}`, {silent : true});
    return response.data;
  },

  // 6. GET /api/payslip/export/range
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



