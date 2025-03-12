// src/lib/api/statuses.ts
import { fetchApi } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Status } from "../types/statuses";

export const statusService = {
  getAllStatuses: async () => {
    return fetchApi<Status[]>(API_ENDPOINTS.STATUSES.GET_ALL);
  },
};