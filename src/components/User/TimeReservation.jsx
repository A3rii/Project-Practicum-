import dayjs from "dayjs";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Chip,
  TableCell,
  TableBody,
  Paper,
  Box,
  OutlinedInput,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { timeslotAPI } from "./../../api/user/index";

//* Time available section */
export default function TimeAvailability({ sportCenterId, facility, court }) {
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
      timeslotAPI.fetchTime(
        sportCenterId,
        formattedDate,
        facility,
        selectedCourt
      ),
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
          width: { xs: "75%", md: "75%" },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}>
        {/* Date Picker Section */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper
            sx={{
              width: "50%",
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
                        <Chip
                          label={time.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              time.status === "approved"
                                ? "#e0f7fa"
                                : "#FF0000",
                            color: "#00796b",
                            fontWeight: "500",
                          }}
                        />
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
}
