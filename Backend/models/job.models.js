import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time"],
    },
    location: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    introduction: {
      type: String,
    },
    responsibilities: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    offers: {
      type: String,
    },
    salary: {
      type: String,
      required: true,
    },
    hiringMultipleCandidate: {
      type: String,
      default: "No",
      enum: ["No", "Yes"],
    },
    personalWebsite: {
      title: String,
      url: String,
    },
    jobNiche: {
      type: String,
      required: true,
    },
    newsLettersSent: {
      //part of automation when the notification will be sent
      type: Boolean,
      default: false,
    },
    jobPostedOn: {
      type: Date,
      default: Date.now,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Job=mongoose.model("Job",jobSchema)