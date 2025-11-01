import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import LeaderDashboardPage from "./leaderdashboardpage";

import theme from "../../utils/theme";


export default function LeaderDashboardCarousel() {
  return (
    <div className="max-w-sm mt-5 p-5 pb-10 rounded-xl"
    style={{backgroundColor:theme.background}}
    >
       
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
      >
        <SwiperSlide>
            <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <h1>This is the first slide</h1>
            </div>
        </SwiperSlide>

        <SwiperSlide>
            <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <LeaderDashboardPage />
            </div>
        </SwiperSlide>

        <SwiperSlide>
        <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <LeaderDashboardPage subject="Accounting" />
            </div>
        </SwiperSlide>

        <SwiperSlide>
        <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <LeaderDashboardPage subject="Business Laws" />
            </div>
        </SwiperSlide>

        <SwiperSlide>
        <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <LeaderDashboardPage subject="Quantitative Aptitude" />
            </div>
        </SwiperSlide>

        <SwiperSlide>
        <div className="mx-1 my-1 pb-10 flex justify-center items-center min-h-[450px] drop-shadow-lg">
                <LeaderDashboardPage subject="Business Economics" />
            </div>
        </SwiperSlide>
        
      </Swiper>
    </div>
  );
}
