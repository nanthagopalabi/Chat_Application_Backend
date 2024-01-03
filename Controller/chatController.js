import mongoose from "mongoose";
import {Chat} from "../Model/chatModel";

const accessChat=async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        console.log("UserId param not send with request");
        return res.send
    }
}