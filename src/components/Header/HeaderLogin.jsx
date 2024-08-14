import "./../../index.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import HistoryIcon from "@mui/icons-material/History";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import currentUser from "./../../utils/currentUser";
import authToken from "./../../utils/authToken";
import axios from "axios";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { formatDate } from "./../../utils/timeCalculation";
import {
  Popover,
  Box,
  Typography,
  Button,
  Avatar,
  Badge,
  Alert,
  Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "./../../app/slice";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const fetchUserBookings = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const bookings = response.data.booking;
    const todayMatch = bookings.filter(
      (booking) =>
        formatDate(booking.date) === dayjs(new Date()).format("MMMM DD, YYYY")
    );
    console.log(todayMatch);
    return todayMatch;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw err;
  }
};

const fetchIncomingBookings = async (token) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const bookings = response.data.booking;
    const pendingMatch = bookings.filter(
      (booking) => booking.status === "pending"
    );
    return pendingMatch.length;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw err;
  }
};

export default function Header() {
  const user = currentUser();
  const token = authToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Menu popover when screen is small
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const openPop = Boolean(anchorEl);
  const id = openPop ? "simple-popover" : undefined;

  //* Notification popover
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotificationPop = Boolean(notificationAnchorEl);
  const notificationId = openNotificationPop
    ? "notification-popover"
    : undefined;

  let menuRef = useRef();

  //* Open and close menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //* Open and close notification
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  //* Hover Profile
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target) && open) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  //* Log out from the account
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const { data: todayMatch = [], isError } = useQuery({
    queryKey: ["todayMatch", token],
    queryFn: () => fetchUserBookings(token),
  });
  const { data: pendingMatch = [] } = useQuery({
    queryKey: ["pendingMatch ", token],
    queryFn: () => fetchIncomingBookings(token),
  });

  console.log(pendingMatch);
  if (isError) return <p> Error Fetching Data </p>;

  return (
    <header className="header-container">
      <span className="header-title">Sport Rental</span>
      <div className="header-navbar-hover">
        <MenuIcon
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          style={{
            fontSize: "2rem",
            cursor: "pointer",
          }}
        />

        <Popover
          id={id}
          open={openPop}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{ mt: 2 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}>
          <CloseIcon
            sx={{ fontSize: "1.5rem", mt: 2, ml: 2, cursor: "pointer" }}
            onClick={handleClose}
          />
          <Box
            sx={{
              width: "24rem",
              height: "15rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "1.3rem",
              pt: 1,
            }}>
            <NavLink to="/">
              <Typography color="textPrimary">
                <li>Home</li>
              </Typography>
            </NavLink>
            <NavLink to="/booking">
              <Typography color="textPrimary">
                <li>Renting</li>
              </Typography>
            </NavLink>
            <NavLink to="/signup-admin">
              <Typography color="textPrimary">
                <li>Lessor</li>
              </Typography>
            </NavLink>
            <NavLink to="/contact">
              <Typography color="textPrimary">
                <li>Contact</li>
              </Typography>
            </NavLink>
          </Box>
        </Popover>
      </div>

      <nav className="header-navbar">
        <ul>
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/booking">
            <li>Renting</li>
          </NavLink>
          <NavLink to="/signup-admin">
            <li>Lessor</li>
          </NavLink>
          <NavLink to="/contact">
            <li>Contact</li>
          </NavLink>
        </ul>
      </nav>

      <div className="header-auth">
        <Tooltip title="Notification">
          <Badge
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            badgeContent={todayMatch.length > 0 ? todayMatch.length : null}
            color="error">
            <NotificationsIcon
              aria-describedby={notificationId}
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
          sx={{ mt: 2 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}>
          <Box
            sx={{
              width: "25rem",
              height: "30rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              borderRadius: "0 15px 15px 15px",
              alignItems: "start",
              gap: "1rem",
              p: 3,
            }}>
            <Typography sx={{ fontWeight: "bold" }} color="textPrimary">
              Notifications
            </Typography>

            {todayMatch.length > 0 ? (
              todayMatch.map((match, key) => (
                <Alert
                  icon={<CalendarTodayIcon fontSize="inherit" />}
                  key={key}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  severity="success">
                  Match today at {match.startTime} - {match.endTime}
                </Alert>
              ))
            ) : (
              <Typography
                sx={{ fontWeight: "lighter", mt: 2, width: "100%" }}
                color="textPrimary">
                <Alert variant="outlined" severity="info">
                  No notification
                </Alert>
              </Typography>
            )}
          </Box>
        </Popover>
        <div className="app-menu">
          <div className="app-menu-container" ref={menuRef}>
            <div
              className="app-menu-trigger"
              onClick={() => {
                setOpen(!open);
              }}>
              <Avatar
                alt="Remy Sharp"
                src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
              />
              <span>{user.name}</span>
            </div>

            <div
              className={`app-dropdown-sidemenu ${
                open ? "active" : "inactive"
              }`}>
              <ul className="dealer-option">
                <div className="dealer-category">
                  <Link className="app-dropdownItem" to="/">
                    <AccountBoxIcon />
                    <li> Profile</li>
                  </Link>
                  <Link className="app-dropdownItem" to="/incoming-match">
                    <Badge
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      badgeContent={pendingMatch ? pendingMatch : null}
                      color="error">
                      <MoveToInboxIcon />
                    </Badge>
                    <li> Incoming </li>
                  </Link>
                  <Link className="app-dropdownItem" to="/match-history">
                    <HistoryIcon />
                    <li>History </li>
                  </Link>
                </div>
              </ul>
              <Button onClick={handleLogOut} variant="contained" color="error">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
