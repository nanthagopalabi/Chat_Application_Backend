import express from "express";
import { User } from "../model/userModel.js";
// import {Email} from "../models/Email.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import {sendMail} from "../service/service.js";

//Register a User
export const Register = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        const user = await User.findOne({email: email});
        console.log(req.body);
        if(user){
           return res.status(404).json({
                message: "User Already Exist"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(req.body.password,salt);
        console.log("hassedPassword", hassedPassword);
        const newUser = await new User({...req.body, password: hassedPassword});
        newUser.save();
        res.status(201).json({
            message: "Registered Successfully"
        });
    } catch (error) {
        res.status(400).json({
            error: "Registeration Failed"
        });
    }
}

//User Login
export const Login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        };
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!passwordMatch){
            return res.status(400).json({
                message: "Password Missmatching"
            })
        }
        const jwtToken = jwt.sign({payload: user._id}, process.env.SECRET_KEY);
        res.status(200).json({
            jwtToken,
            message: "Login Successful"
        });
       } catch (error) {
        res.status(400).json({
            error: "Unable to Logging in"
        })
        }
    };

    //Forget Passsword
    export const Forget = async (req, res)=>{
        try {
            const {email} = req.body;
            const checkEmail = await User.findOne({email: email});
            if(!checkEmail){
                return res.status(404).json({
                    message: "Email Not Registered!!!"
                })
            }
            const token = crypto.randomBytes(20).toString("hex");
            checkEmail.token = token;
            checkEmail.save();
            sendMail(email, "password Reset", `Reset Link ${token}`);
    
            res.status(200).json({
                message: "Password Reset Successfully"
            });
        } catch (error) {
            res.status(400).json({
                error: "Error Occured"
            })
        }
    }

    //Reset token
    export const ResetToken = async(req,res)=>{

    try {
       const { token } = req.query;
       const { password } = req.body;
       
   // Finding the user  token
    const user = await User.findOne({ token:token});
  
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
  
    // Update the user's password and delete token
    user.token = undefined;
    const hashedPassword = await bcrypt.hash(password,10);
    user.password = hashedPassword;
    await user.save();
  
    return res.status(200).json({ message: "Password reset successfully" });
      
    } catch (error) {
      
      res.status(403).json({message:"unauthorised"});
      console.log(error)
    }
  }