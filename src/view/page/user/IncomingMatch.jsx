import axios from "axios";
import authToken from "./../../../utils/authToken";
import football from "./../../../assets/footballbanner.jpg";
import basketball from "./../../../assets/basketballBanner.jpg";
import defaultImage from "./../../../assets/defaultImg.jpg";

import { useQuery } from "@tanstack/react-query";
import { formatDate } from "./../../../utils/timeCalculation";
import Loader from "../../../components/Loader";

import { Avatar, Box, Paper } from "@mui/material";
const fetchBookings = async (token) => {
  try {
    const bookings = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const incoming = bookings.data.booking;

    // Pending bookings are incoming match
    const pendingMatch = incoming.filter(
      (booking) => booking.status === "pending"
    );
    return pendingMatch;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default function IncomingMatch() {
  const token = authToken();
  const {
    data: pendingMatch = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pendingMatch", token],
    queryFn: () => fetchBookings(token),
  });
  if (isLoading) return <Loader />;
  if (error) return <p> fetching error </p>;

  //* Changing theme according to sport type
  const switchBannerImage = (type) => {
    const sportType = type?.toLowerCase();

    console.log(sportType);
    if (sportType === "football") {
      return `url(${football})`;
    } else if (sportType === "basketball") {
      return `url(${basketball})`;
    } else {
      return `url(${defaultImage})`;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "3rem",
        flexWrapper: "wrap",
        my: 4,
      }}>
      <span className="incoming-title">IncomingMatch</span>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "3rem",
        }}>
        {pendingMatch.length > 0 &&
          pendingMatch.map((match, key) => (
            <Paper
              key={key}
              sx={{
                width: "25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: switchBannerImage(match?.facility),
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "multiply",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backgroundSize: "cover",
                position: "relative",
                borderRadius: "5px",
                gap: "1rem",
              }}
              className="card-incoming-match">
              <div className="card__container">
                <span className="card__header">{formatDate(match?.date)}</span>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "start",
                    gap: "1rem",
                  }}>
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={match?.lessor?.logo}
                  />
                  <div className="incoming-detail">
                    <span>{match?.lessor?.sportcenter_name}</span>
                    <span>
                      {match?.startTime} - {match?.endTime}
                    </span>
                    <span>
                      {match?.facility} ({match?.court})
                    </span>
                  </div>
                </Box>
              </div>
            </Paper>
          ))}
      </Box>
    </Box>
  );
}
