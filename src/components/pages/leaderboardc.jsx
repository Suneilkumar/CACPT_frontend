import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import theme from "../../utils/theme";
import UserAccuracyBar from "./useraccuracybar";

export default function LeaderboardCarousel({ subject, leaders, currentUserId }) {
    return (
      <div className="max-w-4xl mx-auto rounded-2xl shadow-md p-4 bg-white dark:bg-gray-800">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={40}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          grabCursor={true}
          style={{ paddingBottom: "2rem" }}
        >
          {/* Slide 1: Top Scorers */}
          <SwiperSlide>
            <div className="text-center mb-4">
              <h1
                className="text-xl font-semibold mb-2"
                style={{ color: theme.primary }}
              >
                {subject || "Overall"} — Top Scorers
              </h1>
            </div>
  
            <div className="flex flex-wrap justify-center gap-3">
              {(leaders || []).slice(0, 10).map((user, idx) => {
                const displayName =
                  user.fullName?.trim() ||
                  (user.email ? user.email.split("@")[0] : "Anonymous");
  
                return (
                  <div
                    key={user.userId}
                    className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl w-28 sm:w-32 hover:shadow-md transition"
                  >
                    <img
                      src={user.imageUrl}
                      alt={displayName}
                      className="w-12 h-12 rounded-full border mt-1 mb-1 shadow-[0_0_10px_3px_rgba(59,130,246,0.3)]"
                    />
                    <p
                      className="font-semibold text-center text-xs"
                      style={{ color: theme.primary }}
                    >
                      {displayName}
                    </p>
                    <p
                      className="font-semibold mt-1"
                      style={{ color: theme.primary }}
                    >
                      {user.avgAccuracy.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.totalAttempts} attempts
                    </p>
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
  
          {/* Slide 2: Accuracy Distribution */}
          <SwiperSlide>
            <div className="text-center mb-4">
              <h1
                className="text-xl font-semibold mb-2"
                style={{ color: theme.primary }}
              >
                {subject || "Overall"} — Accuracy Distribution
              </h1>
            </div>
  
            <UserAccuracyBar leaders={leaders} currentUserId={currentUserId} />
          </SwiperSlide>
  
          {/* Future slide example */}
          {/* <SwiperSlide>
            <MyOtherStats />
          </SwiperSlide> */}
        </Swiper>
      </div>
    );
  }
  