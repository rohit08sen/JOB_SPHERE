import express from 'express'
import { changePassword, getuser, login, logout, register, updateProfile } from '../controllers/user.controller.js'
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJwt, logout);
router.route("/me").get(verifyJwt, getuser);
router.route("/update/profile").put(verifyJwt, updateProfile);
router.route("/update/password").put(verifyJwt, changePassword);



export default router;