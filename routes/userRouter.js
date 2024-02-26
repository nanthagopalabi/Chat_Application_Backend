import express from "express";
import { Register, allUsers } from "../controllers/userController.js";
import { Login } from "../controllers/userController.js";
import { Forget } from "../controllers/userController.js";
import { ResetToken } from "../controllers/userController.js";
import { isAuthorized } from "../middleware/authenticate.js";

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