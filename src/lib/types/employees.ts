export interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  department_id: number;
}

export interface CreateEmployeePayload {
  name: string;
  surname: string;
  avatar: File | null;
  department_id: number;
}