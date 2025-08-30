import express from "express";
import authRoutes from "./authRoutes";
import passport from "passport";
import userRoutes from "./userRoutes";
import awsFileRoutes from "./awsFileRoutes";
import { downloadVideo, fetchSingleVideo, fetchVideos } from "../controller/awsFile/awsFileController";

const router = express.Router();
router.use("/auth", authRoutes);

router.use(
    "/user",
    passport.authenticate("jwt", { session: false }),
    userRoutes
)

router.use("/aws", passport.authenticate("jwt", { session: false }), awsFileRoutes);
router.get("/download/video/:id", downloadVideo);
router.get("/fetch-videos", fetchVideos);
router.get("/fetch-single-video/:id", fetchSingleVideo);

export default router;