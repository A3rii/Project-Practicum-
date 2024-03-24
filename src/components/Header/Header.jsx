import "./../../index.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Popover, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Header() {
  /*Popover*/
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  /*Popover*/
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
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{ mt: 2 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}>
          {/*Content Filter Here*/}
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
            <NavLink to="/lessor">
              <Typography color="textPrimary">
                <li>Lessor</li>
              </Typography>
            </NavLink>
            <NavLink to="/contact">
              <Typography color="textPrimary">
                <li>Contact</li>
              </Typography>
            </NavLink>
            <NavLink to="/reciept">
              <Typography color="textPrimary">
                <li>Reciept</li>
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
            <li>Renting </li>
          </NavLink>
          <NavLink to="/lessor">
            <li>Lessor</li>
          </NavLink>
          <NavLink to="/contact">
            <li>Contact</li>
          </NavLink>
          <NavLink to="/reciept">
            <li> Historys</li>
          </NavLink>
        </ul>
      </nav>

      <div className="header-auth">
        <NavLink to="/login" className="header-login">
          Login
        </NavLink>
        <NavLink to="/signup">
          <button className="header-button">Sign Up </button>
        </NavLink>
      </div>
    </header>
  );
}
