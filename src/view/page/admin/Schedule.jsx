import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useState, useEffect, useCallback, useMemo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import { parseISO } from "date-fns";
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
import ObjectID from "bson-objectid";
import { notify, errorAlert } from "./../../../utils/toastAlert";

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

  const [events, setEvents] = useState([]);

  //* Requirements for booking
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [court, setCourt] = useState([]);
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState(dayjs());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());

  //* Court and Facility Selection
  const handleOnSelectCourt = (e) => {
    setSelectedCourt(e.target.value);
  };

  const handleOnSelectFacility = (e) => {
    setFacility(e.target.value);
    setSelectedCourt(""); // Reset the selected court
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  //* Get facility from lessor
  const getFacilities = useMemo(() => {
    return currentLessor?.facilities || [];
  }, [currentLessor?.facilities]);

  //* Get court from lessor
  const getCourts = useCallback(
    async (facilityId) => {
      try {
        const fetchCourts = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/lessor/facility/${facilityId}/courts`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourt(fetchCourts.data.facility.courts);
      } catch (err) {
        console.log(err.message);
      }
    },
    [token]
  );

  //* Checking each facility and get each of the courts from it
  useEffect(() => {
    if (facility) {
      // Find the selected facility ID
      const selectedFacility = getFacilities.find(
        (fac) => fac.name === facility
      );
      if (selectedFacility) {
        getCourts(selectedFacility._id); // Facility ID
      }
    }
  }, [facility, getFacilities, getCourts]);

  //* Fetching all the booking of lessor
  const fetchBooking = useCallback(async () => {
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

      // Formatation of react big calendar  {title , start , ends}
      const transformedEvents = getBooking.data.bookings.map((booking) => ({
        title: `Customer: ${
          booking?.user?.name || booking?.outside_user?.name
        } , Facility: ${booking.facility} , Court: ${booking.court}`,
        start: parseTimeString(booking.date, booking.startTime),
        end: parseTimeString(booking.date, booking.endTime),
      }));
      setEvents(transformedEvents);
    } catch (err) {
      console.log(err.message);
    }
  }, [token]);

  useEffect(() => {
    if (!currentLessor) return;
    fetchBooking();
  }, [currentLessor, fetchBooking]);

  //* Open modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle events for adding new booking for contact users
  const handleAddEvent = async (e) => {
    e.preventDefault();
    const bookingRequirement = {
      user: new ObjectID().toString(), // Random Bson Id if user contacts
      outside_user: {
        name: name,
        phone_number: phone,
      },
      lessor: currentLessor._id,
      facility: facility,
      court: selectedCourt,
      date: date.toISOString(),
      startTime: startTime.format("hh:mm a"), // format date {1:00 am/pm}
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
      console.log(booking.data.message);
      fetchBooking(); // Update data immediately
      setName("");
      setPhone("");
      setFacility("");
      setDate(dayjs());
      setSelectedCourt("");
      setStartTime(dayjs());
      setEndTime(dayjs());
      handleClose();
      notify("Booking Successfully");
    } catch (err) {
      errorAlert("Booking Failed");
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
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1.5rem",
                marginTop: ".5rem",
              }}>
              <TextField
                sx={{ flex: 1 }}
                InputProps={{
                  endAdornment: <AccountBoxIcon style={{ color: "#888" }} />,
                }}
                label="Enter Name"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <TextField
                sx={{ flex: 1 }}
                InputProps={{
                  endAdornment: <AccountBoxIcon style={{ color: "#888" }} />,
                }}
                label="Phone"
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </Box>
            <Box sx={{ marginTop: "1rem" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={handleDateChange}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Box>

            {/** Court and Facility Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Facility</InputLabel>
                <Select value={facility} onChange={handleOnSelectFacility}>
                  {getFacilities.map((facility, key) => (
                    <MenuItem key={key} value={facility.name}>
                      {facility.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Court</InputLabel>
                <Select value={selectedCourt} onChange={handleOnSelectCourt}>
                  {court.map((data, key) => (
                    <MenuItem key={key} value={data.name}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/** Time Picker */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={startTime}
                  onChange={(newTime) => setStartTime(newTime)}
                  label="Start Time"
                  sx={{ flex: 1 }}
                />
                <TimePicker
                  value={endTime}
                  onChange={(newTime) => setEndTime(newTime)}
                  label="End Time"
                  sx={{ flex: 1 }}
                />
              </LocalizationProvider>
            </Box>

            <Divider sx={{ margin: "1rem 0" }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
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
