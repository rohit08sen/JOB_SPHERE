import express from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import { deleteApplication, employerGetAllApplication, jobSeekerGetAllAplication, postApplication } from "../controllers/application.controller.js";
const router = express.Router();

router.route("/post/:id").post(verifyJwt, isAuthorized("Job Seeker"), postApplication)
router.route("/employer/getall").get(verifyJwt, isAuthorized("Employer"), employerGetAllApplication)
router.route("/jobseeker/getall").get(verifyJwt, isAuthorized("Job Seeker"), jobSeekerGetAllAplication);
router.route("/delete/:id").delete(verifyJwt, deleteApplication);

export default router