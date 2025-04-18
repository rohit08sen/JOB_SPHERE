import express from "express"
import { isAuthorized, verifyJwt } from "../middlewares/auth.middleware.js"
import {
  postJob,
  getMyJobs,
  getAllJobs,
  deleteJob,
  getASingleJob,
} from "../controllers/job.controller.js";

const router = express.Router();
router.route("/postjob").post(verifyJwt, isAuthorized("Employer"), postJob);
router.route("/getall").get(getAllJobs);
router.route("/getmyjobs").get(verifyJwt, isAuthorized("Employer"), getMyJobs);
router.route("/delete/:id").delete(verifyJwt, isAuthorized("Employer"), deleteJob);
router.route("/get/:id").get(verifyJwt,getASingleJob);
export default router