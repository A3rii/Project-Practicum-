import * as React from "react";
import Header from "./../../../components/Header/Header";
import Footer from "./../../../components/Footer/Footer";
import SportCenter from "./../../../assets/BookingImags/pic2.jpg";
import GreenSport from "./../../../assets/BookingImags/pic3.jpg";
import LightSport from "./../../../assets/BookingImags/pic4.jpg";
import MalisSport from "./../../../assets/BookingImags/pic5.jpg";
import AkiraSport from "./../../../assets/BookingImags/pic19.jpg";
import {
  Box,
  Rating,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Popover,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function TimePickerField({ time }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker sx={{ maxWidth: "100%" }} label={time} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

// eslint-disable-next-line react/prop-types
function SelectionOption({ type, option1, option2, option3 }) {
  const [option, setOption] = React.useState("");

  const handleChange = (event) => {
    setOption(event.target.value);
  };
  return (
    <Box sx={{ minWidth: "100%" }}>
      <FormControl fullWidth>
        <InputLabel>{type}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label={type}
          onChange={handleChange}>
          <MenuItem value={10}>{option1}</MenuItem>
          <MenuItem value={20}>{option2}</MenuItem>
          <MenuItem value={30}>{option3}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

// eslint-disable-next-line react/prop-types
function SportFieldCard({ image, title, location, time }) {
  const value = 2;
  return (
    <Card sx={{ width: 320 }}>
      <CardMedia sx={{ height: 250 }} image={image} title={title} />

      <CardContent sx={{ padding: "20px" }}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "5px" }}>
          {location}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "5px" }}>
          {time}
        </Typography>

        <Box sx={{ "& > legend": { mt: 1 } }}>
          <Rating name="read-only" value={value} readOnly />
        </Box>
      </CardContent>

      <CardActions>
        <Link to="/sportcenter">
          <button type="button" className="booking-btn">
            Book Now
          </button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default function Booking() {
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
    <>
      <div className="booking-header">
        <Header />
        <div className="booking-banner">
          <h2> Welcome to Sport Center</h2>
        </div>
      </div>

      <div className="container booking-field">
        <div className="booking-topic">
          <h2>Sport Field Rental</h2>

          <div className="booking-filter">
            <i className="fa-solid fa-magnifying-glass icon-search"></i>
            <input type="text" placeholder="Search....." />
            <button className="button">Search</button>
          </div>
        </div>

        <div className="booking-filter-none">
          <TuneIcon
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
            <div className="booking-hover-filter">
              <CloseIcon
                sx={{ fontSize: "1.5rem", mt: 2, ml: 2, cursor: "pointer" }}
                onClick={handleClose}
              />
              <h4>Filter By </h4>
            </div>
            <FormControl
              sx={{
                width: "25rem",
                height: "20srem",
                display: "flex",
                justifyContent: "center",
                p: 2,
                gap: "1rem",
              }}>
              <SelectionOption
                type="Time Available"
                option1="All"
                option2="Openend"
                option3="Closed"
              />
              <SelectionOption
                type="Location"
                option1="All"
                option2="Nearest"
                option3="Closed"
              />
              <TimePickerField time="Open Till" />
              <button className="btn-filter-schedule">FIND</button>
            </FormControl>
          </Popover>
          <span className=""> Menu</span>
        </div>

        <div className="container booking-filterSport">
          <div className="booking-filter-type">
            <h4> Filter By:</h4>
            <SelectionOption
              type="Time Available"
              option1="All"
              option2="Openend"
              option3="Closed"
            />

            <SelectionOption
              type="Location"
              option1="All"
              option2="Nearest"
              option3="Closed"
            />

            <TimePickerField time="Open Till" />

            <button className="btn-filter-schedule">FIND</button>
          </div>

          <div className="booking-sportFieldCard">
            <SportFieldCard
              image={SportCenter}
              title="Phnom Penh Sport Center"
              location="Toul Kork, Phnom Penh"
              time="Time Open:  6am-12pm"
            />

            <SportFieldCard
              image={GreenSport}
              title="Green Sport Center"
              location="Sangkat Chroy Chongva, Phnom Penh"
              time="Time Open:  6am-9pm"
            />

            <SportFieldCard
              image={LightSport}
              title="Light Sport Center"
              location="Sangkat Prek Pra,Phnom Penh"
              time="Time Open:  6am-8pm"
            />

            <SportFieldCard
              image={MalisSport}
              title="Malis Sport Center"
              location="Toul Kork, Phnom Penh"
              time="Time Open:  6am-11pm"
            />

            <SportFieldCard
              image={AkiraSport}
              title="Akira Sport Center"
              location="Sangkat Stoeng Meanchey, Phnom Penh"
              time="Time Open:  6am-9pm"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
