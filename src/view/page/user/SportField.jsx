import "react-toastify/dist/ReactToastify.css";
import ContactInfo from "../../../components/ContactInfo";
import CardSwiper from "../../../components/CardSwiper";
import dayjs from "dayjs";
import axios from "axios";
import currentUser from "../../../utils/currentUser";
import authToken from "../../../utils/authToken";
import { notify, errorAlert } from "../../../utils/toastAlert";
import { ToastContainer } from "react-toastify";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function ReservationDate({ court }) {
  const user = currentUser();

  const token = authToken();
  const { facilityId, sportCenterId } = useParams();

  //* Booking requirement
  const [facility, setFacility] = useState("");
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

  //* fetching and compare the facility
  const fetchFacility = useCallback(async () => {
    try {
      const getFacility = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/auth/users/${sportCenterId}`
      );
      const sportCenter = getFacility.data.lessor;

      const facilityInformation = sportCenter.facilities.find(
        (facility) => facility._id === facilityId
      );

      if (facilityInformation) {
        setFacility(facilityInformation.name);
      } else {
        console.log("Facility not found");
      }
    } catch (err) {
      console.log(err.message);
    }
  }, [sportCenterId, facilityId]);

  useEffect(() => {
    fetchFacility();
  }, [fetchFacility]);

  // Reservation for user
  const handleBooking = async () => {
    const bookingRequirement = {
      user: user._id,
      lessor: sportCenterId,
      facility: facility,
      court: selectedCourt,
      date: date.toISOString(),
      startTime: startTime.format("hh:mm a"), // Format date : 1:00 am  , 12:00 am
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
      notify("You have  successfully booked");
      setFacility("");
      setSelectedCourt("");
      setStartTime("");
      setEndTime("");
      console.log(booking.data.message);
    } catch (err) {
      errorAlert("There is a problem with the system.");
      console.log(err.message);
    }
  };

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

export default function SportField() {
  const { facilityId, sportCenterId } = useParams();

  const [facility, setFacility] = useState([]);
  useEffect(() => {
    const fetchSportCenter = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/lessor/auth/users/${sportCenterId}`
        );
        const lessor = response.data.lessor;
        setFacility(lessor.facilities);
      } catch (err) {
        console.error("Error fetching sport center:", err.message);
        setFacility([]);
      }
    };

    fetchSportCenter();
  }, [sportCenterId]);

  if (facility.length === 0) {
    return <p>Loading...</p>;
  }

  const facilityInformation = facility.find(
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

      <div className="sportField-Slider">
        <h2> Our Football View </h2>
        <CardSwiper court={facilityInformation.court} />
      </div>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
