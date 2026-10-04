import { redirect } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function NewPostPage() {
  // Server-side guard: unauthenticated users get bounced to /login.
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return <PostForm />;
}
