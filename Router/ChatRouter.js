import express from 'express'
import { accessChat } from '../controller/chatController.js';

const router=express.Router();

router.route("/").post(accessChat);
router.route("/").get();
router.route("/group").post();
router.route("/rename").put()
router.route("/groupremove").put();
router.route("/groupadd").put();






export {router as ChatRouter}