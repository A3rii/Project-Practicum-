import "./../../index.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Header() {
  /* Modal state */
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <header className="header-container">
      <span className="header-title">Sport Rental</span>
      <div className="header-navbar-hover">
        <MenuIcon
          onClick={handleOpen}
          style={{
            fontSize: "2rem",
            cursor: "pointer",
          }}
        />

        {/* Modal for Menu */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              backdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "2rem",
              gap: "2rem",
            }}>
            {/* Close Icon */}
            <CloseIcon
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                fontSize: "2rem",
                color: "white",
                cursor: "pointer",
              }}
              onClick={handleClose}
            />

            {/* Menu Items */}
            <NavLink to="/" onClick={handleClose}>
              <Typography
                sx={{ mb: 1, fontWeight: "bold", fontSize: "1.2rem" }}
                color="white">
                Home
              </Typography>
            </NavLink>
            <NavLink to="/booking" onClick={handleClose}>
              <Typography
                sx={{ mb: 1, fontWeight: "bold", fontSize: "1.2rem" }}
                color="white">
                Renting
              </Typography>
            </NavLink>
            <NavLink to="/lessor" onClick={handleClose}>
              <Typography
                sx={{ mb: 1, fontWeight: "bold", fontSize: "1.2rem" }}
                color="white">
                Become Lessor
              </Typography>
            </NavLink>
            <NavLink to="/contact" onClick={handleClose}>
              <Typography
                sx={{ mb: 1, fontWeight: "bold", fontSize: "1.2rem" }}
                color="white">
                Contact
              </Typography>
            </NavLink>
          </Box>
        </Modal>
      </div>

      <nav className="header-navbar">
        <ul>
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/booking">
            <li>Renting </li>
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
        <NavLink to="/login" className="header-login">
          Login
        </NavLink>
        <NavLink to="/signup">
          <button className="header-button">Sign Up</button>
        </NavLink>
      </div>
    </header>
  );
}
