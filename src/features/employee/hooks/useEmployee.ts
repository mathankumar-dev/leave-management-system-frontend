import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { employeeService } from "@/features/employee/services/employeeService";
import type { CreateUserRequest, Employee, EmployeeEntity, EmployeeFilters, PaginatedResponse, TeamMember } from "@/features/employee/types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useEmployee = () => {


    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async (employeeId: number): Promise<Employee[]> => {
        setLoading(true);
        try {
            return await dashboardService.getEmpDashboard(employeeId);

        } catch (err: any) {
            setError(err.message || "Failed to fetch employees");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchAllEmployees = useCallback(
        async (
            filters: EmployeeFilters
        ): Promise<PaginatedResponse<EmployeeEntity> | null> => {
            setLoading(true);
            setError(null);

            try {
                const response = await employeeService.getAllEmployees(filters);
                return response;
            } catch (err: unknown) {
                const msg =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch employee directory";

                setError(msg);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [employeeService]
    );
    const addUser = async (data: CreateUserRequest): Promise<void> => {
        try {
            const message = await employeeService.createUser(data);
            toast.success(message);
        } catch (err: any) {
            toast.error(err.toString());
            throw err;
        }
    };

    const deleteUser = async (employeeId: number): Promise<void> => {
        try {
            const message = await employeeService.deleteUser(employeeId);
            toast.success(message);
        } catch (err: any) {
            toast.error(err.toString());
            throw err;
        }
    };

    const getTeamMembers = useCallback(async (managerId: number): Promise<TeamMember[]> => {
        setLoading(true);
        try {
            const response = await employeeService.getTeamMembers(managerId);
            return response;
        } catch (err: any) {
            const message = err.message || "Failed to fetch team members";
            setError(message);
            console.error(message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);
    
      const fetchTeamMembers = useCallback(async (id: number): Promise<TeamMember[]> => {
        setLoading(true);
        setError(null);
        try {
          const result = await employeeService.getTeamMembers(id);
          return result;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || "Comp-Off banking failed";
          setError(errorMessage);
          return [];
        } finally {
          setLoading(false);
        }
      }, []);
    return {
        loading,
        error,
        setError,
        fetchEmployees,
        fetchAllEmployees,
        addUser,
        deleteUser,
        getTeamMembers,
        fetchTeamMembers,
        
    }
}