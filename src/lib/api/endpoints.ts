const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://momentum.redberryinternship.ge/api";

export const API_ENDPOINTS = {
  PRIORITIES: {
    GET_ALL: `${BASE_URL}/priorities`,
  },
  DEPARTMENTS: {
    GET_ALL: `${BASE_URL}/departments` as const,
    GET_BY_ID: (id: number) => `${BASE_URL}/departments/${id}` as const,
    CREATE: `${BASE_URL}/departments` as const,
    UPDATE: (id: number) => `${BASE_URL}/departments/${id}` as const,
    DELETE: (id: number) => `${BASE_URL}/departments/${id}` as const,
  },
  STATUSES: {
    GET_ALL: `${BASE_URL}/statuses` as const,
  },
};