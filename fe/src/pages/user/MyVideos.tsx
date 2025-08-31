import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { useConfig } from "../../hooks/useConfig";
import { useEffect } from "react";
import { fetchVideosForLoggedInUser, selectVideosForLoggedInUser } from "../../store/slices/videoSlice";
import SideBar from "../../components/Sidebar";
import VideoCard from "../../components/VideoCard";
import { selectIsLoading } from "../../store/slices/authSlice";
import Loader from "../../components/Loader";

const MyVideos: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { configUsingToken } = useConfig();
    const videos = useSelector(selectVideosForLoggedInUser);
    const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        dispatch(fetchVideosForLoggedInUser({ configUsingToken: configUsingToken }))
    }, []);

    return (
        <div className="flex w-full gap-2">
            <SideBar />
            <main className="flex-1 lg:ml-64">
                <section className="p-4 mt-3">
                    { isLoading ? (
                        <Loader/>
                    ) : (   
                        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                            {videos?.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default MyVideos;