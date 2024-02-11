import express from "express";
const router = express.Router();
import {login,register,allusers} from "../controllers/User.controllers.js"
//import { accesschat } from "../controllers/Chat.controllers.js";
router.post("/login" ,login)

router.post("/register",register)

router.get("/alluser",allusers)

export default router