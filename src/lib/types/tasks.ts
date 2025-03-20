export interface Task {
  id: number;
  name: string;
  description?: string;
  due_date: string;
  priority: {
    id: number;
    name: string;
    icon: string;
  };
  department: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
  };
  status: {
    id: number;
    name: string;
  };
}

export interface TaskCreateRequest {
  name: string;
  description?: string;
  due_date: string;
  priority_id: number;
  department_id: number;
  employee_id: number;
  status_id: number;
}