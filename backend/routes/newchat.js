import express from "express";
const router = express.Router();

//import { accesschat } from "../controllers/User.controllers";
import { accesschat,fetchchats,createGroupChat,removeFromGroup,renameGroup,addToGroup } from "../controllers/Chat.controllers.js";

router.post("/" ,accesschat)
router.get("/getchats",fetchchats)
router.route("/group").post( createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupremove").put( removeFromGroup);
router.route("/groupadd").put(addToGroup);



export default router