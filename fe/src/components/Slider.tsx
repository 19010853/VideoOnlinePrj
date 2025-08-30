import type React from "react";
import type { IVideo } from "../store/slices/videoSlice";
import Slider from "react-slick";
import VideoCard from "./HeroCard";

interface IVideoSliderProps {
    videos: IVideo[];
}

const VideoSlider: React.FC<IVideoSliderProps> = ({ videos }) => {
    const sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {

                }
            }
        ]
    }

    return (
        <Slider {...sliderSettings}>
            {videos?.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </Slider>
    )
}

export default VideoSlider;