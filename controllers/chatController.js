import {Chat} from "../models/chatModel.js"
import { User } from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).send("Unable to find the userId");
  }

  try {
      const isChat = await Chat.find({
          isGroupChat: false,
          $and: [
              { users: { $elemMatch: { $eq: req.user?._id } } },
              { users: { $elemMatch: { $eq: userId } } },
          ]
      }).populate("users", "-password").populate("latestMessage");

      if (isChat.length > 0) {
          res.status(200).send(isChat[0]);
      } else {
          const chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user?._id, userId], 
          };

          const createChat = await Chat.create(chatData);
          const fullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
          res.status(200).send(fullChat);
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
};

//function to get  chat history
export const getChat = async (req, res) => {
  try {
      const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user?._id } } })
          .populate({
              path: "users",
              select: "-password" // Exclude sensitive information like password
          })
          .populate("groupAdmin", "-password")
          .populate({
              path: "latestMessage",
              populate: { path: "sender", select: "name pic email" }
          })
          .sort({ updatedAt: -1 });

      if (!chats) {
          return res.status(404).json({ error: "Chats not found." });
      }

      return res.status(200).json(chats);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
}

//to create group chat
export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields"});
    }
  
    // var users = JSON.parse(req.body.users);
    const users=req.body.users
    users.push(req.user);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
  
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
export const groupRenaming = async (req, res) => {
  try {
      const { chatId, chatName } = req.body;

      const updatedChat = await Chat.findOneAndUpdate({ _id: chatId },
          { chatName: chatName },
          {
              new: true
          }
      )?.populate("users", "-password")?.populate("groupAdmin", "-password");

      if (!updatedChat) {
          return res.status(404).send("Unable to find the Chat");
      }

      return res.status(200).json(updatedChat);

  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
}

// Remove user from group
export const removeUserFromGroup = async (req, res) => {
  try {
      const { chatId, userId } = req.body;
      const chat = await Chat.findById(chatId);

      if (!chat) {
          res.status(404);
          throw new Error("Chat Not Found");
      }

      // Check if the requester's ID is in the 'groupAdmin' array
      if (chat.groupAdmin?.toString() !== req.user?._id?.toString()) {
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
      )?.populate("users", "-password")?.populate("groupAdmin", "-password");

      // Check if the Chat document was not found
      if (!removed) {
          res.status(404);
          throw new Error("Chat Not Found");
      } else {
          return res.status(200).json(removed);
      }

  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
}

// Add new person to group
export const addFromGroup = async (req, res) => {
  try {
      const { chatId, userId } = req.body;

      if (!chatId || !userId) {
          return res.status(400).json({ error: "Chat ID or User ID is missing." });
      }

      // Using the Chat document by pulling the userId from the 'users' array
      const addNew = await Chat.findByIdAndUpdate(
          chatId,
          { $addToSet: { users: userId } }, // Using $addToSet to prevent adding duplicate users
          { new: true }
      )?.populate("users", "-password")?.populate("groupAdmin", "-password");


      // Check if the Chat document was not found
      if (!addNew) {
          res.status(404);
          throw new Error("Unable to Add");
      } else {
          return res.status(200).json(addNew);
      }

  } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
  }
}
