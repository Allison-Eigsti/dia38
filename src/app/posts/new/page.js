import { redirect } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function NewPostPage() {

  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return <PostForm />;
}
