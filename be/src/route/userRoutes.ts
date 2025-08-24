import express from "express";
import { getUserDetails, updateUserDetails } from "../controller/user/userController";
const router = express.Router();

router.get("/profile", getUserDetails);
router.post("/update", updateUserDetails);

export default router;