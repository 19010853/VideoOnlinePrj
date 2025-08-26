import React, { useRef, useState } from 'react'
import { useConfig } from '../../hooks/useConfig';
import toast from 'react-hot-toast';
import apiServer from '../../api/apiServer';
import SideBar from '../../components/Sidebar';
import ReactQuill from 'react-quill';

const UserUpload: React.FC = () => {

    const fileRef = useRef<HTMLInputElement>(null);
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [thumbnailSource, setThumbnailSource] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<string>("false");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { configUsingToken } = useConfig();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("video/")) {
                const videoURL = URL.createObjectURL(file);
                setVideoSource(videoURL);
            } else {
                toast.error("Please upload a video file");
            }
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                const thumbnailURL = URL.createObjectURL(file);
                setThumbnailSource(thumbnailURL);
            }
        }
    };

    const handlePrivateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsPrivate(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        const thumbnail = thumbnailRef.current?.files?.[0];

        if (!file) {
            toast.error("Please upload a video file");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title || "");
            formData.append("description", description || "");
            formData.append("video", file);
            formData.append("isPrivate", isPrivate);


            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            const { data } = await apiServer.post("/api/v1/aws/upload-file", formData,
                {
                    ...configUsingToken,
                    headers: {
                        ...configUsingToken.headers,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                setTitle("");
                setDescription("");
                setIsPrivate("false");
                setVideoSource(null);
                setThumbnailSource(null);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <SideBar />
            <main className='flex-1 p-4 mt-7 lg: ml-64'>
                <section className='flex flex-col items-center'>
                    <form onSubmit={handleSubmit} className='container flex flex-col gap-4 p-6 bg-white shadow-lg rounded-lg'>
                        <label htmlFor="video" className='text-[#1c1c1c] font-semibold'>Video</label>
                        <input type="file" ref={fileRef} onChange={handleFileChange} accept='video/*' className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black' />
                        {/* video preview */}
                        {videoSource && (
                            <div className='mt-4 flex flex-col items-center'>
                                <video src={videoSource} controls className='w-32 h-32 object-cover rounded-md shadow-md' />
                            </div>
                        )}
                        {/* thumbnail */}
                        <label htmlFor="thumbnail" className='text-[#1c1c1c] font-semibold'>Thumbnail</label>
                        <input type="file" ref={thumbnailRef} onChange={handleThumbnailChange} accept='image/*' className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black' />
                        {/* thumbnail preview */}
                        {thumbnailSource && (
                            <div className='mt-4 flex flex-col items-center'>
                                <img src={thumbnailSource} alt="Thumbnail Preview" className='w-32 h-32 object-cover rounded-md shadow-md' />
                            </div>
                        )}
                        {/* title */}
                        <label htmlFor="title" className='text-[#1c1c1c] font-semibold'>Title</label>
                        <input type="text" name='title' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black' />
                        <label htmlFor="description" className='text-[#1c1c1c] font-semibold'>Description</label>
                        <ReactQuill theme='snow' className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600' value={description} onChange={setDescription} />
                        {/* isPrivate */}
                        <label htmlFor="privacy" className='text-[#1c1c1c] font-semibold'>Privacy</label>
                        <select
                            name="privacy"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bgFive"
                            value={isPrivate}
                            onChange={handlePrivateChange}
                        >
                            <option value="false">Public</option>
                            <option value="true">Private</option>
                        </select>

                        {/* submit button */}
                        <div className='flex items-center justify-center'>
                            <button type='submit' disabled={isLoading} className='bg-[#333333] rounded-md p-3 text-white text-lg mt-5 hover:bg-opacity-90 duration-300 capitalize w-full md:w-fit flex items-center justify-center disabled:cursor-not-allowed'>
                                {isLoading ? (
                                    <div className='flex items-center gap-2'>
                                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    "Upload video"
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default UserUpload