"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostActions({ postId }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Delete failed");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <Link
        href={`/posts/${postId}/edit`}
        className="rounded bg-gray-200 px-3 py-1 text-sm"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
