import { User } from "../models/user.models.js";
import { asyncHandler } from "./asyncErrorHandler.js";
import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyJwt = asyncHandler(async (req, res, next) => {
  

  const token =
    req.cookies?.AccessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  

  if (!token) {
    
    return next(new ErrorHandler("Unauthorized Request!!", 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    

    const user = await User.findById(decodedToken?._id).select("-password ");
    if (!user) {
      
      return next(new ErrorHandler("Invalid AccessToken", 401));
    }

    req.user = user;
    
    next();
  } catch (error) {
   
    return next(
      new ErrorHandler(error?.message || "Invalid Message Token", 401)
    );
  }
});



//this to check the role as job only post by employeer not by job seeker
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    console.log("🔐 [isAuthorized] Checking role:", req.user?.role);

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`,
          400
        )
      );
    }

   
    next();
  };
};
