import express from "express";
const router = express.Router();

import { allMessages,sendMessage } from "../controllers/Message.controllers.js";
router.get("/:chatId", allMessages);
router.post("/",sendMessage);

export default router