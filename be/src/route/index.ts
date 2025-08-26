import express from "express";
import authRoutes from "./authRoutes";
import passport from "passport";
import userRoutes from "./userRoutes";
import awsFileRoutes from "./awsFileRoutes";

const router = express.Router();
router.use("/auth", authRoutes);

router.use(
    "/user",
    passport.authenticate("jwt", { session: false }),
    userRoutes
)

router.use("/aws", passport.authenticate("jwt", { session: false }), awsFileRoutes);

export default router;