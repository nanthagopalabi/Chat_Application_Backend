import { Chat } from "../model/chatModel.js";
import { User } from "../model/userModel.js";

export const accessChat=async(req,res)=>{
    
    const {userId}=req.body;

    if(!userId){
        console.log("UserId param not sent with req");
    return res.status(400).send("unable to find the userId");}

var isChat=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$eleMatch:{$eq:req.user._id}}},
        {users:{$eleMatch:{$eq:userId}}},
    ]    
}).populate("users","-password").populate("latestMessage");

isChat=await User.populate(isChat,{
    path: "latestMessage.sender",
    select:"name pic email",
});

if(isChat.length>0){
    res.status(200).send(isChat[0]);
} else{
    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId],
};
}

try {
    const createChat=await Chat.create(chatData);
    const FullChat= await Chat.findOne({_id:createChat._id}).populate("users","-password");

    res.status(200).send(FullChat);
    
} catch (error) {
    res.status(400).send(error);
}
}