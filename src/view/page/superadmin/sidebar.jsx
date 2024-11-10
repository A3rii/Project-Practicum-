import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  Collapse,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Notification from "../../../components/Superadmin/Notification";
import { useDispatch } from "react-redux";
import { logout } from "../../../app/slice";
import ListItemIcon from "@mui/material/ListItemIcon";
import InfoIcon from "@mui/icons-material/Info";
import {
  CalendarMonth as CalendarMonthIcon,
  AccountCircle as AccountCircle,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Comment as CommentIcon,
  BarChart as BarChartIcon,
  PersonOutline as PersonOutlineIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Map as MapIcon,
  Key as KeyIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import useModeratorProfile from "../../../utils/useModeratorProfile";

export default function SuperAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const moderator = useModeratorProfile();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const handleToggle = () => {
    setOpen(!open);
  };

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
            onClick={handleToggle}
            sx={{ display: "flex", alignItems: "center", color: "#fff" }}>
            <PersonOutlineIcon
              sx={{ marginRight: isSmallScreen ? 0 : "10px" }}
            />
            <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
              Official Lessor
            </Typography>
            {open ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuItem>

          {/* Nested Sub-menu Items */}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/super-admin/lessor/informations"
                sx={{
                  pl: 4,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#fff",
                    textDecoration: "none",
                  },
                }}>
                <ListItemIcon sx={{ color: "#fff", minWidth: "auto", mr: 1 }}>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Lessor Info"
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: ".8rem",
                    textDecoration: "none",
                  }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/super-admin/lessor/credentials"
                sx={{
                  pl: 4,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#fff",
                    textDecoration: "none",
                  },
                }}>
                <ListItemIcon sx={{ color: "#fff", minWidth: "auto", mr: 1 }}>
                  <KeyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Credentials"
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: ".8rem",
                    textDecoration: "none",
                  }}
                />
              </ListItemButton>
            </List>
          </Collapse>

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

          <MenuItem component={Link} to="/super-admin/map" sx={menuItemStyles}>
            <MapIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />

            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Centers Location
              </Typography>
            )}
          </MenuItem>

          <MenuItem
            component={Link}
            to="/super-admin/profile"
            sx={menuItemStyles}>
            <AccountCircleIcon
              sx={{ color: "#fff", marginRight: isSmallScreen ? 0 : "10px" }}
            />
            {!isSmallScreen && (
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: ".9rem" }}>
                Profile
              </Typography>
            )}
          </MenuItem>

          <Divider sx={{ background: "#fff" }} />
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
                  aria-label="show 17 new notifications"
                  color="inherit">
                  <Notification />
                </IconButton>
                <Avatar
                  alt="NK"
                  src={moderator?.avatar}
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
