"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // keep the document small in MongoDB

// Used for both creating and editing a post.
export default function PostForm({ initialPost = null }) {
  const router = useRouter();
  const isEdit = !!initialPost;

  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [imageData, setImageData] = useState(initialPost?.imageData || "");
  const [imageMimeType, setImageMimeType] = useState(
    initialPost?.imageMimeType || ""
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reads the selected file and stores it as a Base64 string.
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      setError("Image must be a jpeg, png, gif, or webp");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be smaller than 2MB");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      // result looks like: data:image/png;base64,iVBOR...
      const result = reader.result;
      const base64 = result.split(",")[1];
      setImageData(base64);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    if (!imageData && imageMimeType) {
      setError("Please select an image file");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        isEdit ? `/api/posts/${initialPost._id}` : "/api/posts",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            imageData: imageData || undefined,
            imageMimeType: imageMimeType || undefined,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      router.push(`/posts/${json.data.post._id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h1>

      {error && <p className="rounded bg-red-100 p-2 text-red-700">{error}</p>}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Content</span>
        <textarea
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded border border-gray-300 p-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Image</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:${imageMimeType};base64,${imageData}`}
            alt="Preview"
            className="mt-2 max-h-48 rounded object-cover"
          />
        )}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
