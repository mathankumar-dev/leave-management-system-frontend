import type { Payslip, PayslipCreateRequest, PayslipUpdateRequest } from '@/features/payroll/payrollTypes';
import api from '@/services/apiClient';


export const PayslipService = {

  createPayslip: async (data: PayslipCreateRequest): Promise<Payslip> =>
    (await api.post<Payslip>('/payslip/create', data)).data,


  updatePayslip: async (data: PayslipUpdateRequest): Promise<Payslip> =>
    (await api.put<Payslip>('/payslip/update', data)).data,

  deletePayslip: async (employeeId: number, year: number, month: number): Promise<void> =>
    void (await api.delete(`/payslip/${employeeId}/${year}/${month}`)),

  generatePayroll: async (year: number, month: number): Promise<void> =>
    void (await api.post(`/payroll/generate?year=${year}&month=${month}`)),

  preparePayroll: async (year: number, month: number): Promise<void> =>
    void (await api.post(`/payroll/prepare?year=${year}&month=${month}`)),


  getPayrollData: async (year: number, month: number): Promise<Payslip[]> =>
    (await api.get<Payslip[]>(`/payslip/payroll/${year}/${month}`)).data,


  exportPayrollCSV: async (year: number, month: number): Promise<string> =>
    (await api.get<string>(`/payslip/export/${year}/${month}`)).data,

  // getPrefill: async (employeeId: number, year: number, month: number): Promise<Payslip> =>
  //   (await api.get<Payslip>(`/payslip/prefill?employeeId=${employeeId}&year=${year}&month=${month}`)).data,

};