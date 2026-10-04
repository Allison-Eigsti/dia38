import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// In development, model definitions can be re-evaluated on hot reload,
// which would throw "OverwriteModelError". Reusing the compiled model
// avoids that.
export const User = mongoose.models.User || mongoose.model("User", userSchema);
