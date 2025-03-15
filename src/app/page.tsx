import { statusService } from "@/lib/api/statuses";
import { Status } from "@/lib/types/statuses";
import { priorityService } from "@/lib/api/priorities";
import { Priority } from "@/lib/types/priorities";
import { departmentService } from "@/lib/api/departments";
import { Department } from "@/lib/types/departments";
import FilterSection from "./components/filter-select";
import { revalidatePath } from "next/cache";

// Global in-memory store (for demo; replace with database in production)
const globalStore = global as any;
if (!globalStore.selections) {
  globalStore.selections = { priorities: [], departments: [] };
}
const selections = globalStore.selections;

export async function handlePrioritySelection(formData: FormData) {
  "use server";
  const selectedPriorities = formData.getAll("priorities_selected") as string[];
  console.log("Server: Received priorities:", selectedPriorities);
  selections.priorities = selectedPriorities;
  console.log("Server: Updated priorities store:", selections.priorities);
  revalidatePath("/");
}

export async function handleDepartmentSelection(formData: FormData) {
  "use server";
  const selectedDepartments = formData.getAll("departments_selected") as string[];
  console.log("Server: Received departments:", selectedDepartments);
  selections.departments = selectedDepartments;
  console.log("Server: Updated departments store:", selections.departments);
  revalidatePath("/");
}

export async function removeSelection(type: string, id: string) {
  "use server";
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
  "use server";
  selections.priorities = [];
  selections.departments = [];
  console.log("Server: Cleared all selections, updated store:", selections);
  revalidatePath("/");
}

// Fetch employees from the API
async function fetchEmployees() {
  const API_BASE_URL = 'https://momentum.redberryinternship.ge/api';
  const BEARER_TOKEN = '9e6c150b-4326-4abc-beea-6d195138ee1f';

  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  return response.json();
}

export default async function HomePage() {
  const statuses: Status[] = await statusService.getAllStatuses();
  const priorities: Priority[] = await priorityService.getAllPriorities();
  const departments: Department[] = await departmentService.getAllDepartments();
  // const employees = await fetchEmployees();

  const colors = ["bg-yellow-400", "bg-red-500", "bg-pink-500", "bg-blue-500"];

  const priorityOptions = priorities.map((p) => ({
    id: p.id.toString(),
    name: p.name,
  }));
  const departmentOptions = departments.map((d) => ({
    id: d.id.toString(),
    name: d.name,
  }));

  // Log stored selections on render
  console.log("Server: Priorities on render:", selections.priorities);
  console.log("Server: Departments on render:", selections.departments);

  // Combine selected priorities and departments for display
  const selectedItems = [
    ...priorities
      .filter((p) => selections.priorities.includes(p.id.toString()))
      .map((p) => ({ type: "priorities", id: p.id.toString(), name: p.name })),
    ...departments
      .filter((d) => selections.departments.includes(d.id.toString()))
      .map((d) => ({ type: "departments", id: d.id.toString(), name: d.name })),
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">დავალებების გვერდი</h1>

      <FilterSection
        priorityOptions={priorityOptions}
        departmentOptions={departmentOptions}
        selectedItems={selectedItems}
        initialPriorities={selections.priorities}
        initialDepartments={selections.departments}
        handlePrioritySelection={handlePrioritySelection}
        handleDepartmentSelection={handleDepartmentSelection}
        removeSelection={removeSelection}
        clearAllSelections={clearAllSelections}
      />

      <ul className="flex gap-4 w-full mb-8">
        {statuses.map((stat, index) => (
          <li
            key={stat.id}
            className={`flex-1 py-3 text-white rounded-xl ${
              colors[index % colors.length]
            } flex items-center justify-center`}
          >
            {stat.name}
          </li>
        ))}
      </ul>


         {/* Employees Section */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">თანამშრომლები</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map((employee: any) => (
            <div key={employee.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src={employee.avatar || '/img/default-avatar.png'}
                  alt={`${employee.name} ${employee.surname}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{employee.name} {employee.surname}</p>
                  <p className="text-sm text-gray-500">
                    {departments.find((d) => d.id === employee.department)?.name || employee.department.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
     
    </div>
  );
}