import { S3Client } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import path from "path";
import dotenv from "dotenv";
import Video from "../../model/videoSchema";
import User from "../../model/userSchema";
import { responseSending } from "../../utils/responseSending";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY as string,

    }
})

export const uploadFile: RequestHandler = async (req, res) => {
    try {
        if (req.files && (req.files as any).video) {
            let { title, description, isPrivate } = req.body;
            let baseName;
            const videoFile = (req.files as any).video[0];
            const thumbNailFile = (req.files as any).thumbNail ? (req.files as any).thumbNail[0] : null;

            if (!title) {
                const ext = path.extname(videoFile.originalname);
                baseName = path.basename(videoFile.originalname, ext);
            }

            if (req.user instanceof User) {
                if ("location" in videoFile) {
                    if ("key" in videoFile) {
                        const newVideo = await Video.create({
                            title: title || null,
                            description: description ? description : null,
                            uploadedBy: req.user._id,
                            key: videoFile.key,
                            isPrivate: isPrivate ? isPrivate : false,
                            thumbNail: thumbNailFile ? thumbNailFile.location : null,
                        });

                        const user = await User.findById(req.user._id);
                        if (user) {
                            user.uploadCount += 1;
                            await user.save();
                        }

                        return responseSending(res, 200, true, "Video uploaded successfully", {
                            video: {
                                _id: newVideo._id,
                                path: newVideo.path,
                                title: newVideo.title,
                                description: newVideo.description,
                                thumbNail: newVideo.thumbNail,
                                uploadedBy: {
                                    email: user?.email,
                                },
                                isPrivate: newVideo.isPrivate,
                            },
                        });
                    }
                    return responseSending(res, 400, false, "Upload failed");
                }
            }
            return responseSending(res, 404, false, "User not found");
        }
    } catch (error: any) {
        console.error("Error uploading file", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}