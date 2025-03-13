import { Priority } from "../types/priorities";
import { fetchApi } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export const priorityService = {
  getAllPriorities: () => fetchApi<Priority[]>(API_ENDPOINTS.PRIORITIES.GET_ALL),
};