import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { postSchema, firstZodMessage } from "@/lib/validation";
import { getAuthenticatedUser } from "@/lib/auth";
import { Post } from "@/models/Post";
import "@/models/Comment"; 

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .lean();
    return dataResponse({ posts });
  } catch (error) {
    console.error("Failed to list posts:", error);
    return errorResponse("Failed to load posts", 500);
  }
}

export async function POST(request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in to create a post", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(firstZodMessage(parsed.error), 400);
  }

  try {
    await connectToDatabase();
    const post = await Post.create({ ...parsed.data, author: user._id });
    return dataResponse({ post }, 201);
  } catch (error) {
    console.error("Failed to create post:", error);
    return errorResponse("Failed to create post", 500);
  }
}
