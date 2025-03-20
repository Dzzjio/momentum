"use client";

import { commentService } from "@/lib/api/comments";
import { Comment, CommentCreateRequest } from "@/lib/types/comments";
import { useState, useEffect } from "react";

interface AddCommentFormProps {
  taskId: number;
  initialComments: Comment[]; // Pass initial comments as a prop
}

export default function AddCommentForm({ taskId, initialComments }: AddCommentFormProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isMounted, setIsMounted] = useState(false); // Track client mount

  // Set initial comments after mount to avoid hydration mismatch
  useEffect(() => {
    setComments(initialComments);
    setIsMounted(true);
  }, [initialComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const payload: CommentCreateRequest = { text: newComment };
      const createdComment = await commentService.createTaskComment(taskId, payload);
      setComments([createdComment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("ჩანაწერის დამატება ვერ მოხერხდა.");
    }
  };

  // Render nothing on the server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleAddComment} className="mb-6" suppressHydrationWarning>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="დაწერე ჩანაწერი..."
        rows={3}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        გაგზავნა
      </button>
    </form>
  );
}