import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { ToastContainer } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  timeOverlapping,
  parseTimeString,
} from "./../../../utils/timeCalculation";
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
// Fetching time availability
const fetchTime = async (sportCenterId, date, facility, court) => {
  const { data } = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/books/lessors/${sportCenterId}/time-slots/availability`,
    { params: { date, facility, court } }
  );
  return data.bookings.filter(({ status }) =>
    ["approved", "pending"].includes(status)
  );
};

// Fetching court details
const fetchCourt = async (facilityId) => {
  const token = authToken();
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/lessor/facility/${facilityId}/courts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.facility.courts;
};

export default function Schedule() {
  const queryClient = useQueryClient();
  const token = authToken();
  const currentLessor = useCurrentLessor();

  // States for booking requirements
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState(dayjs());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [open, setOpen] = useState(false);

  // Memoized facilities list
  const getFacilities = useMemo(
    () => currentLessor?.facilities || [],
    [currentLessor]
  );

  // Fetching court details
  const { data: court = [] } = useQuery({
    queryKey: ["court", facility],
    queryFn: () => {
      const selectedFacility = getFacilities.find(
        (fac) => fac.name === facility
      );
      return selectedFacility ? fetchCourt(selectedFacility._id) : [];
    },
    enabled: !!facility,
  });

  // Fetching available time slots
  const { data: timeSlots = [] } = useQuery({
    queryKey: ["timeSlots", currentLessor?._id, date, facility, selectedCourt],
    queryFn: () => fetchTime(currentLessor?._id, date, facility, selectedCourt),
    enabled: !!(currentLessor && date && facility && selectedCourt),
  });

  // Fetching bookings
  const fetchBooking = useCallback(async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/books/sport-center`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const transformedEvents = data.bookings.map((booking) => ({
      title: `Customer: ${
        booking?.user?.name || booking?.outside_user?.name
      }, Facility: ${booking.facility}, Court: ${booking.court}`,
      start: parseTimeString(booking.date, booking.startTime),
      end: parseTimeString(booking.date, booking.endTime),
    }));
    setEvents(transformedEvents);
  }, [token]);

  // Fetch bookings when currentLessor changes
  useEffect(() => {
    if (currentLessor) {
      fetchBooking();
    }
  }, [currentLessor, fetchBooking]);

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: (bookingRequirement) =>
      axios.post(
        `${import.meta.env.VITE_API_URL}/books/sport-center`,
        bookingRequirement,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("timeSlots");
      resetBookingForm();
      notify("Booking Successfully");
    },
    onError: () => {
      errorAlert("Booking Failed");
    },
  });

  // Reset booking form
  const resetBookingForm = () => {
    setName("");
    setPhone("");
    setFacility("");
    setDate(dayjs());
    setSelectedCourt("");
    setStartTime(dayjs());
    setEndTime(dayjs());
    setOpen(false);
  };

  // Handle add booking event
  const handleAddEvent = (e) => {
    e.preventDefault();

    const start = startTime.format("HH:mm");
    const end = endTime.format("HH:mm");

    // Check for overlapping bookings
    const isTimeSlotBooked = timeSlots?.some(
      (slot) =>
        (slot.court === selectedCourt &&
          timeOverlapping(start, end, slot.start, slot.end)) ||
        ["approved", "pending"].includes(slot.status)
    );

    if (isTimeSlotBooked) {
      errorAlert("Time slots has already booked");
      resetBookingForm();
      return;
    }
    if (dayjs(date).isBefore(dayjs(), "day")) {
      errorAlert("The date is not available");
      resetBookingForm();
      return;
    }

    const bookingRequirement = {
      user: new ObjectID().toString(),
      outside_user: { name, phone_number: phone },
      lessor: currentLessor._id,
      facility,
      court: selectedCourt,
      date: date.toISOString(),
      startTime: startTime.format("hh:mm a"),
      endTime: endTime.format("hh:mm a"),
    };

    bookingMutation.mutate(bookingRequirement);
  };

  return (
    <div className="calendar">
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <div>
        <Button
          startIcon={<AddIcon />}
          sx={{ marginLeft: "3rem" }}
          variant="contained"
          onClick={() => setOpen(true)}>
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

            {/* Date Picker */}
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
                  onChange={setDate}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Box>

            {/* Court and Facility Picker */}
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
                <Select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}>
                  {getFacilities.map((fac, key) => (
                    <MenuItem key={key} value={fac.name}>
                      {fac.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Court</InputLabel>
                <Select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}>
                  {court.map((data, key) => (
                    <MenuItem key={key} value={data.name}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Time Picker */}
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
                  onChange={setStartTime}
                  label="Start Time"
                  sx={{ flex: 1 }}
                />
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
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
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(false)}>
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
