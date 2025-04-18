import app from "./app.js"
import connectDB from "./database/dbConnect.js"
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { newsLetterCron } from "./automation/newLetter.cron.js";

// import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
config({
  path:"./config/.env"
})
newsLetterCron()
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is running on http://localhost:${process.env.PORT}`);

    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed!!!!", err);
  });