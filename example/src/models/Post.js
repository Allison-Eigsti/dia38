import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // The assignment requires images to be stored in MongoDB as Base64.
    // We store the raw Base64 payload and the MIME type so the frontend
    // can render it as: data:<imageMimeType>;base64,<imageData>
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
