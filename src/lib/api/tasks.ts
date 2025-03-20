import { Task, TaskCreateRequest } from "../types/tasks"; 

const API_BASE_URL = "https://momentum.redberryinternship.ge/api"; 
const BEARER_TOKEN = "9e6c150b-4326-4abc-beea-6d195138ee1f";

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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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