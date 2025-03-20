import { taskService } from "@/lib/api/tasks";
<<<<<<< HEAD
import { commentService } from "@/lib/api/comments";
import { Task,  } from "@/lib/types/tasks";
import  { Comment } from "@/lib/types/comments";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddCommentForm from "../app/components/comment-form";
=======
import { Task } from "@/lib/types/tasks";
import { commentService } from "@/lib/api/comments"; // Import commentService
import { Comment } from "@/lib/types/comments"; // Import Comment type
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
>>>>>>> HEAD@{1}

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

<<<<<<< HEAD
export default async function TaskPage({ params }: TaskPageProps) {
  const unwrappedParams = await params;
  const taskId = Number(unwrappedParams.id);

  try {
    const [task, comments] = await Promise.all([
      taskService.getTask(taskId),
      commentService.getTaskComments(taskId),
    ]);
=======
  // Fetch comments for each task and calculate comment counts
  const commentCounts: { [taskId: number]: number } = {};
  for (const task of tasks) {
    try {
      const comments: Comment[] = await commentService.getTaskComments(task.id);
      let totalComments = comments.length; // Parent comments
      comments.forEach((comment) => {
        if (comment.replies) {
          totalComments += comment.replies.length; // Add replies
        }
      });
      commentCounts[task.id] = totalComments;
    } catch (error) {
      console.error(`Error fetching comments for task ${task.id}:`, error);
      commentCounts[task.id] = 0; // Default to 0 if fetching fails
    }
  }

  const colors = ["yellow-400", "red-500", "pink-500", "blue-500"];

  const colorMap: { [key: string]: string } = {
    "yellow-400": "#fbbf24", // Tailwind's yellow-400
    "red-500": "#ef4444",    // Tailwind's red-500
    "pink-500": "#ec4899",   // Tailwind's pink-500
    "blue-500": "#3b82f6",   // Tailwind's blue-500
  };
>>>>>>> HEAD@{1}

    return (
      <div className="py-6 px-4 max-w-6xl mx-auto">
        <Link href="/" className="mb-6 inline-block text-blue-500 hover:underline">
          ← დაბრუნება მთავარ გვერდზე
        </Link>

<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Task Details */}
          <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <img className="w-5 h-5" src={task.priority.icon} alt="priority" />
                <span className="bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {task.department.name}
                </span>
                <h2 className="text-2xl font-semibold text-gray-800">{task.name}</h2>
              </div>
            </div>

            <div className="p-4 bg-yellow-100 rounded-lg mb-4">
              <p className="text-gray-700">{task.description}</p>
            </div>

            <div className="space-y-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">სტატუსი:</span>
                <select value={task.status.name} className="p-1 border border-gray-300 rounded" disabled>
                  <option>{task.status.name}</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">პრიორიტეტი:</span>
                <img className="w-5 h-5" src={task.priority.icon} alt="priority" />
                <span>{task.priority.name}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">თანამშრომელი:</span>
                <img
                  className="w-10 h-10 rounded-full"
                  src={task.employee.avatar}
                  alt="avatar"
                />
                <span>{`${task.employee.name} ${task.employee.surname}`}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">ვადა:</span>
                <span>
                  {new Intl.DateTimeFormat("ka-GE", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  }).format(new Date(task.due_date))}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                დასრულებული
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                წაშლა
              </button>
            </div>
          </div>

          {/* Right Side: Comment Section */}
          <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">ჩანაწერები</h3>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                ჩანაწერები {comments.length}
              </span>
            </div>

            {/* Add Comment Form (Client Component) */}
            <AddCommentForm taskId={taskId} initialComments={comments} />

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={comment.author.avatar}
                      alt={`${comment.author.name} ${comment.author.surname}`}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {`${comment.author.name} ${comment.author.surname}`}
                      </p>
                      <p className="text-gray-600">{comment.text}</p>
                      <p className="text-xs text-gray-400">
                        {new Intl.DateTimeFormat("ka-GE", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }).format(new Date(comment.created_at))}
                      </p>
                    </div>
                  </div>
=======
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
            {/* Column Header */}
            <div
              style={{ backgroundColor: colorMap[colors[index % colors.length]] }}
              className="py-3 text-white rounded-xl font-bold flex items-center justify-center mb-4"
            >
              {column.status.name}
            </div>

            {/* Tasks in the Column */}
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
                          }).format(new Date(task.due_date ?? ''))}
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
                          <span className="text-sm text-gray-500">{commentCounts[task.id]}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
>>>>>>> HEAD@{1}
                ))
              ) : (
                <p className="text-gray-500">ჯერ არ არის ჩანაწერები.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }
}