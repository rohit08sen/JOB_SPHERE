export const sendToken = (user, statuscode, res, message) => {
  const token = user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // secure true in production
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  };

  return res.status(statuscode).cookie("AccessToken", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
