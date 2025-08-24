import express from "express";

import authRoutes from "./authRoutes";
import passport from "passport";
import userRoutes from "./userRoutes";

const router = express.Router();
router.use("/auth", authRoutes);

router.use(
    "/user",
    passport.authenticate("jwt", { session: false }),
    userRoutes
)

export default router;