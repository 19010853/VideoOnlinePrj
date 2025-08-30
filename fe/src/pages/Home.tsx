// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa6";
import Slider from "../components/Slider";
import type { AppDispatch } from "../store";
import { fetchPublicVideos, selectLoading, selectPublicVideos } from "../store/slices/videoSlice";

const Home: React.FC = () => {
  const publicVideos = useSelector(selectPublicVideos);
  const isLoading = useSelector(selectLoading);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPublicVideos());
  }, [dispatch]);

  return (
    <Layout>
      <div className="relative w-full  h-[80vh]">
        {/* Overlay */}
        {!isPlaying && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-gray-700 flex flex-col justify-center items-center p-8"
            style={{ zIndex: 5 }}
          >
            <h1 className="text-4xl font-bold mb-4 md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-300 to-yellow-800">
              Job Ready MERN Stack Course with AWS
            </h1>
            <p className="text-lg mb-6 md:text-xl font-extralight text-white">
              Enhance your skills with our comprehensive MERN Stack course,
              including AWS deployment and real-world projects. Get ready for a
              career in web development.
            </p>
            <button
              className="bg-blue-500 text-white w-16 h-16 rounded-full flex  animate-scale-pulse justify-center items-center mt-4
              transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform"
              onClick={() => setIsPlaying(true)}
            >
              <FaPlay className="text-4xl" />
            </button>
            <button
              className="bg-blue-500 text-black px-6 py-3 rounded mt-4 shadow-lg hover:bg-blue-200 transition duration-300"
              onClick={() => setIsPlaying(true)}
            >
              Watch Now
            </button>
          </div>
        )}
        {/* Video Player */}
        <div
          className={`absolute top-0 left-0 w-full h-full ${
            isPlaying ? "block" : "hidden"
          }`}
          style={{ zIndex: isPlaying ? 0 : 1 }}
        >
          <ReactPlayer
            src={"https://www.youtube.com/watch?v=_4CPp670fK4"}
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            playing={isPlaying}
          />
        </div>
      </div>

      <main className=" w-[95vw]">
        <h2 className="capitalize text-textTwo  text-lg sm:text-2xl md:text-3xl lg:text-4xl  mt-2 p-4">
          Recently Added
        </h2>

        <div className="p-4">
          <Slider videos={publicVideos || []} />
        </div>
      </main>
    </Layout>
  );
};

export default Home;