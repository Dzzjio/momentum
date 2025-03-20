import { Comment, CommentCreateRequest } from "../types/comments";

const API_BASE_URL = "https://momentum.redberryinternship.ge/api";
const BEARER_TOKEN = "9e6c150b-4326-4abc-beea-6d195138ee1f";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${BEARER_TOKEN}`,
  Accept: "application/json",
});

export const commentService = {
  async getTaskComments(taskId: number): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const comments: Comment[] = await response.json();
    console.log("commentService: Raw API response for comments:", JSON.stringify(comments, null, 2));

    if (!Array.isArray(comments)) {
      console.error("commentService: API response is not an array:", comments);
      return [];
    }

    // Transform sub_comments to replies
    const nestedComments = comments.map((comment) => {
      const transformedComment = {
        ...comment,
        replies: comment.sub_comments || [], // Use sub_comments as replies
      };
      delete transformedComment.sub_comments;
      return transformedComment;
    });

    console.log("commentService: Transformed nested comments:", JSON.stringify(nestedComments, null, 2));
    return nestedComments;
  },

  async createTaskComment(taskId: number, payload: CommentCreateRequest): Promise<Comment> {
    console.log("commentService: Creating comment with payload:", JSON.stringify(payload, null, 2));
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const createdComment = await response.json();
    console.log("commentService: Created comment response:", JSON.stringify(createdComment, null, 2));
    return createdComment;
  },
};