import { ErrorHandler } from "../middlewares/error.js";
import { asyncHandler } from "../middlewares/asyncErrorHandler.js";
import { Application } from "../models/application.models.js";
import { Job } from "../models/job.models.js";
import { v2 as cloudinary } from "cloudinary";
const postApplication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields Required.", 400));
  }

  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
  };
  const jobDetails = await Job.findById(id);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found", 404));
  }
  //pehle apply kiya hai ki nahi
  const isAlreadyApplied = await Application.findOne({
    "jobInfo.id": id,
    "jobSeekerInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return next(new ErrorHandler("You have aleardy Applied.", 400));
  }
  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
          folder: "Job_Seeker_Resume",
          resource_type: "raw",
        }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to Upload on cloudinary", 500));
      }
      jobSeekerInfo.resume = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else {
    if (req.user && !req.user.resume.url) {
      return next(new ErrorHandler("please upload resume", 400));
    }
    //apne save resume ko dediya
    jobSeekerInfo.resume = {
      public_id: req.user && req.user.resume.public_id,
      url: req.user && req.user.resume.url,
    };
  }

  //finding employee info
  const employerInfo = {
    id: jobDetails.postedBy,
    role: "Employer",
  };
  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
  };

  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted.",
    application,
  });
})
const employerGetAllApplication = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const applications = await Application.find({
    "employerInfo.id": _id,
    "deletedBy.employer": false,
  });
  res.status(200).json({
    success: true,
    applications
  })
 });
const jobSeekerGetAllAplication = asyncHandler(async (req, res, next) => { 
  const { _id } = req.user;
  const applications = await Application.find({
    "jobSeekerInfo.id": _id,
    "deletedBy.jobSeeker": false,
  });
  res.status(200).json({
    success: true,
    applications
  })
 });
const deleteApplication = asyncHandler(async (req, res, next) => { 
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found",404))
  }
  const { role } = req.user;
  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;
    case "Employer":
      application.deletedBy.employer = true;
      await application.save();
      break;
    default:
      console.log("Default function for application delete");
      break;
  }

  if (application.deletedBy.employer === true && application.deletedBy.jobSeeker === true) {
    await application.deleteOne();
  }
  res.status(200).json({
    success: true,
    message:"Application Deleted"
  })
});

export { postApplication,employerGetAllApplication, jobSeekerGetAllAplication, deleteApplication };