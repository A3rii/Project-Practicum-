import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import "./../../App.css"
import FootBall from "./../../assets/HomeImages/pic4.jpg"
import BasketBall from "./../../assets/HomeImages/pic5.jpg"
import VolleyBall from "./../../assets/HomeImages/pic6.jpg"
import Gym from "./../../assets/HomeImages/pic7.png"
import Futsal from "./../../assets/HomeImages/pic8.jpg"
import Badminton from "./../../assets/HomeImages/pic9.jpg"






export default function CardSwiper() {
   return (
      <>
         <Swiper
            slidesPerView={2}
            centeredSlides={false}
            slidesPerGroupSkip={1}
            grabCursor={true}
            keyboard={{
               enabled: true,
            }}
            breakpoints={{
               769: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
               },
            }}
            navigation={true}
            pagination={{
               clickable: true,
            }}
            modules={[Keyboard, Navigation, Pagination]}
            className="mySwiper"
         >
            <SwiperSlide>
               <div className="home-swiper-1">
                  <img src={FootBall} alt="#" />
                  <span>Football</span>
               </div>
            </SwiperSlide>
            <SwiperSlide>
               <div className="home-swiper-2">
                  <img src={BasketBall} alt="#" />
                  <span>Basketball</span>
               </div>
            </SwiperSlide>
            <SwiperSlide>
               <div className="home-swiper-3">
                  <img src={VolleyBall} alt="#" />
                  <span>VolleyBall</span>
               </div>
            </SwiperSlide>
            <SwiperSlide>
               <div className="home-swiper-1">
                  <img src={Gym} alt="#" />
                  <span>Gym</span>
               </div>
            </SwiperSlide>
            <SwiperSlide>
               <div className="home-swiper-1">
                  <img src={Futsal} alt="#" />
                  <span>Futsal</span>
               </div>
            </SwiperSlide>
            <SwiperSlide>
               <div className="home-swiper-1">
                  <img src={Badminton} alt="#" />
                  <span>Badminton</span>
               </div>
            </SwiperSlide>


         </Swiper>
      </>
   );
}