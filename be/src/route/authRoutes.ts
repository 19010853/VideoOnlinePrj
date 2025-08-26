import express from "express";
import { changePassword, login, register, sendEmailForChangePassword } from "../controller/auth/authController";
const router = express.Router();

router.post("/sign-up", register);
router.post("/sign-in", login)
router.post("/send-email-for-change-password", sendEmailForChangePassword)
router.post("/change-password/:token", changePassword)

export default router;