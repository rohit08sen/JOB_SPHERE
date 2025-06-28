import { asyncHandler } from "../middlewares/asyncErrorHandler.js";
import { errorMiddleware, ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary"
import { sendToken } from "../utils/getToken.js";

const register = asyncHandler(async (req, res, next) => {
  
  const {
    name,
    email,
    phone,
    address,
    password,
    role,
    firstNiche,
    secondNiche,
    thirdNiche,
    coverLetter
  } = req.body;
  console.log("email:", email);
  console.log("req files", req.files);
  console.log("Recieved req body:", req.body);
//check for required fields
  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required",400))
  }

  //if user role is job seeker then he has to provide atleat one niche
  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(new ErrorHandler("Please provide your desired niche", 400));
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(new ErrorHandler("User Already existed ", 400));
  }

  const userData = {
    name,
    email,
    phone,
    address,
    password,
    role,
    niches: {
      firstNiche,
      secondNiche,
      thirdNiche,
    },
    coverLetter,
  }

  if (req.files && req.files.resume) {
    const { resume } = req.files;
    if (resume) {
      try {
        const response = await cloudinary.uploader.upload(resume.tempFilePath, {
          folder: "Job_Seeker_Resume",
          resource_type: "raw",
        });

        if (!response || response.error) {
          return next(
            new ErrorHandler("Failed to upload resume to cloud", 500)
          );
        }

        userData.resume = {
          public_id: response.public_id,
          url: response.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Fail to upload Resume", 500));
      }
    }
  }
  
  const user = await User.create(userData);
  console.log(user);
  sendToken(user,201,res,"User Registerd")
  // console.log(userData);
  // return res.json(201, " created  : ", user);
  
})

const login = asyncHandler(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(new ErrorHandler("All fields Required", 400));
  }

  const user = await User.findOne({ email }).select("+password")
  
  if (!user) {
    return next(new ErrorHandler("User doesn't Exist",404))
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    return next(new ErrorHandler("Wrong Password!!",401))
  }
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid Role!!!", 401));
  }
  sendToken(user, 200, res, "Logged in Successfully");
})

//logout means remove cookie
const logout = asyncHandler(async (req, res, next) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

 return res
    .status(200)
    .clearCookie("AccessToken", options)
    .json({
      success: true,
      message:"Logged Out Successfully"
   })
})

//get User
const getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
})

//updateProfile
const updateProfile = asyncHandler(async (req, res, next) => {
  //1st we need new data 
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };

  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

  if (req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(new ErrorHandler("Please Provide Preferred job niches.",400))
  }

  //resume update
  if (req.files) {
    const resume = req.files.resume;
    if (resume) {
      const currResumeId = req.user.resume.public_id;//curr resume id which we have to destroy before updating prev one
      if (currResumeId) {
        await cloudinary.uploader.destroy(currResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seeker_Resume",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url
      }
    }
  }


  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile Updated"
  });

})


const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword);//check for old password
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  //new and confirm password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("New And Confrim password are not same",400))
  }

  user.password = req.body.newPassword;
  await user.save();//save the password;
  //login again;
  sendToken(user,200,res,"Password Updated SuccessFully")
})
export { register,login ,logout,getuser,updateProfile,changePassword}
