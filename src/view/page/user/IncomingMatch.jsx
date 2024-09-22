import axios from "axios";
import authToken from "./../../../utils/authToken";
import football from "./../../../assets/footballbanner.jpg";
import basketball from "./../../../assets/basketballBanner.jpg";
import defaultImage from "./../../../assets/defaultImg.jpg";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "./../../../utils/timeCalculation";
import Loader from "../../../components/Loader";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Avatar, Box, Paper, Typography } from "@mui/material";

const fetchBookings = async (token) => {
  try {
    // Configure Axios to include credentials in cross-site requests
    axios.defaults.withCredentials = true;
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
  if (error) return <Navigate to="/error" />;

  //* Changing theme according to sport type
  const switchBannerImage = (type) => {
    const sportType = type?.toLowerCase();

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
        gap: "2rem",
        flexWrap: "wrap",
        margin: "1rem 0 2rem 0 ",
      }}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}>
        Incoming Match
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          gap: "3rem",
        }}>
        {pendingMatch.length > 0 ? (
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
          ))
        ) : (
          <Box
            sx={{
              width: "100%",
              mx: "10rem",
              border: "1px solid #000",
              borderRadius: "5px",
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: ".8rem",
              boxShadow:
                "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease-in-out", // Smooth transition for shadow
              "&:hover": {
                boxShadow:
                  "0 8px 16px rgba(0, 0, 0, 0.2), 0 12px 40px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
              },
            }}>
            <EventBusyIcon />
            <Typography sx={{ fontSize: "1rem" }}>
              There is no incoming match for you
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
