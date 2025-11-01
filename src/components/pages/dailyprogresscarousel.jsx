import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import DailyProgressPage from "./dailyprogresspage";

import theme from "../../utils/theme";


export default function DailyProgressCarousel() {
  return (
    <div className="max-w-sm mt-5 p-5 pb-10 rounded-xl"
    style={{backgroundColor:theme.background}}
    >
      <DailyProgressPage /> 
      
    </div>
  );
}
