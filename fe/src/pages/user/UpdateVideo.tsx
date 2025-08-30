import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEditVideo, updateVideo } from "../../store/slices/videoSlice";
import type { AppDispatch } from "../../store";
import { useRef, useState } from "react";
import { useConfig } from "../../hooks/useConfig";
import toast from "react-hot-toast";
import SideBar from "../../components/Sidebar";
import ReactQuill from "react-quill";

const UpdateVideo: React.FC = () => {

    const editVideo = useSelector(selectEditVideo);
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(
        typeof editVideo?.path === 'string' ? editVideo.path : ""
    );
    const thumbNailInputRef = useRef<HTMLInputElement>(null);
    const [thumbNailSrc, setThumbNailSrc] = useState<string | null>(
        typeof editVideo?.thumbNail === 'string' ? editVideo.thumbNail : ""
    );
    const [title, setTitle] = useState<string>(editVideo?.title || "");
    const [description, setDescription] = useState<string>(editVideo?.description || "");
    const [isPrivate, setIsPrivate] = useState<boolean>(
        Boolean(editVideo?.isPrivate)
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { configUsingToken } = useConfig();

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.type.startsWith("video")) {
                const videoUrl = URL.createObjectURL(file);
                setVideoSrc(videoUrl);
            } else {
                toast.error("Please select a video file");
                return;
            }
        }
    }

    const handleThumbNailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("image")) {
                const thumbNailUrl = URL.createObjectURL(file);
                setThumbNailSrc(thumbNailUrl);
            }
        }
    }

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsPrivate(e.target.value === 'true');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const file = fileInputRef.current?.files?.[0];
        const thumbNail = thumbNailInputRef.current?.files?.[0];
        const formData = new FormData();

        if (file) formData.append("video", file);
        if (thumbNail) formData.append("thumbNail", thumbNail);

        try {
            if (editVideo?._id) {
                await dispatch(updateVideo({
                    id: editVideo?._id,
                    configUsingToken: configUsingToken,
                    updateData: {
                        title: title || editVideo.title,
                        description: description || editVideo.description,
                        isPrivate: isPrivate || editVideo.isPrivate,
                        _id: editVideo?._id,
                        uploadedBy: {
                            email: editVideo.uploadedBy.email,
                        },
                        path: file || editVideo.path,
                        thumbNail: thumbNail || editVideo.thumbNail,
                    }
                }))
            }
            setVideoSrc(null);
            setThumbNailSrc(null);
            setTitle("");
            setDescription("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex w-full">
            <SideBar />
            <main className="flex-1 p-4 mt-7 lg:ml-64">
                <section className="flex flex-col items-center">
                    <form
                        className="container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg"
                        onSubmit={handleSubmit}
                    >
                        {/* Video Upload Section */}
                        <label htmlFor="video" className="text-textOne font-semibold">
                            Video
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleVideoChange}
                            accept="video/*"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
                        />

                        {videoSrc && (
                            <div className="mt-4 flex flex-col items-center">
                                <video
                                    src={videoSrc}
                                    controls
                                    className="w-32 h-32 object-cover rounded-md shadow-md"
                                />
                            </div>
                        )}

                        {/* Thumbnail Upload Section */}
                        <label htmlFor="thumbnail" className="text-textOne font-semibold">
                            Thumbnail (Optional)
                        </label>
                        <input
                            type="file"
                            ref={thumbNailInputRef}
                            onChange={handleThumbNailChange}
                            accept="image/*"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
                        />

                        {thumbNailSrc && (
                            <div className="mt-4 flex flex-col items-center">
                                <img
                                    src={thumbNailSrc}
                                    alt="Thumbnail Preview"
                                    className="w-32 h-32 object-cover rounded-md shadow-md"
                                />
                            </div>
                        )}

                        <label htmlFor="title" className="text-textOne font-semibold">
                            Title (Optional)
                        </label>
                        <input
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title of your video"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
                        />

                        <label htmlFor="description" className="text-textOne font-semibold">
                            Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            className="w-full p-3 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={description}
                            onChange={setDescription}
                        />

                        <label htmlFor="privacy" className="text-textOne font-semibold">
                            Privacy
                        </label>
                        <select
                            name="privacy"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
                            value={isPrivate.toString()}
                            onChange={handlePrivacyChange}
                        >
                            <option value="false">Public</option>
                            <option value="true">Private</option>
                        </select>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-bgFour rounded-md p-2 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-full md:w-fit flex items-center justify-center disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin mr-2 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                            ></path>
                                        </svg>
                                        updating...
                                    </>
                                ) : (
                                    "Update video"
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default UpdateVideo;