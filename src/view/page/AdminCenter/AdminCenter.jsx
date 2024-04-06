import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
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
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";
import boy from "./../../../assets/BookingImags/boy.jpg";

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
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [name, setName] = React.useState("");

  const handleChangeName = (sidebar) => {
    setName(sidebar);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
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
          <Typography variant="h6" noWrap component="div">
            {name ? name : "DashBoard"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              pr: 2,
            }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="K" src={boy} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} elevation={20}>
        <DrawerHeader style={{ backgroundColor: "#1975d1" }}>
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
          style={{ backgroundColor: "#fff", height: "100vh", width: "50vh" }}>
          <List sx={{ mt: 1 }}>
            <ul>
              <div className="admin-icon">
                <Link to="/admin/dashboard">
                  <HomeIcon
                    onClick={() => handleChangeName("Home")}
                    sx={{ color: "#000" }}
                  />
                </Link>
                <Link to="/admin//dashboard">
                  <li onClick={() => handleChangeName("Home")}>Home</li>
                </Link>
              </div>
              <div className="admin-icon">
                <Link to="/admin/confirm_match">
                  <PersonAddAlt1Icon
                    onClick={() => handleChangeName("Confirm Booking")}
                    sx={{ color: "#000" }}
                  />
                </Link>
                <Link to="/admin/confirm_match">
                  <li onClick={() => handleChangeName("Confirm Booking")}>
                    Confirm Booking
                  </li>
                </Link>
              </div>
              <div className="admin-icon">
                <Link to="/admin/schedule">
                  <CalendarMonthIcon
                    onClick={() => handleChangeName("Set Schedule")}
                    sx={{ color: "#000" }}
                  />
                </Link>

                <Link to="/admin/schedule">
                  <li onClick={() => handleChangeName("Set Schedule")}>
                    Set Schedule
                  </li>
                </Link>
              </div>

              <div className="admin-icon">
                <Link to="/admin/settime">
                  <AccessTimeIcon
                    onClick={() => handleChangeName("Set Open Hour")}
                    sx={{ color: "#000" }}
                  />
                </Link>

                <Link to="/admin/settime">
                  <li onClick={() => handleChangeName("Set Open Hour")}>
                    Set Open Hour
                  </li>
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
              <div className="admin-logout">
                <LogoutIcon sx={{ color: "#000" }} />
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
