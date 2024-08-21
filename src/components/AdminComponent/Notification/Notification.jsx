import { useState } from "react";
import {
  Popover,
  Alert,
  Box,
  Typography,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material";
import {
  NotificationsActive as NotificationsActiveIcon,
  CalendarToday as CalendarTodayIcon,
  Upcoming as UpcomingIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import Loader from "./../../Loader";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import { formatDate } from "../../../utils/timeCalculation";

const fetchBookings = async () => {
  const token = authToken();
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/books/sport-center`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.bookings;
  } catch (err) {
    console.log(err.message);
  }
};

export default function Notification() {
  //* Notification popover
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotificationPop = Boolean(notificationAnchorEl);
  const notificationId = openNotificationPop
    ? "notification-popover"
    : undefined;

  //* Open and close notification
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  //  Get today matches
  const {
    data: todayMatch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todayMatch"],
    queryFn: async () => {
      const bookings = await fetchBookings();
      const match = bookings.filter(
        (booking) => formatDate(booking.date) === formatDate(new Date())
      );
      return match;
    },
  });

  // Filter upcoming macth
  const { data: upComingMatch } = useQuery({
    queryKey: ["upComingMatch"],
    queryFn: async () => {
      const bookings = await fetchBookings();
      const match = bookings.filter((booking) => booking.status === "pending");
      return match;
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <p> {error}</p>;
  return (
    <>
      <Tooltip title="Notification">
        <Badge
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          badgeContent={todayMatch.length + upComingMatch.length}
          color="error">
          <NotificationsActiveIcon
            onClick={handleNotificationClick}
            style={{ cursor: "pointer" }}
          />
        </Badge>
      </Tooltip>
      <Popover
        id={notificationId}
        open={openNotificationPop}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        sx={{ mt: 1 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <Box
          sx={{
            width: "25rem",
            height: "35rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            borderRadius: "0 15px 15px 15px",
            alignItems: "start",
            gap: "1.3rem",
            p: 3,
          }}>
          <Typography sx={{ fontWeight: "bold" }} color="textPrimary">
            Notifications
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
              gap: ".6rem",
              width: "100%",
            }}>
            <Typography sx={{ fontSize: ".9rem" }}> Today Match</Typography>
            {todayMatch.length > 0 &&
              todayMatch.map((match, key) => (
                <Alert
                  icon={<CalendarTodayIcon fontSize="inherit" />}
                  key={key}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  severity="success">
                  Match Today at {match?.startTime} - {match?.endTime}
                </Alert>
              ))}
          </Box>

          <Divider
            sx={{
              width: "100%",
              borderColor: "gray",
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
              gap: ".6rem",
              width: "100%",
            }}>
            <Typography sx={{ fontSize: ".9rem" }}> Upcoming Match</Typography>
            {upComingMatch.length > 0 &&
              upComingMatch.map((match, key) => (
                <Alert
                  icon={<UpcomingIcon fontSize="inherit" />}
                  key={key}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  severity="warning">
                  Incoming match from {match?.user?.name}
                </Alert>
              ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
}
