import axios from "axios";
import authToken from "./../../../utils/authToken";

import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "./../../../utils/timeCalculation";
import { Typography, Box, Divider } from "@mui/material";
import dayjs from "dayjs";
import HistoryCard from "../../../components/User/HistoryCard";

const fetchBookings = async (token) => {
  try {
    // Configure Axios to iznclude credentials in cross-site requests
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
      (booking) =>
        booking.status === "approved" &&
        formatDate(booking.date) > dayjs(new Date()).format("MMMM DD, YYYY")
    );
    return pendingMatch;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default function IncomingMatch() {
  const token = authToken();
  const { data: pendingMatch = [], error } = useQuery({
    queryKey: ["pendingMatch", token],
    queryFn: () => fetchBookings(token),
  });
  if (error) return <Navigate to="/error" />;

  return (
    <Box
      sx={{
        margin: "5rem",
      }}>
      <Typography
        variant="h5"
        sx={{ fontFamily: "Noto Sans", fontWeight: "bold" }}>
        Up Coming Match
      </Typography>
      <Divider sx={{ margin: "2rem 0 2rem 0" }} />
      <HistoryCard data={pendingMatch} />
    </Box>
  );
}
