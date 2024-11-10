import { useState, useEffect } from "react";
import {
  Popover,
  Alert,
  Box,
  Typography,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material";
import { formatDate } from "./../../../utils/timeCalculation";
import {
  NotificationsActive as NotificationsActiveIcon,
  CalendarToday as CalendarTodayIcon,
  Upcoming as UpcomingIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import Loader from "./../../Loader";
import axios from "axios";
import authToken from "./../../../utils/authToken";

// from backend URL
const SOCKET_SERVER_URL = "http://127.0.0.1:8000";

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
  // Storing real time booking data in case  we refresh the page
  const [bookingNotification, setBookingNotification] = useState(() => {
    const savedNotifications = localStorage.getItem("bookingNotifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  const [unreadCount, setUnreadCount] = useState(bookingNotification.length);

  // Filter upcoming macth
  const {
    data: upComingMatch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upComingMatch"],
    queryFn: async () => {
      const bookings = await fetchBookings();
      const match = bookings.filter(
        (booking) =>
          booking.status === "approved" &&
          formatDate(booking.date) === dayjs(new Date()).format("MMMM DD, YYYY")
      );
      return match;
    },
  });

  useEffect(() => {
    setUnreadCount(bookingNotification.length);
  }, [bookingNotification]);

  // Handling realtime notification
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("bookingNotification", (bookings) => {
      setBookingNotification((prevBooking) => {
        // convert as an array of objects

        const updatedBookings = [...prevBooking, ...bookings];

        // Store in temporary storage
        localStorage.setItem(
          "bookingNotifications",
          JSON.stringify(updatedBookings)
        );
        return updatedBookings;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Remove notifications of booking
  useEffect(() => {
    const clearLocalStorage = setTimeout(() => {
      localStorage.removeItem("bookingNotifications");
    }, 720000); // 2 hours

    return () => clearTimeout(clearLocalStorage); // Cleanup the timer on component unmount
  }, []);

  //* Notification popover
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotificationPop = Boolean(notificationAnchorEl);
  const notificationId = openNotificationPop
    ? "notification-popover"
    : undefined;

  // Open and close notification
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

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
          badgeContent={unreadCount}
          color="error">
          <NotificationsActiveIcon
            onClick={handleNotificationClick}
            sx={{ cursor: "pointer" }}
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
            <Typography sx={{ fontSize: ".9rem" }}>
              Incoming Bookings
            </Typography>
            {bookingNotification?.length > 0 ? (
              bookingNotification.map((match, key) => (
                <Alert
                  icon={<CalendarTodayIcon fontSize="inherit" />}
                  key={key}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  severity="success">
                  New bookings from
                  {" " + match?.user?.name || match?.outside_user.name}
                </Alert>
              ))
            ) : (
              <Alert
                icon={<CalendarTodayIcon fontSize="inherit" />}
                variant="outlined"
                sx={{ width: "100%" }}
                severity="success">
                No Bookings
              </Alert>
            )}
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
            {upComingMatch?.length > 0 ? (
              upComingMatch.map((match, key) => (
                <Alert
                  icon={<UpcomingIcon fontSize="inherit" />}
                  key={key}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  severity="warning">
                  Incoming match from {match?.user?.name}
                </Alert>
              ))
            ) : (
              <Alert
                icon={<UpcomingIcon fontSize="inherit" />}
                variant="outlined"
                sx={{ width: "100%" }}
                severity="warning">
                No Incoming match
              </Alert>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
}
