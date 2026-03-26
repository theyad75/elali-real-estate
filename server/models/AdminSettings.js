import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);
