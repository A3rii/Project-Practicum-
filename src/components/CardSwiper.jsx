import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade } from "swiper/modules";
import { Typography, Box } from "@mui/material";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./../App.css";

export default function CardSwiper({ court }) {
  if (!court || court.length === 0) return <p>No images</p>;

  return (
    <>
      {court.map((courtItem, courtIndex) => {
        const images = courtItem.image;

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
            key={courtIndex}>
            {/* Display court name or any other info if needed */}
            <Swiper
              direction={"vertical"}
              speed={600}
              spaceBetween={30}
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
              pagination={{
                clickable: true,
              }}
              modules={[EffectFade, Pagination]}
              className="mySwiper">
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image} loading="lazy" alt={`Slide ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Typography
                sx={{
                  width: "25%",
                  display: "inline-block",
                  padding: "5px",
                  fontSize: { lg: ".8rem", xs: ".6rem" },
                  fontWeight: "bold",
                  backgroundColor: "orange",
                  color: "white",
                  borderRadius: "10px",
                  textAlign: "center",
                }}>
                {courtItem.name}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
