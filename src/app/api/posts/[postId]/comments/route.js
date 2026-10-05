import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { commentSchema, firstZodMessage } from "@/lib/validation";
import { getAuthenticatedUser } from "@/lib/auth";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";

export async function POST(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in to comment", 401);
  }

  const { postId } = await params;
  if (!mongoose.isValidObjectId(postId)) {
    return errorResponse("Post not found", 404);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(firstZodMessage(parsed.error), 400);
  }

  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const comment = await Comment.create({
      content: parsed.data.content,
      author: user._id,
      post: postId,
    });
    return dataResponse({ comment }, 201);
  } catch (error) {
    console.error("Failed to create comment:", error);
    return errorResponse("Failed to create comment", 500);
  }
}
