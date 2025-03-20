import { Task, TaskCreateRequest } from "../types/tasks"; // Import your types

const API_BASE_URL = "https://momentum.redberryinternship.ge/api"; // Replace with your actual API base URL
const BEARER_TOKEN = "9e6c150b-4326-4abc-beea-6d195138ee1f"; // Replace with your actual Bearer Token

// Helper function to get authentication headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${BEARER_TOKEN}`,
  Accept: "application/json",
});

export const taskService = {
  async createTask(payload: TaskCreateRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json", // Ensure JSON content type
      },
      body: JSON.stringify(payload), // Send payload as JSON
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const createdTask = await response.json();
    return createdTask;
  },

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
},

  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  },
};