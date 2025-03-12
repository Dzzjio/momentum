// src/lib/api/departments.ts
import { fetchApi } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Department, DepartmentPayload } from "../types/departments";

export const departmentService = {
  getAllDepartments: async () => {
    return fetchApi<Department[]>(API_ENDPOINTS.DEPARTMENTS.GET_ALL);
  },
  getDepartmentById: async (id: number) => {
    return fetchApi<Department>(API_ENDPOINTS.DEPARTMENTS.GET_BY_ID(id));
  },
  createDepartment: async (data: DepartmentPayload) => {
    return fetchApi<Department>(API_ENDPOINTS.DEPARTMENTS.CREATE, {
      method: "POST",
      data,
    });
  },
  updateDepartment: async (id: number, data: DepartmentPayload) => {
    return fetchApi<Department>(API_ENDPOINTS.DEPARTMENTS.UPDATE(id), {
      method: "PUT",
      data,
    });
  },
  deleteDepartment: async (id: number) => {
    return fetchApi<void>(API_ENDPOINTS.DEPARTMENTS.DELETE(id), {
      method: "DELETE",
    });
  },
};