import "react-toastify/dist/ReactToastify.css";
import ContactInfo from "../../../components/ContactInfo";
import CardSwiper from "../../../components/CardSwiper";
import dayjs from "dayjs";
import axios from "axios";
import currentUser from "../../../utils/currentUser";
import authToken from "../../../utils/authToken";
import Loader from "./../../../components/Loader";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { notify, errorAlert } from "../../../utils/toastAlert";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Divider,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  OutlinedInput,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const fetchTime = async (sportCenterId, date, facility, court) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/books/lessors/${sportCenterId}/time-slots/availability`,
      {
        params: { date, facility, court },
      }
    );

    return response.data.bookings;
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to fetch time slots");
  }
};

const TimeAvailability = ({ sportCenterId, facility, court }) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedCourt, setSelectedCourt] = useState("");
  const handleOnSelectCourt = (e) => {
    setSelectedCourt(e.target.value);
  };

  const courts = court.map((c) => c.name);

  const convertTo12HourFormat = (time) => {
    // Parse the 24-hour time string
    const parsedTime = dayjs(time, "HH:mm");
    // Format the parsed time to 12-hour format with AM/PM
    return parsedTime.format("h:mm A");
  };

  const { data: timeSlots, error } = useQuery({
    queryKey: [
      "timeSlots",
      sportCenterId,
      selectedDate,
      facility,
      selectedCourt,
    ],
    queryFn: () =>
      fetchTime(sportCenterId, selectedDate, facility, selectedCourt),
    refetchOnWindowFocus: true,
  });

  const handleDateChange = (newDate) => {
    setSelectedDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  if (error) return <Navigate to="/error" />;

  return (
    <>
      {/* Date Picker Section */}
      <Paper
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          border: "1px solid #000",
          gap: "5rem",
          padding: "2rem",
          width: { xs: "100%", md: "75%" },
        }}>
        <Paper
          sx={{
            border: "1px solid #000",
          }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Paper>

        {/* Schedule Display Section */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}>
          {/* Selected Date Display */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Typography
              sx={{ textAlign: "center", fontWeight: "bold" }}
              gutterBottom>
              {dayjs(selectedDate).format("dddd, D MMM YYYY")}
            </Typography>

            <FormControl sx={{ width: "50%" }}>
              <InputLabel>Court</InputLabel>

              <Select
                value={selectedCourt}
                onChange={handleOnSelectCourt}
                input={<OutlinedInput label="Court" />}>
                <MenuItem value="">Select All</MenuItem>
                {courts.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Divider
            sx={{ background: "#aaaaaa", width: "100%", height: "0.6px" }}
          />
          {/* Time Slots Table */}
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              boxShadow: "none",
              marginBottom: "2rem",
            }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1rem" }}>Facility</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1rem" }}>
                    Court
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1rem" }}>
                    Time
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "1rem" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots?.length > 0 ? (
                  timeSlots?.map((time, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {time.facility}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1rem" }}>
                        {time.court}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "inline-block",
                            padding: "5px 10px",
                            fontSize: ".8rem",
                            fontWeight: "bold",
                            backgroundColor: "orange",
                            color: "white",
                            borderRadius: "10px",
                            textAlign: "center",
                          }}>
                          {convertTo12HourFormat(time.start)} -
                          {" " + convertTo12HourFormat(time.end)}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1rem" }}>
                        <Box
                          sx={{
                            display: "inline-block",
                            padding: "5px 10px",
                            fontSize: ".8rem",
                            fontWeight: "bold",
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: "10px",
                            textAlign: "center",
                          }}>
                          Booked
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={4}
                      sx={{ fontSize: "1rem" }}>
                      All times are available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
};

const fetchFacility = async (sportCenterId, facilityId) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    const sportCenter = response.data.lessor;

    const facilityInformation = sportCenter.facilities.find(
      (facility) => facility._id === facilityId
    );

    if (facilityInformation) {
      return facilityInformation.name;
    } else {
      console.log("Facility not found");
      throw new Error("Facility not found");
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

function ReservationDate({ court }) {
  const user = currentUser();
  const token = authToken();
  const { facilityId, sportCenterId } = useParams();

  // Booking requirement
  const [date, setDate] = useState(dayjs());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Court Selection
  const handleOnSelectCourt = (e) => {
    setSelectedCourt(e.target.value);
  };

  // Date Selection
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Court mapping
  const courts = court.map((c) => c.name);

  const {
    data: facility,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facility", facilityId, sportCenterId],
    queryFn: () => fetchFacility(sportCenterId, facilityId),
    retry: false,
  });

  // Reservation for user
  const handleBooking = async () => {
    const bookingRequirement = {
      user: user._id,
      lessor: sportCenterId,
      facility: facility,
      court: selectedCourt,
      date: date.toISOString(),
      startTime: startTime.format("hh:mm a"), // Format date: 1:00 am, 12:00 am
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
      notify("You have successfully booked");
      setSelectedCourt("");
      setStartTime("");
      setEndTime("");
      console.log(booking.data.message);
    } catch (err) {
      errorAlert("There is a problem with the system.");
      console.log(err.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading facility information</div>;
  return (
    <div className="date-time">
      <div className="sport-calendar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            sx={{ width: "100%" }}
            date={date}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </div>

      <div className="sport-date">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={date}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </div>
      <div className="selected-date">
        <TextField
          sx={{ marginBottom: "15px", width: "100%" }}
          value={date.format("MMMM DD, YYYY")}
          onChange={(e) => setDate(dayjs(e.target.value))}
          readOnly
        />
      </div>

      <div className="sport-time">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="From"
            value={startTime}
            onChange={(newTime) => setStartTime(newTime)}
          />
          <TimePicker
            label="Till"
            value={endTime}
            onChange={(newTime) => setEndTime(newTime)}
          />
        </LocalizationProvider>
      </div>
      <div className="court-type">
        <FormControl sx={{ width: "100%" }}>
          <InputLabel>Court</InputLabel>
          <Select
            value={selectedCourt}
            onChange={handleOnSelectCourt}
            input={<OutlinedInput label="Court" />}>
            {courts.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <button
        onClick={handleBooking}
        type="button"
        className="sportField-reserver">
        Reserve
      </button>
    </div>
  );
}

const fetchSportCenter = async (sportCenterId) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    const lessor = response.data.lessor;
    return lessor.facilities;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
  }
};

export default function SportField() {
  const { facilityId, sportCenterId } = useParams();

  const {
    data: facility = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facility", sportCenterId],
    queryFn: () => fetchSportCenter(sportCenterId),
    refetchOnWindowFocus: true,
  });

  console.log(facility);
  if (isLoading) return <Loader />;
  if (error) return <Navigate to="/error" />;

  const facilityInformation = facility?.find(
    (facility) => facility._id === facilityId
  );

  if (!facilityInformation) {
    return <p>Facility not found.</p>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="sportField-header">
        <div className="sportField-banner">
          <h2> {facilityInformation.name} </h2>
          <span>{facilityInformation.description}</span>
        </div>

        {/** Date and Time */}
        <div className="sport-reserve">
          <ReservationDate court={facilityInformation.court} />
        </div>
      </div>

      <div className="sport-schedule">
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}>
          Booked Schedule
        </Typography>
        <TimeAvailability
          sportCenterId={sportCenterId}
          facility={facilityInformation.name}
          court={facilityInformation.court}
        />
      </div>

      <div className="sportField-Slider">
        <Typography
          variant="h2"
          sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Our Football View
        </Typography>
        <Box sx={{ display: "flex" }}>
          <CardSwiper court={facilityInformation.court} />
        </Box>
      </div>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
