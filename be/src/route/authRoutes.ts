import express from "express";
import { register } from "../controller/auth/authController";
const router = express.Router();

router.post("/sign-up", register);

export default router;