<<<<<<< HEAD
// lib/api/comments.ts
import { Comment, CommentCreateRequest } from "../types/comments";

// Define the API base URL and Bearer token as constants
const API_BASE_URL = "https://momentum.redberryinternship.ge/api";
const BEARER_TOKEN = "9e6c150b-4326-4abc-beea-6d195138ee1f";

// Helper function to generate authentication headers with the Bearer token
const getAuthHeaders = () => ({
  Authorization: `Bearer ${BEARER_TOKEN}`, // Add Bearer token for authentication
  Accept: "application/json", // Specify that we expect JSON responses
});

// Export the commentService object with methods for comment-related API calls
export const commentService = {
  // Fetch all comments for a specific task
  async getTaskComments(taskId: number): Promise<Comment[]> {
    // Send a GET request to retrieve comments for the given task ID
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: "GET", // HTTP method for retrieving resources
      headers: getAuthHeaders(), // Include authentication headers
    });

    // Check if the response is not OK (status outside 200-299 range)
    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response
      throw new Error(`API Error: ${response.status} - ${errorText}`); // Throw error with status and message
    }

    // Parse and return the array of comments from the response
    return response.json();
  },

  // Create a new comment for a specific task
  async createTaskComment(taskId: number, payload: CommentCreateRequest): Promise<Comment> {
    // Send a POST request to create a new comment for the given task ID
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: "POST", 
=======
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
>>>>>>> HEAD@{1}
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
<<<<<<< HEAD
      const errorText = await response.text(); 
      throw new Error(`API Error: ${response.status} - ${errorText}`); 
    }

    return response.json();
=======
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const createdComment = await response.json();
    console.log("commentService: Created comment response:", JSON.stringify(createdComment, null, 2));
    return createdComment;
>>>>>>> HEAD@{1}
  },
};