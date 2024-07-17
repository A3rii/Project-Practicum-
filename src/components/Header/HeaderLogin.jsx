import "./../../index.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import HistoryIcon from "@mui/icons-material/History";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Popover, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "./../../app/slice";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const openPop = Boolean(anchorEl);
  const id = openPop ? "simple-popover" : undefined;
  const [open, setOpen] = useState(false);
  let menuRef = useRef();

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
    console.log("logout");
  };

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
          pover
          id={id}
          open={openPop}
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
        </ul>
      </nav>

      <div className="header-auth">
        <div className="app-menu">
          <div className="app-menu-container" ref={menuRef}>
            <div
              className="app-menu-trigger"
              onClick={() => {
                setOpen(!open);
              }}>
              <img src="#" alt="User Icon" />
            </div>

            <div
              className={`app-dropdown-sidemenu ${
                open ? "active" : "inactive"
              }`}>
              <ul className="dealer-option">
                <div className="dealer-category">
                  <li className="app-dropdownItem">
                    <AccountBoxIcon />
                    <a href="!#">Profile </a>
                  </li>
                  <li className="app-dropdownItem">
                    <MoveToInboxIcon />
                    <a href="!#">Incomoing </a>
                  </li>
                  <li className="app-dropdownItem">
                    <HistoryIcon />
                    <a href="!#">History </a>
                  </li>
                </div>
              </ul>
              <button onClick={handleLogOut} className="btn btn-danger">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
