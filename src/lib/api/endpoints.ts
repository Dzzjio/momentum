const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://momentum.redberryinternship.ge/api";

export const API_ENDPOINTS = {
  PRIORITIES: {
    GET_ALL: `${BASE_URL}/priorities` as const,
  },
  DEPARTMENTS: {
    GET_ALL: `${BASE_URL}/departments` as const
  },
  STATUSES: {
    GET_ALL: `${BASE_URL}/statuses` as const,
  },
  EMPLOYEES: {
    GET_ALL: `${BASE_URL}/employees`,
    CREATE: `${BASE_URL}/employees`,
  },
};