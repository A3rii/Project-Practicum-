import { Popover, Box, Typography, Tooltip, Badge, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import {
  NotificationsActive as NotificationsActiveIcon,
  CalendarToday as CalendarTodayIcon,
  PersonPin as PersonPinIcon,
} from "@mui/icons-material";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
const SOCKET_SERVER_URL = "http://127.0.0.1:8000";

export default function Notification() {
  const [registrationNotification, setRegistrationNotification] = useState(
    () => {
      const savedNotifications = localStorage.getItem(
        "registrationNotifications"
      );
      return savedNotifications ? JSON.parse(savedNotifications) : [];
    }
  );

  const [unreadCount, setUnreadCount] = useState(
    registrationNotification.length
  );
  useEffect(() => {
    setUnreadCount(registrationNotification.length);
  }, [registrationNotification]);

  // Handling realtime notification
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("registerNotification", (bookings) => {
      setRegistrationNotification((prevBooking) => {
        // convert as an array of objects
        const updatedRegisters = [...prevBooking, ...bookings];

        // Store in temporary storage
        localStorage.setItem(
          "registrationNotifications",
          JSON.stringify(updatedRegisters)
        );
        return updatedRegisters;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(registrationNotification);
  //* Notification popover
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotificationPop = Boolean(notificationAnchorEl);
  const notificationId = openNotificationPop
    ? "notification-popover"
    : undefined;

  //* Open and close notification
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
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
            sx={{ cursor: "pointer", color: "#636363" }}
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
            {registrationNotification.length > 0 ? (
              registrationNotification.map((data, key) => (
                <Alert
                  component={Link}
                  to="/super-admin/lessor"
                  icon={<PersonPinIcon fontSize="inherit" />}
                  key={key}
                  sx={{
                    width: "100%",
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                  severity="success">
                  New lessor registration from
                  {` ${data?.first_name}`} {data?.last_name}
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
        </Box>
      </Popover>
    </>
  );
}
