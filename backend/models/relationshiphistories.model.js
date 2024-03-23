const mongoose = require("mongoose");

const RelationshipHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "profile",
    },
    fromColumn: { type: String },
    toColumn: { type: String },
    fromRelationshipStage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "relationshipStage",
    },
    toRelationshipStage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "relationshipStage",
    },
    tag: { type: String },
  },
  {
    timestamps: true,
  }
);
RelationshipHistorySchema.index({ influencerId: 1, toColumn: 1 });
RelationshipHistorySchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model(
  "RelationshipHistory",
  RelationshipHistorySchema
);
