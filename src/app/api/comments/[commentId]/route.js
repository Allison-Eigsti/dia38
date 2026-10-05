import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { commentSchema, firstZodMessage } from "@/lib/validation";
import { getAuthenticatedUser } from "@/lib/auth";
import { Comment } from "@/models/Comment";

export async function PATCH(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in", 401);
  }

  const { commentId } = await params;
  if (!mongoose.isValidObjectId(commentId)) {
    return errorResponse("Comment not found", 404);
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
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    if (comment.author.toString() !== user._id.toString()) {
      return errorResponse("You can only edit your own comments", 403);
    }

    comment.content = parsed.data.content;
    await comment.save();
    return dataResponse({ comment });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return errorResponse("Failed to update comment", 500);
  }
}

export async function DELETE(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in", 401);
  }

  const { commentId } = await params;
  if (!mongoose.isValidObjectId(commentId)) {
    return errorResponse("Comment not found", 404);
  }

  try {
    await connectToDatabase();
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    if (comment.author.toString() !== user._id.toString()) {
      return errorResponse("You can only delete your own comments", 403);
    }

    await comment.deleteOne();
    return dataResponse({ message: "Comment deleted" });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return errorResponse("Failed to delete comment", 500);
  }
}
