import { Chat } from "../model/chatModel.js";
import { Message } from "../model/messageModel.js";
import { User } from "./model/userModel.js";

//Send Message
const sendMsg = async (req,res)=>{
   try {
    const {content, chatId} = req.body

    if(!content || !chatId){
        return res.status(400).send("Invalid Data passed to request")
    }
    const newMessage={
        sender:req.user._id,
        content:content,
        chat: chatId
    }
 
    let message= await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message=await User.populate(message,{
        path:'chat.users',
        select:'name email pic'
    });

    await Chat.findByIdAndUpdate(chatId,{
        latestMessage: message,
    })

    return res.status(200).json(message)
   } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error")
   }
}

//get all message
export const allMessage=async(req,res)=>{
     
    try {
    
        const message=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")

        return res.status(200).json(message);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");   
    }
}

export {sendMsg}