const mongoose = require("mongoose");

// Define Survey Schema
const surveySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    website: { type: String, required: true },
    channelDetails: { type: String },
    channelType: { type: String },
    feedback: { type: String, required: true },
    objective: { type: String },
    personalisedOnboarding: { type: Boolean },
    rating: { type: Number },
    revenue: { type: Number },
    role: { type: String, required: true },
    whySaral: { type: String, required: true },
    created_at: {
      type: Date,
    },
  },
  { timestamps: true }
); // To exclude "__v" field from the document

// Create Survey model
const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
