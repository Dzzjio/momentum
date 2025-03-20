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
}

export interface CommentCreateRequest {
  text: string;
  parent_id?: number | null;
}