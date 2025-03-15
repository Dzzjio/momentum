// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

// Define the shape of the selections object
interface Selections {
  priorities: string[];
  departments: string[];
}

// Type the global object to include our selections
interface GlobalStore {
  selections?: Selections;
}

// Access the global object and assert its type
const globalStore = global as GlobalStore;

// Initialize the store if it doesn’t exist
if (!globalStore.selections) {
  globalStore.selections = { priorities: [], departments: [] };
}
const selections = globalStore.selections;

export async function handlePrioritySelection(formData: FormData) {
  const selectedPriorities = formData.getAll("priorities_selected") as string[];
  console.log("Server: Received priorities:", selectedPriorities);
  selections.priorities = selectedPriorities;
  console.log("Server: Updated priorities store:", selections.priorities);
  revalidatePath("/");
}

export async function handleDepartmentSelection(formData: FormData) {
  const selectedDepartments = formData.getAll("departments_selected") as string[];
  console.log("Server: Received departments:", selectedDepartments);
  selections.departments = selectedDepartments;
  console.log("Server: Updated departments store:", selections.departments);
  revalidatePath("/");
}

export async function removeSelection(type: string, id: string) {
  if (type === "priorities") {
    selections.priorities = selections.priorities.filter((item: string) => item !== id);
    console.log("Server: Removed priority, updated store:", selections.priorities);
  } else if (type === "departments") {
    selections.departments = selections.departments.filter((item: string) => item !== id);
    console.log("Server: Removed department, updated store:", selections.departments);
  }
  revalidatePath("/");
}

export async function clearAllSelections() {
  selections.priorities = [];
  selections.departments = [];
  console.log("Server: Cleared all selections, updated store:", selections);
  revalidatePath("/");
}