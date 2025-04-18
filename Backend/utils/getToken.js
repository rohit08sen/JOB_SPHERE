const sendToken = (user, statuscode, res, message) => {
  const token = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure:true
  }
  return res.status(statuscode).cookie("AccessToken", token, options).json({
    success: true,
    user,
    message,
    token
  });
}
export {sendToken}