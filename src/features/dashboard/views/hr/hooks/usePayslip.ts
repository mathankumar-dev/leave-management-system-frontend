import { useState, useCallback } from 'react';
import { payslipService } from '../service/payslipService';
import type { Payslip, PayslipRequest, SalaryStructure, EmployeeSalaryRequest } from '../types';

export function usePayslip() {

  // ─── States ───────────────────────────────────────
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [history, setHistory] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Salary Structure fetch ────────────────────────
  const fetchSalaryStructure = useCallback(async () => {
    try {
      const data = await payslipService.getSalaryStructure();
      setSalaryStructure(data);
    } catch (err) {
      setError('Failed to fetch salary structure');
    }
  }, []);

  // ─── Set Employee Basic Salary ─────────────────────
  const setEmployeeSalary = useCallback(async (data: EmployeeSalaryRequest) => {
    try {
      setLoading(true);
      await payslipService.setEmployeeSalary(data);
    } catch (err) {
      setError('Failed to set salary');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Generate Payslip ──────────────────────────────
  const generatePayslip = useCallback(async (data: PayslipRequest) => {
    try {
      setLoading(true);
      const result = await payslipService.generatePayslip(data);
      setPayslip(result);
      return { success: true };
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setError('Failed to generate payslip');
      return { success: false };
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
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setPayslip(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch History ─────────────────────────────────
  const fetchHistory = useCallback(async (
    employeeId: number,
    startYear: number, startMonth: number,
    endYear: number, endMonth: number
  ) => {
    try {
      setLoading(true);
      const data = await payslipService.exportPayslipRange(
        employeeId, startYear, startMonth, endYear, endMonth
      );
      setHistory(data);
    } catch (err) {
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
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    salaryStructure,
    payslip,
    history,
    loading,
    error,
    fetchSalaryStructure,
    setEmployeeSalary,
    generatePayslip,
    fetchPayslip,
    fetchHistory,
    generatePayroll,
  };
}