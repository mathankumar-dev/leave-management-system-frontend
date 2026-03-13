import { useState, useCallback } from 'react';
import { payslipService, type PayslipExportRow } from '../service/payslipService';
import type { Payslip, PayslipRequest, SalaryStructure, EmployeeSalaryRequest } from '../types';

export function usePayslip() {

  // ─── States ───────────────────────────────────────
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [history, setHistory] = useState<Payslip[]>([]);
  const [payrollData, setPayrollData] = useState<PayslipExportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Salary Structure fetch ────────────────────────
  const fetchSalaryStructure = useCallback(async () : Promise<SalaryStructure[]> => {
    try {
      const [employee , manager , admin ] = await Promise.all([
        payslipService.getSalaryStructure('EMPLOYEE'),
        payslipService.getSalaryStructure('MANAGER'),
        payslipService.getSalaryStructure('ADMIN')
      ]);
      return [employee , manager , admin];
    } catch {
      setError('Failed to fetch salary structure');
      return [];
    }
  }, []);

  // ─── Get Employee Saved Salary ─────────────────────
  // Employee click panna → previous saved basicSalary fetch
  const fetchEmployeeSalary = useCallback(async (employeeId: number): Promise<number | null> => {
    try {
      const data = await payslipService.getEmployeeSalary(employeeId);
      return data.basicSalary;
    } catch {
      return null; // First time — salary illaye, null return
    }
  }, []);

  // ─── Set Employee Basic Salary ─────────────────────
  const setEmployeeSalary = useCallback(async (data: EmployeeSalaryRequest) => {
    try {
      setLoading(true);
      await payslipService.setEmployeeSalary(data);
    } catch {
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
    } catch {
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
    } catch {
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
      // Payroll generate success → export data fetch
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
    salaryStructure,
    payslip,
    history,
    payrollData, 
    loading,
    error,
    fetchSalaryStructure,
    fetchEmployeeSalary, 
    setEmployeeSalary,
    generatePayslip,
    fetchPayslip,
    fetchHistory,
    generatePayroll,
  };
}