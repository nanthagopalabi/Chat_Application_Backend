import express from "express";
import { Register, allUsers } from "../Controller/userController.js";
import { Login } from "../Controller/userController.js";
import { Forget } from "../Controller/userController.js";
import { ResetToken } from "../Controller/userController.js";
import { isAuthorized } from "../Middleware/authenticate.js";

const router = express.Router();

//User Registration
router.post ("/register",Register);

//User Login
router.post("/login",Login);

//get All User
router.get("/all_user", isAuthorized,allUsers);

//Forget Password
router.post("/forget",Forget);

//Password Reset
router.post("/reset",ResetToken);

export {router as userRouter}