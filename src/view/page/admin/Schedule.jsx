import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useState, useEffect, useCallback, useMemo } from "react";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import authToken from "./../../../utils/authToken";
import useCurrentLessor from "../../../utils/useCurrentLessor";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import {
  Paper,
  Button,
  Box,
  InputLabel,
  Select,
  Typography,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { parseTimeString } from "./../../../utils/timeCalculation";
import { ScheduleModal } from "../../../components/AdminComponent/Schedule/ScheduleModal";
import { UpcomingMatch } from "../../../components/AdminComponent/Schedule/UpcomingMatch";
import { ScheduleBox } from "../../../components/AdminComponent/Schedule/ScheduleBox";
import TimeLine from "./../../../components/AdminComponent/Timeline/TimeLine";
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

export default function Schedule() {
  const token = authToken();
  const currentLessor = useCurrentLessor();

  // States for booking requirements
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterFacility, setFiltertFacility] = useState("");

  // Memoized facilities list
  const getFacilities = useMemo(
    () => currentLessor?.facilities || [],
    [currentLessor]
  );

  // Fetching bookings
  const fetchBooking = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/sport-center`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // filter only the approved bookings
      const approvedBookings = data.bookings.filter(
        (booking) =>
          booking.status === "approved" &&
          (!filterFacility || booking.facility === filterFacility)
      );
      const transformedEvents = approvedBookings.map((booking) => ({
        title: `Customer: ${
          booking?.user?.name || booking?.outside_user?.name
        }, Facility: ${booking.facility}, Court: ${booking.court}`,
        start: parseTimeString(booking.date, booking.startTime),
        end: parseTimeString(booking.date, booking.endTime),
      }));
      setEvents(transformedEvents);
    } catch (err) {
      throw new Error(err.message);
    }
  }, [token, filterFacility]);

  // Fetch bookings when currentLessor changes
  useEffect(() => {
    if (currentLessor) {
      fetchBooking();
    }
  }, [currentLessor, fetchBooking]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      {open && (
        <ScheduleModal openModal={open} onCloseModal={() => setOpen(false)} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          alignItems: "start",
          marginTop: "1rem",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "55rem",
            gap: "1rem",
            maxWidth: "100%",
          }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setOpen(true)}>
              Add Events
            </Button>
            <Paper sx={{ width: "25%" }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Facility</InputLabel>
                <Select
                  value={filterFacility}
                  onChange={(e) => setFiltertFacility(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {getFacilities.map((fac, key) => (
                    <MenuItem key={key} value={fac.name}>
                      {fac.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Box>
          <Calendar
            defaultView={Views.MONTH}
            events={events}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            dayLayoutAlgorithm="no-overlap"
            style={{ height: 500, width: "100%", marginTop: "1rem" }}
          />
          <UpcomingMatch />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            width: "40%",
            maxWidth: "100%",
            alignItems: "start",
            gap: "1rem",
            flexDirection: "column",
          }}>
          <ScheduleBox />
          <Box
            sx={{
              width: "75%",
              margin: "2rem auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                color: "#333333",
              }}>
              Match In Progress
            </Typography>
            <TimeLine />
          </Box>
        </Box>
      </Box>
    </>
  );
}
