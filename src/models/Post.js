import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageData: { type: String },
    imageMimeType: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
