import { Link, Outlet, useNavigate } from "react-router-dom";
import React from "react";
import {
  Box,
  List,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../../../app/slice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import BarChartIcon from "@mui/icons-material/BarChart";
import useModeratorProfile from "../../../utils/useModeratorProfile";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";

export default function SuperAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moderator = useModeratorProfile();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/signin-moderator");
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{ color: "#dedede" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit">
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // Menu lists hover
  const menuItemStyles = {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          height: "100%",
          width: isSmallScreen ? "6rem" : "15rem",
          position: "fixed",
          top: 0,
          left: 0,
          background: "#123456",
          padding: "1rem",
          border: "1px ",
          boxShadow: "2px 0 5px rgba(0,0,0,0.09)",
          display: "block",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            padding: "1rem",
            gap: ".7rem",
          }}>
          <Avatar
            alt="NK"
            src={moderator?.avatar}
            sx={{
              width: isSmallScreen ? 40 : 56,
              height: isSmallScreen ? 40 : 56,
              display: isSmallScreen && "block",
            }}
          />
          <Box
            sx={{
              display: isSmallScreen ? "none" : "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
            }}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: "bold",
              }}>
              {moderator?.name}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: ".8rem",
              }}>
              {moderator?.role}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ background: "#fff", marginTop: ".6rem" }} />
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            marginTop: "1rem",
          }}>
          <MenuItem
            component={Link}
            to="/super-admin/dashboard"
            sx={menuItemStyles}>
            <BarChartIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />
            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Dashboard
              </Typography>
            )}
          </MenuItem>

          <MenuItem
            component={Link}
            to="/super-admin/lessor/informations"
            sx={menuItemStyles}>
            <PersonOutlineIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />
            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Official Lessor
              </Typography>
            )}
          </MenuItem>

          <MenuItem
            component={Link}
            to="/super-admin/lessor"
            sx={menuItemStyles}>
            <CalendarMonthIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />

            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Confirm Lessor
              </Typography>
            )}
          </MenuItem>

          <MenuItem
            component={Link}
            to="/super-admin/comment"
            sx={menuItemStyles}>
            <CommentIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />
            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Comments
              </Typography>
            )}
          </MenuItem>

          <MenuItem onClick={handleLogOut} sx={menuItemStyles}>
            <LogoutIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />
            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Log out
              </Typography>
            )}
          </MenuItem>
        </List>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, ml: isSmallScreen ? "6rem" : "15rem" }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            sx={{
              boxShadow: "0 0 0 0.1",
              backgroundColor: "#fff",
            }}
            position="relative">
            <Toolbar>
              <Typography
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}>
                Dashboard
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: ".7rem",
                }}>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit">
                  <Badge badgeContent={0} color="error">
                    <MailIcon sx={{ color: "#636363" }} />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit">
                  <Badge badgeContent={1} color="error">
                    <NotificationsIcon sx={{ color: "#636363" }} />
                  </Badge>
                </IconButton>
                <Avatar
                  alt="NK"
                  src="https://images2.alphacoders.com/122/1221814.jpg"
                  sx={{ width: 30, height: 30 }}
                />
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit">
                  <MoreIcon sx={{ color: "#000" }} />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {renderMobileMenu}
          {renderMenu}
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3, height: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
