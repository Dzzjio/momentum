<<<<<<< HEAD
import { Employee } from "./employees";

export interface Comment {
  id: number;
  task_id: number;
  author: Employee;
  text: string;
  created_at: string;
=======
export interface Comment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar?: string;
  author_nickname?: string;
  created_at?: string;
  replies?: Comment[];
  sub_comments?: Comment[];
  author?: { 
    name?: string;
    surname?: string;
    avatar?: string;
  };
>>>>>>> HEAD@{1}
}

export interface CommentCreateRequest {
  text: string;
<<<<<<< HEAD
=======
  parent_id?: number | null;
>>>>>>> HEAD@{1}
}