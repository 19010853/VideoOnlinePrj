import express from "express";
import { login, register } from "../controller/auth/authController";
const router = express.Router();

router.post("/sign-up", register);
router.post("/sign-in", login)

export default router;