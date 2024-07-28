// MatchHistory.js
import React from "react";
import axios from "axios";
import Loader from "./../components/Loader";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "./../utils/timeCalculation";
import { Paper, Box, Typography, Tooltip } from "@mui/material";

const fetchBookings = async (token, filter) => {
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

    const pendingMatch = incoming.filter(
      (booking) => booking.status === filter
    );
    console.log(pendingMatch);
    return pendingMatch;
  } catch (err) {
    throw err.message;
  }
};

const MatchHistory = ({ token, filter }) => {
  const {
    data: incomingMatch = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incomingMatch", token, filter],
    queryFn: () => fetchBookings(token, filter),
    refetchOnWindowFocus: true,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#00FF00";
      case "pending":
        return "#ffa500";
      case "rejected":
        return "#FF0000";
      default:
        return "grey";
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error Fetching</p>;

  return (
    <Paper
      sx={{
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
      }}
      elevation={5}>
      {incomingMatch.length > 0 &&
        incomingMatch.map((match, key) => (
          <React.Fragment key={key}>
            <Box
              sx={{
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}>
              <Tooltip title={match?.lessor?.sportcenter_name}>
                <img
                  style={{
                    borderRadius: "8px",
                  }}
                  src={match?.lessor?.logo}
                  alt="#"
                  width={120}
                  height={120}
                />
              </Tooltip>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  flexDirection: "column",
                }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  {match?.lessor?.sportcenter_name}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                  Date: {formatDate(match?.date)}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                  Sport: {match?.facility}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                  Court: {match?.court}
                </Typography>
                <Typography sx={{ fontSize: ".9rem" }}>
                  Time: {match?.startTime} - {match?.endTime}
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                display: "inline-block",
                marginTop: "1.2rem",
                padding: "5px 10px",
                fontSize: ".8rem",
                fontWeight: "bold",
                backgroundColor: getStatusColor(match?.status),
                color: "white",
                borderRadius: "10px",
                textAlign: "center",
              }}>
              {match?.status}
            </Typography>
          </React.Fragment>
        ))}
    </Paper>
  );
};

export default MatchHistory;
