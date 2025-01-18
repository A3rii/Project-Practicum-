import dayjs from "dayjs";
import currentUser from "../../utils/currentUser";
import ModalForSocialUser from "./ModalForSocialUser";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { errorAlert } from "../../utils/toastAlert";
import { timeOverlapping, parseTimeString } from "../../utils/timeCalculation";
import { useQuery } from "@tanstack/react-query";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { formatTime, totalHour } from "./../../utils/timeCalculation";
import { reservationAPI } from "./../../api/user/index";
import { Replay as ReplayIcon } from "@mui/icons-material";

//* Fetching all facility from lessor API
const fetchFacility = async (sportCenterId, facilityId) => {
  const facilities = await reservationAPI.fetchSportCenter(sportCenterId);
  return facilities.find((facility) => facility._id === facilityId)?.name;
};

//* Reservation section
export default function ReservationDate({ court, price }) {
  const user = currentUser();
  const navigate = useNavigate();
  const { facilityId, sportCenterId } = useParams();
  const [date, setDate] = useState(dayjs(new Date()));
  const [openDetails, setOpenDetails] = useState(false);

  const [selectedCourt, setSelectedCourt] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  //* open details
  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

  const { data: userBookings } = useQuery({
    queryKey: ["userBookings"],
    queryFn: reservationAPI.fetchUserBookings,
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
  const { data: facility, error } = useQuery({
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
      reservationAPI.fetchTime(
        sportCenterId,
        formattedDate,
        facility,
        selectedCourt
      ),
    refetchOnWindowFocus: true,
  });

  const bookings = useMemo(
    () => userBooking(userBookings, sportCenterId, facility) || null,
    [userBookings, sportCenterId, facility]
  );

  // handling the booking process
  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If it the social user and they dont have phone number
    if (user?.provider && !user?.phone_number) {
      handleOpenDetails();
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

    // If all the conditions are all filled , route to payment page which contains booking infos

    /**
     * @   Need to be protected
     */
    navigate(
      `/bakong-qr?bookingDate=${date}&timeStart=${formatTime(
        startTime
      )}&timeEnd=${formatTime(endTime)}&userPhonenumber=${
        user.phone_number
      }&facility=${facility}&court=${selectedCourt}&price=${price}&sportCenterId=${sportCenterId}&duration=${totalHour(
        formatTime(startTime),
        formatTime(endTime)
      )}`
    );
  };

  // Reset the bookig reservation
  const resetFields = () => {
    setSelectedCourt("");
    setStartTime(null);
    setEndTime(null);
  };

  const courts = useMemo(() => court.map((c) => c.name), [court]);
  if (error) return <div>Error loading facility information</div>;

  return (
    <>
      {openDetails && (
        <ModalForSocialUser open={openDetails} close={handleCloseDetails} />
      )}
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
              disablePast
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

        <ReplayIcon sx={{ cursor: "pointer" }} onClick={resetFields} />

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
                width: "100rem",
                maxWidth: "100%",
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
