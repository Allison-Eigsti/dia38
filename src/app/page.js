import Link from "next/link";
import { getAllPosts } from "@/lib/data";

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
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">
        Posts
      </h1>

      {error && (
        <p className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!error && posts.length === 0 && (
        <p className="rounded-lg border border-gray-100 bg-white px-5 py-6 text-gray-500 shadow-sm">
          No posts yet. Be the first to write one!
        </p>
      )}

      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li
            key={post._id}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="p-5">
              <Link href={`/posts/${post._id}`}>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 transition-colors hover:text-gray-600">
                  {post.title}
                </h2>
              </Link>

              <p className="mt-2 text-sm text-gray-500">
                by {post.author?.name || "Unknown"} ·{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {post.imageData && (
                <img
                  src={`data:${post.imageMimeType};base64,${post.imageData}`}
                  alt={post.title}
                  className="mt-5 max-h-72 w-full rounded-lg object-cover"
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

