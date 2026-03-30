export interface Payslip {
  employeeId: number;
  employeeName? : string;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;
  bonus: number;
  incentive: number;
  stipend: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  lopDays : number;
  lop: number;
  grossSalary: number;
  netSalary: number;
  variablePay : number;
}

export interface PayslipCreateRequest {
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;
  bonus: number;
  incentive: number;
  stipend: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  lop: number;
  lopDays : number;
  variablePay : number;
  status: string;
}

export interface PayslipUpdateRequest extends PayslipCreateRequest {}


export interface YearlySummary  {
  year: number;
  totalBasic: number;
  totalHra: number;
  totalConveyance: number;
  totalMedical: number;
  totalOtherAllowance: number;
  totalBonus: number;
  totalIncentive: number;
  totalStipend: number;
  totalPf: number;
  totalEsi: number;
  totalProfessionalTax: number;
  totalTds: number;
  totalLop: number;
  totalGrossSalary: number;
  totalNetSalary: number;
};