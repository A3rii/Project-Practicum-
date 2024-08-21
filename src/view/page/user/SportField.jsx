import "react-toastify/dist/ReactToastify.css";
import ContactInfo from "../../../components/ContactInfo";
import CardSwiper from "../../../components/CardSwiper";
import axios from "axios";
import Loader from "./../../../components/Loader";
import {
  ReservationDate,
  TimeAvailability,
} from "./../../../components/User/TimeReservation";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

// Fetching sport center informations
const fetchSportCenter = async (sportCenterId) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    return data.lessor.facilities;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
    throw err;
  }
};
export default function SportField() {
  const { facilityId, sportCenterId } = useParams();

  const {
    data: facility = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facility", sportCenterId],
    queryFn: () => fetchSportCenter(sportCenterId),
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (error) return <Navigate to="/error" />;

  const facilityInformation = facility?.find(
    (facility) => facility._id === facilityId
  );

  if (!facilityInformation) {
    return <p>Facility not found.</p>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="sportField-header">
        <div className="sportField-banner">
          <h2> {facilityInformation.name} </h2>
          <span>{facilityInformation.description}</span>
        </div>

        {/** Date and Time */}
        <div className="sport-reserve">
          <ReservationDate court={facilityInformation.court} />
        </div>
      </div>

      <div className="sport-schedule">
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}>
          Booked Schedule
        </Typography>
        <TimeAvailability
          sportCenterId={sportCenterId}
          facility={facilityInformation.name}
          court={facilityInformation.court}
        />
      </div>

      <div className="sportField-Slider">
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              lg: "1.5rem",
              md: "1.4rem",
              sm: "1.3rem",
              xs: "1.2rem",
            },
            fontWeight: "bold",
          }}>
          Our {facilityInformation.name} View
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}>
          <CardSwiper court={facilityInformation.court} />
        </Box>
      </div>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
