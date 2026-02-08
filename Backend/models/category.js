import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      enum: {
        values: [
          "Technology",
          "Travel",
          "Food",
          "Lifestyle",
          "Health & Fitness",
          "Fashion",
          "Education",
          "Business",
          "Entertainment",
          "Sports",
          "Art & Design",
          "Science",
          "Personal Development",
          "News",
          "Opinion",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to generate slug from name
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-*|-*$/g, "");
  }
  next();
});

export default mongoose.model("Category", categorySchema);
