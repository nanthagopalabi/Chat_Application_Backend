import express from "express";
import { Register } from "../Controller/userController.js";
import { Login } from "../Controller/userController.js";
import { Forget } from "../Controller/userController.js";
import { ResetToken } from "../Controller/userController.js";

const router = express.Router();

//User Registration
router.post ("/register",Register);

//User Login
router.post("/login",Login);

//Forget Password
router.post("/forget",Forget);

//Password Reset
router.post("/reset",ResetToken);

export const userRouter = router