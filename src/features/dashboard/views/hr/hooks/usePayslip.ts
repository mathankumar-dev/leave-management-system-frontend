import { useState, useCallback } from 'react';
import { payslipService } from '../service/payslipService';
import type { Payslip, SalaryStructure, EmployeeSalaryRequest } from '../types';

export function usePayslip() {

  // ─── States ───────────────────────────────────────
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [history, setHistory] = useState<Payslip[]>([]);
  const [payrollData, setPayrollData] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Salary Structure fetch (all roles) ───────────
  const fetchSalaryStructure = useCallback(async (): Promise<SalaryStructure[]> => {
    try {
      const data = await payslipService.getAllSalaryStructures();
      return data;
    } catch {
      setError('Failed to fetch salary structure');
      return [];
    }
  }, []);

  // ─── Get Employee Saved Salary ─────────────────────
  const fetchEmployeeSalary = useCallback(async (employeeId: number): Promise<number | null> => {
    try {
      const data = await payslipService.getEmployeeSalary(employeeId);
      return data?.basicSalary ?? null;
    } catch {
      return null;
    }
  }, []);

  // ─── Set Employee Basic Salary ─────────────────────
  const setEmployeeSalary = useCallback(async (data: EmployeeSalaryRequest) => {
    try {
      setLoading(true);
      await payslipService.postEmployeeSalary(data);
    } catch {
      setError('Failed to set salary');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch Specific Month Payslip ─────────────────
  const fetchPayslip = useCallback(async (
    employeeId: number, year: number, month: number
  ) => {
    try {
      setLoading(true);
      const data = await payslipService.getPayslip(employeeId, year, month);
      setPayslip(data);
    } catch {
      setPayslip(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch History — all employees, Jan to current month ─
  const fetchHistory = useCallback(async (
    _employeeId: number, year: number, month: number
  ) => {
    try {
      setLoading(true);
      // Jan → current month — all months fetch pannuvom
      const promises = Array.from({ length: month }, (_, i) =>
        payslipService.exportPayslip(year, i + 1).catch(() => [] as Payslip[])
      );
      const results = await Promise.all(promises);
      // All employees — filter illaye!
      const all = results.flat();
      // Sort by month desc — latest first
      all.sort((a, b) => b.month - a.month);
      setHistory(all);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Generate Payroll (all employees) ─────────────
  const generatePayroll = useCallback(async (year: number, month: number) => {
    try {
      setLoading(true);
      await payslipService.generatePayroll(year, month);
      const exportData = await payslipService.exportPayslip(year, month);
      setPayrollData(exportData);
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    payslip,
    history,
    payrollData,
    loading,
    error,
    fetchSalaryStructure,
    fetchEmployeeSalary,
    setEmployeeSalary,
    fetchPayslip,
    fetchHistory,
    generatePayroll,
  };
}