import { CreateEmployeePayload, Employee } from "../types/employees";

// api/employees.ts
const API_BASE_URL = "https://momentum.redberryinternship.ge/api";
const BEARER_TOKEN = "9e6c150b-4326-4abc-beea-6d195138ee1f";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${BEARER_TOKEN}`,
  Accept: "application/json",
});

export const employeeService = {
  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("surname", payload.surname);
    formData.append("department_id", payload.department_id.toString());
    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }

    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const createdEmployee = await response.json();
    return createdEmployee;
  },

  async getEmployee(id: number): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  // New method to fetch all employees
  async getAllEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  },
};