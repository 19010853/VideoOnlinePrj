import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

export const fetchVideos: RequestHandler = async (req, res) => {
    try {
        const videos = await Video.find({ isPrivate: false }).sort({ createdAt: -1 }).populate("uploadedBy", "email");

        return responseSending(res, 200, true, "Videos fetched successfully", { videos });
    } catch (error: any) {
        console.error("Error fetching video", error);
        return responseSending(res, 500, false, "Internal server error");
    }
};

export const fetchSingleVideo: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return responseSending(res, 400, false, "Invalid video id");
        }
        const video = await Video.findById(id).populate("uploadedBy", "email");
        if (!video) {
            return responseSending(res, 400, false, "Video not found");
        }
        return responseSending(res, 200, true, "Video fetched successfully", { video });
    } catch (error: any) {
        console.error("Error fetching single video", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}

export const deleteVideo: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return responseSending(res, 400, false, "Invalid video id");
        }
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return responseSending(res, 400, false, "Video not found");
        }
        return responseSending(res, 200, true, "Video deleted successfully");
    } catch (error: any) {
        console.error("Error deleting video", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}

export const downloadVideo: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        if (!id) {
            return responseSending(res, 400, false, "Invalid video id");
        }

        const video = await Video.findById(id);
        if (!video) {
            return responseSending(res, 400, false, "Video not found");
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: video.key,
        };

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.downloadCount += 1;
                await user.save();
            }
        }

        const { Readable } = require("stream");
        const command = new GetObjectCommand(params);
        const s3Response = await s3.send(command);
        const stream = s3Response.Body as NodeJS.ReadableStream;

        res.setHeader("Content-Type", s3Response.ContentType || "video/mp4");
        res.setHeader("Content-Disposition", `attachment; filename="${video.title}"`);
        stream.pipe(res);

        return responseSending(res, 200, true, "Video downloaded successfully");

    } catch (error: any) {
        console.error("Error downloading video", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}

export const updateVideo: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return responseSending(res, 400, false, "Invalid video id");
        }

        const video = await Video.findById(id);
        if (!video) {
            return responseSending(res, 400, false, "Video not found");
        }

        Object.assign(video, req.body);
        await video.save();

        // Check if the video is present in the request
        if (req.files && (req.files as any).video) {
            const videoFile = (req.files as any).video[0];
            if ("location" in videoFile && "key" in videoFile) {
                video.path = videoFile.location;
                video.key = videoFile.key;
            }
        }

        // Check if the thumbNail is present in the request
        if (req.files && (req.files as any).thumbNail) {
            const thumbNailFile = (req.files as any).thumbNail[0];
            if ("location" in thumbNailFile && "key" in thumbNailFile) {
                video.thumbNail = thumbNailFile.location;
            }
        }

        await video.save();

        return responseSending(res, 200, true, "Video updated successfully", { video });
    } catch (error: any) {
        console.error("Error updating video", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}

export const fetchVideosForLoggedInUser: RequestHandler = async (req, res) => {
    try {
        if (req.user instanceof User) {
            const userId = req.user._id;
            if (!userId) {
                return responseSending(res, 404, false, "user id not found");
            }

            const videos = await Video.find({ uploadedBy: userId }).populate("uploadedBy", "email");
            return responseSending(res, 200, true, "Videos fetched successfully", { videos });
        }
    } catch (error: any) {
        console.error("Error fetching videos for logged in user", error);
        return responseSending(res, 500, false, "Internal server error");
    }
}
