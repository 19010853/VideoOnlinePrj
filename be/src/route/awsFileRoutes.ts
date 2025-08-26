import express from "express";
import { uploadFile } from "../controller/awsFile/awsFileController";
import { upload } from "../middleware/multer-s3";

const router = express.Router();

router.post("/upload-file", upload, uploadFile);

export default router;