import { fetchApi } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Department } from "../types/departments";

export const departmentService = {
  getAllDepartments: async () => {
    return fetchApi<Department[]>(API_ENDPOINTS.DEPARTMENTS.GET_ALL);
  },
};