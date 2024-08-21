import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import GreenSwitch from "../../../components/AdminComponent/Switch/GreenSwitch.jsx";
import {
  DrawerHeader,
  AppBar,
  Drawer,
} from "../../../components/AdminComponent/Sidebar/theme.jsx";
import { useDispatch } from "react-redux";
import { logout } from "./../../../app/slice.js";
import {
  SportsBaseball as SportsBaseballIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarMonthIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import Notification from "../../../components/AdminComponent/Notification/Notification.jsx";
import useCurrentLessor from "../../../utils/useCurrentLessor.jsx";
export default function AdminCenter() {
  const currentLessor = useCurrentLessor();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar style={{ backgroundColor: "#1A43BF" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}>
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: ".8rem",
                marginLeft: "auto",
                pr: 1,
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: ".8rem",
                }}>
                <Typography sx={{ fontSize: ".9rem", fontWeight: "bold" }}>
                  Open / Close
                </Typography>
                <GreenSwitch
                  timeAvailability={currentLessor?.time_availability}
                />
              </Box>

              <Notification />

              <Tooltip title={currentLessor?.sportcenter_name}>
                <IconButton sx={{ p: 0 }}>
                  <Avatar
                    sx={{ width: 32, height: 32, fontSize: ".5rem" }}
                    alt="#"
                    src={currentLessor?.logo || ""}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} elevation={20}>
          <DrawerHeader style={{ backgroundColor: "#1A43BF" }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon sx={{ color: "#fff" }} />
              ) : (
                <ChevronLeftIcon sx={{ color: "#fff" }} />
              )}
            </IconButton>
          </DrawerHeader>

          <div
            className="admin-sidebar"
            style={{
              backgroundColor: "#fff",
              height: "100vh",
              width: "50vh",
            }}>
            <List sx={{ mt: 1 }}>
              <ul>
                <div className="admin-icon">
                  <Link to="/admin/dashboard">
                    <HomeIcon sx={{ color: "#444444" }} />
                  </Link>
                  <Link to="/admin/dashboard">
                    <li>Home</li>
                  </Link>
                </div>
                <div className="admin-icon">
                  <Link to="/admin/confirm_match">
                    <PersonAddAlt1Icon sx={{ color: "#444444" }} />
                  </Link>
                  <Link to="/admin/confirm_match">
                    <li>Confirm Booking</li>
                  </Link>
                </div>
                <div className="admin-icon">
                  <Link to="/admin/schedule">
                    <CalendarMonthIcon sx={{ color: "#444444" }} />
                  </Link>

                  <Link to="/admin/schedule">
                    <li>Set Schedule</li>
                  </Link>
                </div>

                <div className="admin-icon">
                  <Link to="/admin/facility">
                    <SportsBaseballIcon sx={{ color: "#444444" }} />
                  </Link>

                  <Link to="/admin/facility">
                    <li>Facility</li>
                  </Link>
                </div>

                <div className="admin-icon">
                  <Link to="/admin/lessor-profile">
                    <AccountCircleIcon sx={{ color: "#444444" }} />
                  </Link>

                  <Link to="/admin/lessor-profile">
                    <li>Profile</li>
                  </Link>
                </div>
              </ul>
            </List>
            <Divider
              sx={{
                color: "white",
                mt: 2,
              }}
            />

            <List>
              <ul>
                <div onClick={handleLogOut} className="admin-logout">
                  <Tooltip title="Log Out">
                    <LogoutIcon sx={{ color: "#000" }} />
                  </Tooltip>
                  <li>Log Out</li>
                </div>
              </ul>
            </List>
          </div>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
