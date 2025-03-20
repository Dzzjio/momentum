import { statusService } from "@/lib/api/statuses";
import { Status } from "@/lib/types/statuses";
import { priorityService } from "@/lib/api/priorities";
import { Priority } from "@/lib/types/priorities";
import { departmentService } from "@/lib/api/departments";
import { Department } from "@/lib/types/departments";
import { employeeService } from "@/lib/api/employees";
import { Employee } from "@/lib/types/employees";
import { taskService } from "@/lib/api/tasks";
import { Task } from "@/lib/types/tasks";
import FilterSection from "./components/filter-select";
import {
  handlePrioritySelection,
  handleDepartmentSelection,
  handleEmployeeSelection,
  removeSelection,
  clearAllSelections,
  getSelections,
} from "./actions";
import Link from "next/link";

export default async function HomePage() {
  const statuses: Status[] = await statusService.getAllStatuses();
  const priorities: Priority[] = await priorityService.getAllPriorities();
  const departments: Department[] = await departmentService.getAllDepartments();
  const employees: Employee[] = await employeeService.getAllEmployees();
  const tasks: Task[] = await taskService.getAllTasks();

  const colors = ["yellow-400", "red-500", "pink-500", "blue-500"];

  const colorMap: { [key: string]: string } = {
    "yellow-400": "#fbbf24", // Tailwind's yellow-400
    "red-500": "#ef4444",    // Tailwind's red-500
    "pink-500": "#ec4899",   // Tailwind's pink-500
    "blue-500": "#3b82f6",   // Tailwind's blue-500
  };

  const priorityOptions = priorities.map((p) => ({
    id: p.id.toString(),
    name: p.name,
  }));
  const departmentOptions = departments.map((d) => ({
    id: d.id.toString(),
    name: d.name,
  }));
  const employeeOptions = employees.map((e) => ({
    id: e.id.toString(),
    name: `${e.name} ${e.surname}`,
  }));

  const selections = await getSelections();

  console.log("Server: Priorities on render:", selections.priorities);
  console.log("Server: Departments on render:", selections.departments);
  console.log("Server: Employees on render:", selections.employees);

  const selectedItems = [
    ...priorities
      .filter((p) => selections.priorities.includes(p.id.toString()))
      .map((p) => ({ 
        type: "priorities", 
        id: p.id.toString(), 
        name: p.name 
      })),
    ...departments
      .filter((d) => selections.departments.includes(d.id.toString()))
      .map((d) => ({ 
        type: "departments", 
        id: d.id.toString(), 
        name: d.name 
      })),
    ...employees
      .filter((e) => selections.employees.includes(e.id.toString()))
      .map((e) => ({
        type: "employees",
        id: e.id.toString(),
        name: `${e.name} ${e.surname}`,
      })),
  ];

  // Filter tasks based on selections
  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = 
      selections.priorities.length === 0 || 
      selections.priorities.includes(task.priority.id.toString());
    
    const departmentMatch = 
      selections.departments.length === 0 || 
      selections.departments.includes(task.department.id.toString());
    
    const employeeMatch = 
      selections.employees.length === 0 || 
      selections.employees.includes(task.employee.id.toString());

    return priorityMatch && departmentMatch && employeeMatch;
  });

  // Group filtered tasks by status
  const tasksByStatus = statuses.map((status) => ({
    status,
    tasks: filteredTasks.filter((task) => task.status.id === status.id),
  }));

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">დავალებების გვერდი</h1>

      <FilterSection
        priorityOptions={priorityOptions}
        departmentOptions={departmentOptions}
        employeeOptions={employeeOptions} 
        selectedItems={selectedItems}
        initialPriorities={selections.priorities}
        initialDepartments={selections.departments}
        initialEmployees={selections.employees}
        handlePrioritySelection={handlePrioritySelection}
        handleDepartmentSelection={handleDepartmentSelection}
        handleEmployeeSelection={handleEmployeeSelection}
        removeSelection={removeSelection}
        clearAllSelections={clearAllSelections}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {tasksByStatus.map((column, index) => (
          <div key={column.status.id} className="flex flex-col">
            <div
              className={`py-3 text-white rounded-xl font-bold bg-${
                colors[index % colors.length]
              } flex items-center justify-center mb-4`}
            >
              {column.status.name}
            </div>
            <div className="space-y-4">
            {column.tasks.length > 0 ? (
              column.tasks.map((task) => (
                <Link href={`/tasks/${task.id}`} key={task.id}>
                  <div
                    className="p-4 bg-white my-6 rounded-lg shadow border hover:bg-gray-50 cursor-pointer"
                    style={{ borderColor: colorMap[colors[index % colors.length]] }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-2">
                        <p>{task.priority.name}</p>
                        <img
                          className="w-5 h-5"
                          src={task.priority.icon}
                          alt="priority"
                        />
                        <span className="bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {task.department.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat("ka-GE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(task.due_date))}
                      </p>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={task.employee.avatar}
                        alt="avatar"
                      />
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          ></path>
                        </svg>
                        <span className="text-sm text-gray-500">8</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center">დავალებები არ არის</p>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}