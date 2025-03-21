import { taskService } from "@/lib/api/tasks";
import { commentService } from "@/lib/api/comments";
import { Task } from "@/lib/types/tasks";
import { Comment } from "@/lib/types/comments";
import { notFound } from "next/navigation";
import AddCommentForm from "../../components/comment-form";

function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString || typeof dateString !== "string") {
    console.error("Invalid date string (missing or not a string):", dateString);
    return null; 
  }

  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date string (cannot parse):", dateString);
    return null;
  }
  return parsedDate;
}

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  console.log("TaskPage: Starting execution");

  const unwrappedParams = await params;
  console.log("TaskPage: Full params object (unwrapped):", unwrappedParams);

  const taskIdParam = unwrappedParams?.id;
  console.log("TaskPage: Raw taskId from params:", taskIdParam, typeof taskIdParam);

  if (!taskIdParam || typeof taskIdParam !== "string" || !/^\d+$/.test(taskIdParam)) {
    console.error("TaskPage: Invalid or missing taskId param:", taskIdParam);
    notFound();
    return null;
  }

  const taskId = parseInt(taskIdParam, 10);
  if (isNaN(taskId) || taskId <= 0) {
    console.error("TaskPage: Failed to parse taskId to a valid number:", taskIdParam);
    notFound();
    return null;
  }

  let task: Task;
  let comments: Comment[] = [];
  try {
    console.log("TaskPage: Fetching task for taskId:", taskId);
    task = await taskService.getTask(taskId);

    console.log("TaskPage: Fetching comments for taskId:", taskId);
    comments = await commentService.getTaskComments(taskId); // Fetch comments server-side
  } catch (error) {
    console.error("TaskPage: Error fetching data:", error);
    notFound();
    return null;
  }

  console.log("TaskPage: Task data:", task);
  console.log("TaskPage: Due date value:", task.due_date);
  console.log("TaskPage: Comments data:", comments);

  // Parse due_date safely
  const dueDate = parseDate(task.due_date);

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
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
                src={task.employee?.avatar || "https://via.placeholder.com/40"}
                alt={`${task.employee?.name || "Unknown"} ${task.employee?.surname || "User"}`}
              />
              <span>{`${task.employee?.name || "Unknown"} ${task.employee?.surname || "User"}`}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-semibold">ვადა:</span>
              <span>
                {dueDate ? (
                  new Intl.DateTimeFormat("ka-GE", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  }).format(dueDate)
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#F8F3FEA6] rounded-lg border border-[#DDD2FF]">
          <AddCommentForm taskId={taskId} initialComments={comments} />
        </div>
      </div>
    </div>
  );
}