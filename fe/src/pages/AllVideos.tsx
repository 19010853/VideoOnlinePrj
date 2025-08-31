import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store";
import {
    fetchPublicVideos,
    getSearchVideos,
    selectPublicVideos,
    selectSearchVideos,
} from "../store/slices/videoSlice";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import HeroCard from "../components/HeroCard";
import { selectIsLoading } from "../store/slices/authSlice";
import Skeleton from "react-loading-skeleton";

const AllVideos: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const searchVideos = useSelector(selectSearchVideos);
    const dispatch = useDispatch<AppDispatch>();
    const publicVideos = useSelector(selectPublicVideos);
    const isLoading = useSelector(selectIsLoading);

    useEffect(() => {
        if (searchText) {
            dispatch(getSearchVideos(searchText));
        }
        dispatch(fetchPublicVideos());
    }, [dispatch, searchText]);

    const handleSearch = () => {
        setSearchText(query);
    };

    return (
        <Layout>
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                <main className="max-w-7xl mx-auto">
                    {/* Search Bar */}
                    <div className="flex flex-col items-center mt-8 mb-10">
                        <h1 className="text-3xl font-bold text-blue-700 mb-4">Explore Videos</h1>
                        <div className="flex w-full max-w-xl">
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search videos..."
                                className="flex-1 rounded-l-full px-4 py-2 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
                            />
                            <button
                                onClick={handleSearch}
                                className="rounded-r-full px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Videos Grid */}
                    <div className="mt-4">
                        {searchText ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {searchVideos?.length ? (
                                    searchVideos.map((video) => (
                                        <HeroCard key={video._id} video={video} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-10">
                                        No videos found for "<span className="font-semibold">{searchText}</span>"
                                    </div>
                                )}
                            </div>
                        ) : isLoading ? (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[...Array(8)].map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        height={300}
                                        width={250}
                                        className="rounded-xl"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {publicVideos?.map((video) => (
                                    <HeroCard key={video._id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default AllVideos;