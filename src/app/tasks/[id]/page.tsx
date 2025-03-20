import { taskService } from "@/lib/api/tasks";
import { Task } from "@/lib/types/tasks";
import { notFound } from "next/navigation";

interface TaskPageProps {
  params: { id: string };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const taskId = parseInt(params.id, 10);

  if (isNaN(taskId)) {
    notFound(); // Redirect to 404 if the ID is invalid
  }

  let task: Task;
  try {
    task = await taskService.getTask(taskId);
  } catch (error) {
    console.error("Error fetching task:", error);
    notFound(); // Redirect to 404 if task fetch fails
  }

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{task.name}</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 font-semibold">Description:</p>
            <p className="text-gray-800">{task.description || "No description provided"}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Due Date:</p>
            <p className="text-gray-800">
              {new Intl.DateTimeFormat("ka-GE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(task.due_date))}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Priority:</p>
            <div className="flex items-center space-x-2">
              <img className="w-5 h-5" src={task.priority.icon} alt="priority" />
              <p className="text-gray-800">{task.priority.name}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Department:</p>
            <p className="text-gray-800">{task.department.name}</p>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Assigned Employee:</p>
            <div className="flex items-center space-x-2">
              <img
                className="w-10 h-10 rounded-full"
                src={task.employee.avatar}
                alt="avatar"
              />
              <p className="text-gray-800">{`${task.employee.name} ${task.employee.surname}`}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-semibold">Status:</p>
            <p className="text-gray-800">{task.status.name}</p>
          </div>
        </div>
      </div>

    </div>
  );
}