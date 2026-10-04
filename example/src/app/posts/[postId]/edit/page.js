import { notFound, redirect } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { getAuthenticatedUser } from "@/lib/auth";
import { getPostWithComments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const { postId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const result = await getPostWithComments(postId).catch(() => null);
  if (!result) notFound();

  // Only the author may edit — enforced again by the API.
  if (result.post.author?._id !== user._id.toString()) {
    redirect(`/posts/${postId}`);
  }

  return <PostForm initialPost={result.post} />;
}
