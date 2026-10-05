import { notFound } from "next/navigation";
import { getPostWithComments } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/auth";
import PostActions from "@/components/posts/PostActions";
import CommentsSection from "@/components/comments/CommentsSection";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }) {
  const { postId } = await params;

  let result = null;
  try {
    result = await getPostWithComments(postId);
  } catch {
    result = null;
  }
  if (!result) notFound();

  const { post, comments } = result;
  const user = await getAuthenticatedUser();
  const isOwner = user && post.author?._id === user._id.toString();

  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        by {post.author?.name || "Unknown"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.imageData && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:${post.imageMimeType};base64,${post.imageData}`}
          alt={post.title}
          className="mt-4 max-h-96 w-full rounded object-cover"
        />
      )}

      <p className="mt-4 whitespace-pre-wrap">{post.content}</p>

      {isOwner && <PostActions postId={post._id} />}

      <hr className="my-8" />
      <CommentsSection
        postId={post._id}
        comments={comments}
        currentUserId={user ? user._id.toString() : null}
      />
    </article>
  );
}
