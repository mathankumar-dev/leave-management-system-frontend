import api from '../../../../../services/apiClient';
import type { Payslip, PayslipCreateRequest, PayslipUpdateRequest } from '../../types';
// import type { CFOPayslip, CFOPayslipCreateRequest, CFOPayslipUpdateRequest } from '../types';

export const PayslipService = {

  // POST /api/payslip/create
  createPayslip: async (data: PayslipCreateRequest): Promise<Payslip> =>
    (await api.post<Payslip>('/payslip/create', data)).data,



  // PUT /api/payslip/update
  updatePayslip: async (data: PayslipUpdateRequest): Promise<Payslip> =>
    (await api.put<Payslip>('/payslip/update', data)).data,



  // DELETE /api/payslip/{employeeId}/{year}/{month}
  deletePayslip: async (employeeId: number, year: number, month: number): Promise<void> =>
    void (await api.delete(`/payslip/${employeeId}/${year}/${month}`)),


  // POST /api/payroll/generate?year=&month=
  generatePayroll: async (year: number, month: number): Promise<void> =>
    void (await api.post(`/payroll/generate?year=${year}&month=${month}`)),


  // POST /api/payroll/prepare?year=&month= → copy from previous month
  preparePayroll: async (year: number, month: number): Promise<void> =>
    void (await api.post(`/payroll/prepare?year=${year}&month=${month}`)),


  // GET /api/payslip/payroll/{year}/{month} → all employees
  getPayrollData: async (year: number, month: number): Promise<Payslip[]> =>
    (await api.get<Payslip[]>(`/payslip/payroll/${year}/${month}`)).data,


  // GET /api/payslip/export/{year}/{month} → CSV blob
  exportPayrollCSV: async (year: number, month: number): Promise<string> =>
    (await api.get<string>(`/payslip/export/${year}/${month}`)).data,

  // GET /api/payslip/prefill?employeeId=&year=&month=
  getPrefill: async (employeeId: number, year: number, month: number): Promise<Payslip> =>
    (await api.get<Payslip>(`/payslip/prefill?employeeId=${employeeId}&year=${year}&month=${month}`)).data,

};