import { asyncHandler } from "../middlewares/asyncErrorHandler.js";
import { errorMiddleware, ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/user.models.js";
import { Job } from "../models/job.models.js";

const postJob = asyncHandler(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualification,
    offers,
    salary,
    hiringMultipleCandidate,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;
console.log("🚀 req.body:", req.body);
  if (!title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualification ||
    !salary ||
    !jobNiche
  ){
      return next(new ErrorHandler("Please provide full job details.",400))
  }


  if (!!personalWebsiteTitle !== !!personalWebsiteUrl) {
    return next(
      new ErrorHandler(
        "Provide both the website url and title, or leave both blank",
        400
      )
    );
  }


  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualification,
    offers,
    salary,
    hiringMultipleCandidate,
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,
    postedBy,
  });
  

  res.status(200)
    .json({
      success: true,
      message: "Job posted Successfully",
      job,
      postedBy
  })

})

const getAllJobs = asyncHandler(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query;
  // http://localhost:1234/blogs/jgh1f32jkj?keyword=IT here jgh1f32jkj-->param  keyword=IT--->query
  // In Express.js, req.query is an object that holds the query parameters sent in the URL after the ? symbol.

  const query = {};
  if (city) {
    query.location = city;
  }
  if (niche) {
    query.jobNiche = niche;
  }
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }

 
  //GET /jobs?city=Delhi&niche=IT&searchKeyword=developer
  /*
    This would return all IT jobs in Delhi that contain "developer" in their title, companyName, or introduction.

    $regex: searchKeyword, $options: "i"
    This is a MongoDB query syntax used to perform pattern matching (similar to LIKE in SQL) using regular expressions (regex).

🔍 What is $regex?
      $regex is a MongoDB operator used to match strings based on a pattern.

      It's useful for searching text within fields.

      🧠 What does $options: "i" do?
      The "i" option makes the search case-insensitive.

      So "Developer", "developer", and "DEVELOPER" would all match.
  */
   const jobs = await Job.find(query);
  res.status(200)
    .json({
      success: true,
      jobs,
      count: jobs.length,
    });
});

const getMyJobs=asyncHandler(async(req ,res, next)=>{
  const myJobs = await Job.find({ postedBy: req.user._id })
  res.status(200).json({
    success: true,
    myJobs,
  });
})

const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops Job not Found.", 404))
  }
  await job.deleteOne();
  res.status(200)
    .json({
      success: true,
      message: "Job deleted!!!!"
    })
});

const getASingleJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not Found.", 404));
  }
  res.status(200)
    .json({
      success: true,
      job
    })
});



export {postJob,getMyJobs,
  getAllJobs,
  deleteJob,
  getASingleJob,}
