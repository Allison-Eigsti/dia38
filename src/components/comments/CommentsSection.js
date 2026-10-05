"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentsSection({ postId, comments, currentUserId }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post comment");
      setContent("");
      router.refresh(); // re-fetch server data for the comment list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold">Comments ({comments.length})</h2>

      {comments.length === 0 && (
        <p className="mt-2 text-gray-600">No comments yet.</p>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            isOwner={currentUserId === comment.author?._id}
          />
        ))}
      </ul>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <textarea
            rows={3}
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-600">
          Log in to leave a comment.
        </p>
      )}
    </section>
  );
}

function CommentItem({ comment, isOwner }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveEdit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/comments/${comment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteComment() {
    if (!confirm("Delete this comment?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Delete failed");
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <li className="rounded bg-white p-3 shadow-sm">
      <p className="text-sm text-gray-500">
        {comment.author?.name || "Unknown"} ·{" "}
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>
      {editing ? (
        <div className="mt-1 flex flex-col gap-2">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded border border-gray-300 p-2"
          />
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              disabled={busy}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded bg-gray-200 px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1">{comment.content}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {isOwner && !editing && (
        <div className="mt-2 flex gap-2 text-sm">
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={deleteComment}
            disabled={busy}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
