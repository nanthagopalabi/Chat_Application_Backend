import express from 'express'
import { sendMsg } from '../Controller/messageController.js';


const router=express.Router();

//Post personal Message
router.route("/sendMsg").post(sendMsg);

//to get all my Messages
// router.route("/getMsg").get(getMsg);

// //to create a group chat
// router.route("/group").post(createGroupChat);

// router.route("/rename").put(groupRenaming)
// router.route("/groupremove").put(removeUserFromGroup);
// router.route("/groupadd").put(addFromGroup);


export {router as MsgRouter}