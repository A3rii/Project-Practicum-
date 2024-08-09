import * as React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Paper,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { logout } from "./../../../app/slice.js";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useCurrentLessor from "../../../utils/useCurrentLessor.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const drawerWidth = 250;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("xs")]: {
    width: `calc(${theme.spacing(8)} + 16px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AdminCenter() {
  const currentLessor = useCurrentLessor();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
    console.log("logout");
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: "auto",
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
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: 400,
              }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
              />
              <IconButton type="button" sx={{ p: "6px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>

            <Tooltip title="Notification">
              <NotificationsActiveIcon sx={{ fontSize: "1.4rem" }} />
            </Tooltip>
            <Tooltip title={currentLessor?.sportcenter_name}>
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  sx={{ width: 32, height: 32, fontSize: ".5rem" }}
                  alt="#"
                  src={currentLessor?.logo || ""}
                />
              </IconButton>
            </Tooltip>
            <Typography sx={{ fontSize: ".8rem" }} noWrap component="div">
              {currentLessor?.email}
            </Typography>
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
  );
}
