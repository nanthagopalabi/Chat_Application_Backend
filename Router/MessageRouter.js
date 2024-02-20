import express from 'express'
import { allMessage, sendMsg } from '../Controller/messageController.js';


const router=express.Router();

//Post personal Message
router.route("/sendMsg").post(sendMsg);

//get all messages
router.route("/:chatId").get(allMessage);

// //to create a group chat
// router.route("/group").post(createGroupChat);

// router.route("/rename").put(groupRenaming)
// router.route("/groupremove").put(removeUserFromGroup);
// router.route("/groupadd").put(addFromGroup);


export {router as msgRouter}