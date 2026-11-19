
const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema name is required"],
      unique: true,
      trim: true,
    },

    bundleSizes: {
      type: [
        {
          type: Number,
          min: [1, "Bundle size must be at least 1"],
          max: [500, "Bundle size cannot exceed 500"],
        },
      ],
      required: [true, "Bundle sizes are required"],
      validate: [
        {
          validator: function (sizes) {
            return sizes.length >= 1 && sizes.length <= 10;
          },
          message: "Cinema must have 1 to 10 bundle sizes",
        },
        {
          validator: function (sizes) {
            return new Set(sizes).size === sizes.length;
          },
          message: "Bundle sizes must be unique",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

module.exports = Cinema;
