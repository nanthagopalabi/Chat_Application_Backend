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
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}},
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

//function to get  chat history
export const getChat=async (req,res)=>{

    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
        //   .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}


//to create group chat
export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields"});
    }
  
    // var users = JSON.parse(req.body.users);
    const users=req.body.users
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat:true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).send("Unable to create a group");
      
    }
  };
  

  //group rename
  export const groupRenaming=async(req,res)=>{

    try {
       const {chatId,chatName}=req.body

       const updatedChat=await Chat.findOneAndUpdate({_id:chatId},
        {chatName:chatName},{
        new:true
        
       }).populate("users","-password").populate("groupAdmin","-password")

       if(!updatedChat){

        return res.status(404).send("Unable to find the Chat");
       }

       return res.status(200).json(updatedChat);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
  }


  //removing user from group
  export const removeUserFromGroup=async(req,res)=>{      
    
     try {
        const { chatId, userId } = req.body;
        const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat Not Found");
  }


  // Check if the requester's ID is in the 'groupAdmin' array
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Permission Denied: Only admins can perform this action");
  }

  // Using the Chat document by pulling the userId from the 'users' array
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  // Check if the Chat document was not found
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
   return  res.status(200).json(removed);

}       
     } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
        
     }
}


//Add new person to group
export const addFromGroup=async(req,res)=>{      
    
    try {
       const { chatId, userId } = req.body;
       const chat = await Chat.findById(chatId);

 if (!chat) {
   res.status(404);
   throw new Error("Chat Not Found");
 }


 // Check if the requester's ID is in the 'groupAdmin' array
 if (chat.groupAdmin.toString() !== req.user._id.toString()) {
   res.status(403);
   throw new Error("Permission Denied: Only admins can perform this action");
 }

 // Using the Chat document by pulling the userId from the 'users' array
 const addNew = await Chat.findByIdAndUpdate(
   chatId,
   {
     $push: { users: userId },
   },
   {
     new: true,
   }
 )
   .populate("users", "-password")
   .populate("groupAdmin", "-password");

 // Check if the Chat document was not found
 if (!addNew) {
   res.status(404);
   throw new Error("Unable to Add");
 } else {
  return  res.status(200).json(addNew);

}       
    } catch (error) {
       console.error(error);
       return res.status(500).send("Internal Server Error");
       
    }
}  
