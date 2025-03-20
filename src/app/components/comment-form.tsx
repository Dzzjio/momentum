"use client";

import { commentService } from "@/lib/api/comments";
import { Comment, CommentCreateRequest } from "@/lib/types/comments";
import { useState, useEffect, useRef } from "react"; // Import useRef

// Utility function to safely parse dates
function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString || typeof dateString !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.error("Invalid date string (missing or not a string):", dateString);
    }
    return null;
  }
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    if (process.env.NODE_ENV === "development") {
      console.error("Invalid date string (cannot parse):", dateString);
    }
    return null;
  }
  return parsedDate;
}

interface AddCommentFormProps {
  taskId: number;
  initialComments: Comment[];
}

export default function AddCommentForm({ taskId, initialComments }: AddCommentFormProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const replyFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyingTo !== null && replyFormRef.current && !replyFormRef.current.contains(event.target as Node)) {
        setReplyingTo(null);
        setReplyText(""); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [replyingTo]);

  useEffect(() => {
    console.log("AddCommentForm: Initial comments from props:", JSON.stringify(initialComments, null, 2));
    console.log("AddCommentForm: Setting comments state:", JSON.stringify(comments, null, 2));
    setComments(initialComments);
    setIsMounted(true);
  }, [initialComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const payload: CommentCreateRequest = { text: newComment };
      const createdComment = await commentService.createTaskComment(taskId, payload);
      console.log("AddCommentForm: Created comment:", createdComment);
      setComments([createdComment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("ჩანაწერის დამატება ვერ მოხერხდა.");
    }
  };

  const handleAddReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const payload: CommentCreateRequest = { text: replyText, parent_id: parentId };
      const createdReply = await commentService.createTaskComment(taskId, payload);
      console.log("AddCommentForm: Created reply:", createdReply);
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), createdReply] }
            : comment
        )
      );
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("პასუხის დამატება ვერ მოხერხდა.");
    }
  };

  const getDisplayName = (comment: Comment) => {
    if (comment.author?.name && comment.author?.surname) {
      return `${comment.author.name} ${comment.author.surname}`;
    }
    return comment.author_nickname || "Unknown User";
  };

  const getAvatar = (comment: Comment) => {
    return comment.author_avatar || comment.author?.avatar || "https://via.placeholder.com/40";
  };

  // total comment count
  const getTotalCommentCount = () => {
    let total = comments.length; 
    comments.forEach((comment) => {
      if (comment.replies) {
        total += comment.replies.length;
      }
    });
    return total;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleAddComment} className="mb-6" suppressHydrationWarning>
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 pr-24 border bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
            placeholder="დაწერე ჩანაწერი..."
            rows={3}
          />
          <button
            type="submit"
            className="absolute bottom-4 right-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            დააკომენტარე
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-4 flex items-center">
        კომენტარები
        <span className="bg-purple-600 text-white w-6 h-6 flex items-center justify-center rounded-full ml-2 text-sm">
            {getTotalCommentCount()}
        </span>
        </h2>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
             
              <div className="flex space-x-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src={getAvatar(comment)}
                  alt={getDisplayName(comment)}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{getDisplayName(comment)}</p>
                  <p className="text-gray-600 text-sm mt-1">{comment.text}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-purple-600 hover:underline text-xs font-medium"
                    >
                      პასუხი
                    </button>
                  </div>

                  {replyingTo === comment.id && (
                    <form 
                      ref={replyFormRef}
                      onSubmit={(e) => handleAddReply(e, comment.id)} 
                      className="mt-4"
                    >
                        <div className="relative">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-4 pr-24 border bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                            placeholder="დაწერე პასუხი..."
                            rows={2}
                        />
                        <button
                            type="submit"
                            className="absolute bottom-4 right-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                            დააკომენტარე
                        </button>
                        </div>
                    </form>
                    )}
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 relative space-y-4">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex space-x-4 relative">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={getAvatar(reply)}
                        alt={getDisplayName(reply)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{getDisplayName(reply)}</p>
                        <p className="text-gray-600 text-sm mt-1">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">ჯერ არ არის კომენტარი.</p>
        )}
      </div>
    </div>
  );
}