import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { useState, useEffect, useMemo } from "react";
import "./../App.css";

export default function CardSwiper({ court }) {
  const [images, setImages] = useState([]);

  const getCourtImage = useMemo(() => {
    if (!court) return [];
    return court.flatMap((data) => data.image);
  }, [court]);

  useEffect(() => {
    setImages(getCourtImage);
  }, [getCourtImage]);

  if (!court || images.length === 0) return <p>No images</p>;

  return (
    <Swiper
      speed={600}
      spaceBetween={30}
      grabCursor={true}
      slidesPerView={1}
      effect={"fade"}
      fadeEffect={{ crossFade: true }}
      keyboard={{
        enabled: true,
      }}
      breakpoints={{
        769: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
      }}
      navigation={true}
      pagination={{
        clickable: true,
      }}
      modules={[EffectFade, Navigation, Pagination]}
      className="mySwiper">
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`Slide ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
