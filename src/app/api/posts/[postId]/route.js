import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { postSchema, firstZodMessage } from "@/lib/validation";
import { getAuthenticatedUser } from "@/lib/auth";
import { Post } from "@/models/Post";
import { Comment } from "@/models/Comment";

export async function GET(request, { params }) {
  const { postId } = await params;
  if (!mongoose.isValidObjectId(postId)) {
    return errorResponse("Post not found", 404);
  }

  try {
    await connectToDatabase();
    const post = await Post.findById(postId)
      .populate("author", "name email")
      .lean();
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate("author", "name email")
      .lean();

    return dataResponse({ post, comments });
  } catch (error) {
    console.error("Failed to get post:", error);
    return errorResponse("Failed to load post", 500);
  }
}

export async function PATCH(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in", 401);
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

  // Allow partial updates — any subset of the post fields.
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) {
    return errorResponse(firstZodMessage(parsed.error), 400);
  }

  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    // Authorization: only the author may edit this post.
    if (post.author.toString() !== user._id.toString()) {
      return errorResponse("You can only edit your own posts", 403);
    }

    post.set(parsed.data);
    await post.save();
    return dataResponse({ post });
  } catch (error) {
    console.error("Failed to update post:", error);
    return errorResponse("Failed to update post", 500);
  }
}

export async function DELETE(request, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("You must be logged in", 401);
  }

  const { postId } = await params;
  if (!mongoose.isValidObjectId(postId)) {
    return errorResponse("Post not found", 404);
  }

  try {
    await connectToDatabase();
    const post = await Post.findById(postId);
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    if (post.author.toString() !== user._id.toString()) {
      return errorResponse("You can only delete your own posts", 403);
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: postId }); // clean up its comments
    return dataResponse({ message: "Post deleted" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return errorResponse("Failed to delete post", 500);
  }
}
