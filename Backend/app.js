import express from 'express'
import { config } from 'dotenv';
import cors from "cors"
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.js';
import fileUpload from 'express-fileupload';

const app = express();

config({
  path:"./config/.env"
})
//config() is a function provided by dotenv that loads these variables into process.env, making them accessible throughout the application.

app.use(
  cors({
    origin: [process.env.FRONTEND_URL], //to connect with frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

/* Summary of the Code
CORS Configuration in Express.js using the cors package.

Allows frontend requests from a specific origin (process.env.FRONTEND_URL).

Restricts HTTP methods to GET, POST, PUT, and DELETE.

Enables credentials (credentials: true) to allow cookies and authentication headers.

Prevents unauthorized access by limiting allowed origins.

Required for cross-origin communication (e.g., React frontend & Express backend on different domains).

Ensures proper authentication flow when using sessions, cookies, or JWTs.*/

app.use(cookieParser());//if we dont use after login also cant access the user
app.use(express.json());
app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir:"/tmp/"
}))
/* In Express.js, the middleware:

    app.use(express.urlencoded({ extended: true }));
    is used to parse incoming request bodies with URL-encoded data. Here’s a breakdown:

    What It Does
    Parses application/x-www-form-urlencoded data (which is the format used by HTML forms when submitted).

    Populates req.body with the parsed data.

    extended: true vs extended: false
    extended: false → Uses the querystring library (built-in, simpler, does not support nested objects).

    extended: true → Uses the qs library (allows nested objects, more powerful).

    Example Usage
    If a client sends this form data:

    name=Rohit&hobbies=reading&hobbies=traveling
    With extended: false → req.body will be:

    { "name": "Rohit", "hobbies": "traveling" }  // 'hobbies' is overwritten
    With extended: true → req.body will be:
    { "name": "Rohit", "hobbies": ["reading", "traveling"] }  // 'hobbies' is an array
    When to Use?
    Use extended: true when handling complex/nested form data.
    Use extended: false for simple form submissions.
*/
import userRouter from "./routers/user.routes.js";
import jobRouter from "./routers/job.routes.js"
import applicationRouter from "./routers/application.routes.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.use(errorMiddleware)




export default app