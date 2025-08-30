import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchPublicVideos, selectPublicVideos } from "../store/slices/videoSlice";
import { useEffect } from "react";
import Layout from "../components/Layout";
import VideoCard from "../components/HeroCard";

const AllVideos: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const publicVideos = useSelector(selectPublicVideos);
    useEffect(() => {
        dispatch(fetchPublicVideos());
    }, [])

    return (
        <Layout>
            <div className="w-full p-4">
                <main className="w-[95vw]">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {publicVideos?.map((video, idx) => (
                            <VideoCard key={idx} video={video} />
                        ))}
                    </div>
                </main>
            </div>
        </Layout>
    )
}

export default AllVideos