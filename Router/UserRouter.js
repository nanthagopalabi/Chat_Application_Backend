import express from "express";
import { Register } from "../Controller/userControllers.js";
import { Login } from "../Controller/userControllers.js";
import { Forget } from "../Controller/userControllers.js";
import { ResetToken } from "../Controller/userControllers.js";

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