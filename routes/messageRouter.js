import express from 'express'
import { allMessage, sendMsg } from '../controllers/messageController.js';

const router=express.Router();

//Post personal Message
router.route("/").post(sendMsg);

//get all messages
router.route("/:chatId").get(allMessage);

export {router as msgRouter}