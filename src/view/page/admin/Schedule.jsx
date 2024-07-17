import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useState, useEffect } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import useCurrentLessor from "../../../utils/useCurrentLessor";
import {
  Button,
  TextField,
  Modal,
  Divider,
  Box,
  Typography,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddIcon from "@mui/icons-material/Add";
import { parseISO } from "date-fns";

//* React Big Calendar Formatation
const locales = {
  "en-US": import("date-fns/locale/en-US"),
};

async function getLocale() {
  const locale = await locales["en-US"];
  return locale.default;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: getLocale(),
});

//* Function to parse time strings to Date objects
const parseTimeString = (dateString, timeString) => {
  const date = parseISO(dateString);
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "pm" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "am" && hours === "12") {
    hours = 0;
  }
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default function Schedule() {
  const token = authToken();

  const currentLessor = useCurrentLessor();
  console.log(currentLessor);

  // Get Facility
  const facilitiesData = currentLessor?.facilities;
  const [events, setEvents] = useState([]);

  // Requirements for booking
  const [name, setName] = useState("");
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState(dayjs());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Court Selection
  const handleOnSelectCourt = (e) => {
    setSelectedCourt(e.target.value);
  };

  const handleOnSelectFacility = (e) => {
    setFacility(e.target.value);
  };
  // Date Selection
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const getFacilities = currentLessor?.facilities.map(
    (facility) => facility.name
  );
  const getCourts = facilitiesData?.flatMap((facility) =>
    facility.court.map((court) => court.name)
  );

  //* Fetching all the booking of lessor
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const getBooking = await axios.get(
          `${import.meta.env.VITE_API_URL}/books/sport-center`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const transformedEvents = getBooking.data.bookings.map((booking) => ({
          title: `Customer: ${booking.user.name} , Facility: ${booking.facility} , Court: ${booking.court}`,
          start: parseTimeString(booking.date, booking.startTime),
          end: parseTimeString(booking.date, booking.endTime),
        }));
        setEvents(transformedEvents);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchBooking();
  }, [token]);

  // TODO: handle adding event
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //TODO : Add API
  const handleAddEvent = async () => {
    const bookingRequirement = {
      user_name: name,
      lessor: currentLessor._id,
      facility: facility,
      court: selectedCourt,
      date: date.toISOString(),
      startTime: startTime.format("hh:mm a"),
      endTime: endTime.format("hh:mm a"),
    };
    try {
      const booking = await axios.post(
        `${import.meta.env.VITE_API_URL}/books/sport-center`,
        bookingRequirement,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(booking.data);
      handleClose();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="calendar">
      <div>
        <Button
          startIcon={<AddIcon />}
          sx={{ marginLeft: "3rem" }}
          variant="contained"
          onClick={handleOpen}>
          Add Events
        </Button>
        <Modal
          keepMounted
          open={open}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "5px",
            }}>
            <Typography
              gutterBottom
              sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Create An Event
            </Typography>
            <Divider />

            {/** Date Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.5rem",
                marginTop: ".5rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <TextField
                    sx={{ width: 260 }}
                    InputProps={{
                      endAdornment: (
                        <AccountBoxIcon style={{ color: "#888" }} />
                      ),
                    }}
                    label="Enter Name"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={handleDateChange}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            {/** Court and Facility Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Facility</InputLabel>
                  <Select value={facility} onChange={handleOnSelectFacility}>
                    {getFacilities.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Court</InputLabel>
                  <Select value={selectedCourt} onChange={handleOnSelectCourt}>
                    {getCourts.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </LocalizationProvider>
            </Box>

            {/** Time Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: ".5rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker", "TimePicker"]}>
                  <TimePicker
                    value={startTime}
                    onChange={(newTime) => setStartTime(newTime)}
                    label="Start Time"
                  />
                  <TimePicker
                    value={endTime}
                    onChange={(newTime) => setEndTime(newTime)}
                    label="End Time"
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>

            <Divider sx={{ margin: "1rem 0" }} />
            <Box
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem",
              }}>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleAddEvent}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
      <Calendar
        defaultView={Views.DAY}
        events={events}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
      />
    </div>
  );
}
