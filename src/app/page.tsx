// src/app/page.tsx
import { statusService } from "@/lib/api/statuses";
import { Status } from "@/lib/types/statuses";
import { priorityService } from "@/lib/api/priorities";
import { Priority } from "@/lib/types/priorities";
import { departmentService } from "@/lib/api/departments";
import { Department } from "@/lib/types/departments";
import FilterSection from "./components/filter-select";
import {
  handlePrioritySelection,
  handleDepartmentSelection,
  removeSelection,
  clearAllSelections,
} from "./actions"; // Import from the new file


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

  // Access selections from the imported actions' scope (or refactor to fetch from a database)
  const selections: { priorities: string[], departments: string[] } = { priorities: [], departments: [] }; // Temporary; ideally managed elsewhere

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
    </div>
  );
}