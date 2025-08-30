import express from "express";
import { uploadFile, fetchSingleVideo, deleteVideo, updateVideo, fetchVideos } from "../controller/awsFile/awsFileController";
import { upload } from "../middleware/multer-s3";

const router = express.Router();

router.post("/upload-file", upload, uploadFile);
router.get("/fetch-videos", fetchVideos);
router.delete("/delete-video/:id", deleteVideo);
router.put("/update-video/:id", upload, updateVideo);

export default router;