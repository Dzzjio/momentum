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

    return response.json();
  },
};