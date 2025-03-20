import { Employee } from "./employees";

export interface Comment {
  id: number;
  task_id: number;
  author: Employee;
  text: string;
  created_at: string;
}

export interface CommentCreateRequest {
  text: string;
}