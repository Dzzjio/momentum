"use client";

import { taskService } from "@/lib/api/tasks";
import { commentService } from "@/lib/api/comments";
import { Task } from "@/lib/types/tasks";
import { Comment } from "@/lib/types/comments";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddCommentForm from "../components/comment-form";
import { useEffect, useState } from "react";

interface TaskPageProps {
  params: { id: string };
}

export default function TaskPage({ params }: TaskPageProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse and validate taskId
  const taskIdParam = params.id;
  const taskId = parseInt(taskIdParam, 10);

  useEffect(() => {
    // Validate taskId
    if (isNaN(taskId)) {
      console.error("Invalid taskId:", taskIdParam);
      setError("Invalid task ID");
      notFound();
      return;
    }

    // Fetch task and comments
    async function fetchData() {
      try {
        const [taskData, commentsData] = await Promise.all([
          taskService.getTask(taskId),
          commentService.getTaskComments(taskId),
        ]);

        setTask(taskData);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch task or comments.");
        notFound();
      }
    }

    fetchData();
  }, [taskId, taskIdParam]);

  if (error) {
    return <div className="py-6 px-4 text-center text-red-500">{error}</div>;
  }

  if (!task) {
    return <div className="py-6 px-4 text-center">Loading...</div>;
  }

  // Validate due_date
  let dueDate = new Date(task.due_date);
  if (isNaN(dueDate.getTime())) {
    console.error("Invalid due_date value:", task.due_date);
    dueDate = new Date(); // Fallback to current date if invalid
  }

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      <Link href="/" className="mb-6 inline-block text-blue-500 hover:underline">
        ← დაბრუნება მთავარ გვერდზე
      </Link>

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
                src={task.employee?.avatar || "https://via.placeholder.com/40"}
                alt={`${task.employee?.name || "Unknown"} ${task.employee?.surname || "User"}`}
              />
              <span>{`${task.employee?.name || "Unknown"} ${task.employee?.surname || "User"}`}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-semibold">ვადა:</span>
              <span>
                {new Intl.DateTimeFormat("ka-GE", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }).format(dueDate)}
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

          <AddCommentForm taskId={taskId} initialComments={comments} />

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={comment.author?.avatar || "https://via.placeholder.com/40"}
                    alt={`${comment.author?.name || "Unknown"} ${comment.author?.surname || "User"}`}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {`${comment.author?.name || "Unknown"} ${comment.author?.surname || "User"}`}
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
              ))
            ) : (
              <p className="text-gray-500">ჯერ არ არის ჩანაწერები.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}