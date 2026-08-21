import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic display name for the user account.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email is stored in a normalized format and must be unique.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password is hidden from query results unless explicitly selected.
    password: {
      type: String,
      required: true,
      select: false,
    },

    // A single User model supports normal users and admins.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Can be used later for email or account verification workflows.
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
