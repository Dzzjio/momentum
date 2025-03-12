// src/lib/api/priorities.ts
import { fetchApi } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface Priority {
  id: number;
  name: string;
}

export const priorityService = {
  getAllPriorities: () => fetchApi<Priority[]>(API_ENDPOINTS.PRIORITIES.GET_ALL),
};