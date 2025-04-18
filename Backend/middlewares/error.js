
//js has a error class it has everything except statuscode of error
class ErrorHandler extends Error{
  
  constructor(message,statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err,req,res,next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {//if apko username string mein chahiye but number diy etaw cast error or 8 se zyada char ka rakhe to error
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message,400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `JsonWebToken is Invalid!!!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `JsonWebToken is expired,Login Again`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    err:err
  })
}
 export {ErrorHandler}
/* 1. Custom Error Class: ErrorHandler
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
🔹 What it does:
Extends JavaScript's built-in Error class.

Adds a statusCode property, which JavaScript's Error doesn't have by default.

Now you can do:

throw new ErrorHandler("User not found", 404);
This becomes useful for API responses: you can throw errors with both message and HTTP status codes.

✅ 2. Express Error Middleware
export const errorMiddleware = (err, req, res, next) => {
This is a middleware in Express. Since it has 4 parameters (err, req, res, next), Express knows this is for error handling.

✅ 3. Default Fallbacks
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
If any error is missing a statusCode or message, you fall back to:

500 – Internal Server Error

A generic error message

This makes sure your API doesn’t crash if an unexpected error occurs.

✅ 4. Specific Error Types (Handled Manually)
🔸 a) CastError (usually from Mongoose)

  if (err.name === "castError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
🔍 When this happens:

Suppose MongoDB expects a string _id, but you pass a number or something invalid.

Example: GET /user/123 where 123 is not a valid ObjectId.

✅ Suggested Fix:

The error name should be "CastError" with a capital C:

js
Copy
Edit
if (err.name === "CastError") { ... }
🔸 b) Duplicate Key Error (code: 11000)
js
Copy
Edit
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
🔍 When this happens:

You tried to insert a document with a value that must be unique (like email) but it already exists.

Mongoose returns code: 11000 in such cases.

This gives a clean message like:

json
Copy
Edit
{
  "message": "Duplicate email Entered"
}
🔸 c) JWT Errors
js
Copy
Edit
  if (err.name === "JsonWebTokenError") {
    const message = `JsonWebToken is Invalid!!!`;
    err = new ErrorHandler(message, 400);
  }
🔍 Happens when:

A user provides an invalid or tampered JWT token.

🔸 d) Token Expired Error
js
Copy
Edit
  if (err.name === "TokenExpiredError") {
    const message = `JsonWebToken is expired, Login Again`;
    err = new ErrorHandler(message, 400);
  }
🔍 Happens when:

JWT has expired and the user tries to use it.

✅ 5. Sending the Final Response
js
Copy
Edit
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    err: err
  });
This sends a clean and structured error response to the client:

HTTP status code (like 400, 401, 500, etc.)

Message

The full error object (you might want to remove this in production for security)*/ 