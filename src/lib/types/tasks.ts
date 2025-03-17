export interface Task {
    status: any;
    priority: any;
    employee: any;
    department: any;
    id: number;
    name: string;
    description: string;
    due_date: string;
    status_id: number;
    employee_id: number;
    priority_id: number;
  }
  
  export interface TaskCreateRequest {
    name: string;
    description: string;
    due_date: string;
    status_id: number;
    employee_id: number;
    priority_id: number;
  }