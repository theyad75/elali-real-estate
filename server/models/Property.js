import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    price: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      required: true,
      enum: ["apartment", "villa", "land", "office", "shop", "penthouse", "studio", "chalet"],
    },
    status: {
      type: String,
      required: true,
      enum: ["sale", "rent"],
    },
    location: { type: localizedTextSchema, required: true },
    bedrooms: { type: Number, required: true, min: 0, default: 0 },
    bathrooms: { type: Number, required: true, min: 0, default: 0 },
    area: { type: Number, required: true, min: 0, default: 0 },
    images: {
      type: [String],
      default: ["/placeholder.svg"],
    },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Property = mongoose.model("Property", propertySchema);
