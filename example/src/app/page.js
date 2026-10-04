import Link from "next/link";
import { getAllPosts } from "@/lib/data";

// This is a Server Component: it runs on the server, queries MongoDB
// directly, and sends plain HTML to the browser. No "use client" needed.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts = [];
  let error = null;
  try {
    posts = await getAllPosts();
  } catch (e) {
    console.error(e);
    error = "Could not load posts. Is the database configured?";
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Posts</h1>

      {error && <p className="rounded bg-red-100 p-3 text-red-700">{error}</p>}

      {!error && posts.length === 0 && (
        <p className="text-gray-600">No posts yet. Be the first to write one!</p>
      )}

      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post._id} className="rounded-lg bg-white p-4 shadow-sm">
            <Link href={`/posts/${post._id}`}>
              <h2 className="text-xl font-semibold text-blue-700 hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500">
              by {post.author?.name || "Unknown"} ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.imageData && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`data:${post.imageMimeType};base64,${post.imageData}`}
                alt={post.title}
                className="mt-3 max-h-64 rounded object-cover"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
