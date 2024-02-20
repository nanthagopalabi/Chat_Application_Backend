import express from 'express';
import { accessChat, addFromGroup, createGroupChat, getChat, groupRenaming, removeUserFromGroup  } from '../controllers/chatController';

const router=express.Router();

//to create personal chat
router.route("/").post(accessChat);

//to get all my chats
router.route("/").get(getChat);

//to create a group chat
router.route("/group").post(createGroupChat);

router.route("/rename").put(groupRenaming)
router.route("/groupremove").put(removeUserFromGroup);
router.route("/groupadd").put(addFromGroup);


export {router as chatRouter}