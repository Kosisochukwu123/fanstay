const mongoose = require("mongoose");

const giftCardSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    match: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    giftCardImage: {
      type: String,
      required: true,
    },

    giftCardAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    adminReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

giftCardSubmissionSchema.index({
  status: 1,
  createdAt: -1,
});

giftCardSubmissionSchema.index({
  user: 1,
});

module.exports = mongoose.model("GiftCardSubmission", giftCardSubmissionSchema);
