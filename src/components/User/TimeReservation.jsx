import dayjs from "dayjs";
import axios from "axios";
import currentUser from "./../../utils/currentUser";
import authToken from "./../../utils/authToken";
import Loader from "./../../components/Loader";
import { Navigate, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { notify, errorAlert } from "./../../utils/toastAlert";
import {
  timeOverlapping,
  parseTimeString,
} from "./../../utils/timeCalculation";
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
  Popover,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import StarIcon from "@mui/icons-material/Star";
import userBooking from "../../utils/userBooking";

const fetchUserBookings = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/booking`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken()}`,
        },
      }
    );

    return data.booking;
  } catch (err) {
    throw new Error(err);
  }
};

//* Fetching sport center informations
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

//* Fetching all facility from lessor
const fetchFacility = async (sportCenterId, facilityId) => {
  const facilities = await fetchSportCenter(sportCenterId);
  return facilities.find((facility) => facility._id === facilityId)?.name;
};

//* Fetching time availablility
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
      ["approved"].includes(booking.status)
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
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "start",
          alignItems: "start",
          border: "1px solid #000",
          gap: { xs: "2rem", md: "5rem" },
          padding: "2rem",
          marginTop: "1rem",
          mb: 4,
          borderRadius: ".8rem",
          width: { xs: "75%", md: "75%" },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}>
        {/* Date Picker Section */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper
            sx={{
              border: "1px solid #000",
              width: "100%",
              maxWidth: { xs: "100%", md: "40%" },
            }}>
            <DateCalendar
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={handleDateChange}
            />
          </Paper>
        </LocalizationProvider>

        {/* Time Slot and Court Selection Section */}
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
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: { xs: "1rem", md: "0" },
            }}>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                width: { xs: "100%", md: "auto" },
              }}
              gutterBottom>
              {dayjs(selectedDate).format("dddd, D MMM YYYY")}
            </Typography>

            {/* Court Selection */}
            <FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
              {" "}
              {/* Full width on mobile */}
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
            <Table sx={{ minWidth: { xs: 0, md: 600 } }}>
              {" "}
              {/* Adjust minimum width */}
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
                        {convertTo12HourFormat(time.start)} -{" "}
                        {convertTo12HourFormat(time.end)}
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
  const [date, setDate] = useState(dayjs(new Date()));
  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: userBookings } = useQuery({
    queryKey: ["userBookings"],
    queryFn: fetchUserBookings,
  });

  // Handling popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const bookings = useMemo(
    () => userBooking(userBookings, sportCenterId, facility) || null,
    [userBookings, sportCenterId, facility]
  );
  console.log(bookings);

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
      startTime: dayjs(startTime).format("hh:mm a"),
      endTime: dayjs(endTime).format("hh:mm a"),
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
    <>
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
            <TimePicker
              label="From"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
            />
            <TimePicker
              label="Till"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
            />
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

        {user && bookings && bookings.length > 0 && (
          <>
            <StarIcon
              onClick={handleClick}
              sx={{ color: "#FFEA00", cursor: "pointer" }}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              sx={{
                width: "100rem", // Set your desired width
                maxWidth: "100%", // Ensure it's responsive on smaller screens
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}>
              <Box
                sx={{
                  padding: "1.2rem",
                  borderRadius: "8px",
                }}>
                <Typography> Frequently Booked </Typography>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking, key) => (
                    <Box
                      onClick={() => {
                        setSelectedCourt(booking.court);
                        setStartTime(
                          new Date(
                            parseTimeString(booking.date, booking.startTime)
                          )
                        );
                        setEndTime(
                          new Date(
                            parseTimeString(booking.date, booking.endTime)
                          )
                        );
                      }}
                      key={key}
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                        padding: ".2rem",
                        "&:hover": {
                          background: "var(--primary)",
                          color: "#fff",
                          padding: ".4rem",
                          marginTop: ".4rem",
                          borderRadius: ".3rem",
                        },
                      }}>
                      <Typography>
                        {booking.startTime}-{booking.endTime}
                      </Typography>
                      <Typography> ({booking.court}) </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No Time yet</Typography>
                )}
              </Box>
            </Popover>
          </>
        )}
      </div>
    </>
  );
}
export { ReservationDate, TimeAvailability };
