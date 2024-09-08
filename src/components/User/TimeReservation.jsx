import dayjs from "dayjs";
import axios from "axios";
import currentUser from "./../../utils/currentUser";
import authToken from "./../../utils/authToken";
import Loader from "./../../components/Loader";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { notify, errorAlert } from "./../../utils/toastAlert";
import { timeOverlapping } from "./../../utils/timeCalculation";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
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
import { useState, useMemo, useCallback } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Fetching sport center informations
const fetchSportCenter = async (sportCenterId) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    return data.lessor.facilities;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
    throw err;
  }
};
// Fetching all facility from lessor
const fetchFacility = async (sportCenterId, facilityId) => {
  const facilities = await fetchSportCenter(sportCenterId);
  return facilities.find((facility) => facility._id === facilityId)?.name;
};

// Fetching time availablility
const fetchTime = async (sportCenterId, date, facility, court) => {
  try {
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/books/lessors/${sportCenterId}/time-slots/availability`,
      {
        params: { date, facility, court },
      }
    );
    return data.bookings.filter((booking) =>
      ["approved", "pending"].includes(booking.status)
    );
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to fetch time slots");
  }
};

//* Time available section */
const TimeAvailability = ({ sportCenterId, facility, court }) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedCourt, setSelectedCourt] = useState("");

  const courts = useMemo(() => court.map((c) => c.name), [court]);
  const formattedDate = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate]
  );

  const handleDateChange = useCallback(
    (newDate) => setSelectedDate(dayjs(newDate).format("YYYY-MM-DD")),
    []
  );

  const handleOnSelectCourt = useCallback(
    (e) => setSelectedCourt(e.target.value),
    []
  );

  const convertTo12HourFormat = (time) => dayjs(time, "HH:mm").format("h:mm A");

  const { data: timeSlots, error } = useQuery({
    queryKey: [
      "timeSlots",
      sportCenterId,
      formattedDate,
      facility,
      selectedCourt,
    ],
    queryFn: () =>
      fetchTime(sportCenterId, formattedDate, facility, selectedCourt),
    refetchOnWindowFocus: true,
  });

  if (error) return <Navigate to="/error" />;

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          border: "1px solid #000",
          gap: "5rem",
          padding: "2rem",
          marginTop: "1rem",
          borderRadius: ".8rem",
          width: { xs: "100%", md: "75%" },
        }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Date Picker Section */}
          <Paper sx={{ border: "1px solid #000" }}>
            <DateCalendar
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={handleDateChange}
            />
          </Paper>
        </LocalizationProvider>

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

            {/* Court Selection */}
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

          {/* Time Slots Table */}
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              boxShadow: "none",
              marginBottom: "2rem",
              maxHeight: "20rem",
              overflowY: "scroll",
              height: "15rem",
              marginTop: "1rem",
            }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1rem" }}>Booked By</TableCell>
                  <TableCell align="center" sx={{ fontSize: "1rem" }}>
                    Facility
                  </TableCell>
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
                  timeSlots.map((time, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: "1rem" }}>
                        {time.user}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1rem" }}>
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
                          {convertTo12HourFormat(time.start)} -{" "}
                          {convertTo12HourFormat(time.end)}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "1rem" }}>
                        <Box
                          sx={{
                            display: "inline-block",
                            padding: "5px 10px",
                            fontSize: ".8rem",
                            fontWeight: "bold",
                            backgroundColor:
                              time.status === "approved" ? "green" : "orange",
                            color: "white",
                            borderRadius: "10px",
                            textAlign: "center",
                          }}>
                          {time.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={5}
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
//* Reservation section

function ReservationDate({ court }) {
  const user = currentUser();
  const navigate = useNavigate();
  const token = authToken();
  const { facilityId, sportCenterId } = useParams();
  const [date, setDate] = useState(dayjs());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const formattedDate = useMemo(() => dayjs(date).format("YYYY-MM-DD"), [date]);

  const handleDateChange = useCallback((newDate) => setDate(newDate), []);
  const handleOnSelectCourt = useCallback(
    (e) => setSelectedCourt(e.target.value),
    []
  );

  // Caching facility data using React Query
  const {
    data: facility,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facility", facilityId, sportCenterId],
    queryFn: () => fetchFacility(sportCenterId, facilityId),
    retry: false,
  });

  // Caching time slots data using React Query
  const { data: timeSlots } = useQuery({
    queryKey: [
      "timeSlots",
      sportCenterId,
      formattedDate,
      facility,
      selectedCourt,
    ],
    queryFn: () =>
      fetchTime(sportCenterId, formattedDate, facility, selectedCourt),
    refetchOnWindowFocus: true,
  });

  const handleBooking = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!sportCenterId || !formattedDate || !facility || !selectedCourt) {
      errorAlert("Please select all the required fields.");
      return;
    }

    if (dayjs(date).isBefore(dayjs(), "day")) {
      errorAlert("Booking is only allowed for today onward.");
      resetFields();
      return;
    }

    if (
      timeSlots?.some(
        (slot) =>
          (slot.court === selectedCourt &&
            timeOverlapping(startTime, endTime, slot.start, slot.end)) ||
          (slot.status === "approved" && slot.status === "pending")
      )
    ) {
      errorAlert("The selected time slot is already booked.");
      resetFields();
      return;
    }

    const bookingRequirement = {
      user: user._id,
      lessor: sportCenterId,
      facility: facility,
      court: selectedCourt,
      date: formattedDate,
      startTime: startTime.format("hh:mm a"),
      endTime: endTime.format("hh:mm a"),
    };

    try {
      const response = await axios.post(
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
      resetFields();
      console.log(response.data.message);
    } catch (err) {
      errorAlert("There is a problem with the system.");
      console.error(err.message);
    }
  }, [
    user,
    sportCenterId,
    formattedDate,
    facility,
    selectedCourt,
    date,
    startTime,
    endTime,
    timeSlots,
    navigate,
    token,
  ]);

  const resetFields = () => {
    setSelectedCourt("");
    setStartTime(null);
    setEndTime(null);
  };

  const courts = useMemo(() => court.map((c) => c.name), [court]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading facility information</div>;

  return (
    <div className="date-time">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Calendar for Date Selection */}
        <div className="sport-calendar">
          <DateCalendar
            sx={{ width: "100%" }}
            date={date}
            onChange={handleDateChange}
          />
        </div>

        {/* Date Picker */}
        <div className="sport-date">
          <DatePicker
            label="Select Date"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </LocalizationProvider>

      {/* Display Selected Date */}
      <div className="selected-date">
        <TextField
          sx={{ marginBottom: "15px", width: "100%" }}
          value={date.format("MMMM DD, YYYY")}
          readOnly
        />
      </div>

      {/* Time Pickers for Start and End Times */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="sport-time">
          <TimePicker label="From" value={startTime} onChange={setStartTime} />
          <TimePicker label="Till" value={endTime} onChange={setEndTime} />
        </div>
      </LocalizationProvider>

      {/* Court Selection */}
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

      {/* Booking Button */}
      <button onClick={handleBooking} className="sportField-reserver">
        Reserve
      </button>
    </div>
  );
}
export { ReservationDate, TimeAvailability };
