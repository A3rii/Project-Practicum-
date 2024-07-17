import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Paper,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";
import authToken from "./../../../utils/authToken";

export default function IncomingMatch() {
  const token = authToken();
  const [bookings, setBookings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
      const books = getBooking.data.bookings;

      const approvedOrders = books.filter(
        (booking) => booking.status === "approved"
      );

      setBookings(approvedOrders);
    } catch (err) {
      console.log(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Formatting date
  const formatDate = (date) => {
    return dayjs(date).format("MMMM DD, YYYY");
  };

  // Calculate the total hours
  const totalHour = (start, end) => {
    const startTime = dayjs(start, "HH:mm");
    const endTime = dayjs(end, "HH:mm");
    return endTime.diff(startTime, "hour", true); // Calculate difference in hours
  };

  const listBookings = useMemo(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) return null;

    return bookings.map((data, key) => (
      <TableRow key={key}>
        <TableCell align="left" sx={{ fontWeight: "bold" }}>
          {data.user.name}
        </TableCell>
        <TableCell align="center" sx={{ width: "25%", fontWeight: "bold" }}>
          {data.user.phone_number}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          {data.facility}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          {data.court}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: "bold" }}>
          {formatDate(data.date)}
        </TableCell>

        <TableCell align="left" sx={{ fontWeight: "bold" }}>
          {data.startTime}
        </TableCell>
        <TableCell align="left" sx={{ fontWeight: "bold" }}>
          {data.endTime}
        </TableCell>
        <TableCell align="left" sx={{ fontWeight: "bold" }}>
          {totalHour(data.startTime, data.endTime)}
        </TableCell>

        <TableCell
          sx={{
            display: "inline-block",
            margin: "12px",
            padding: "5px 9px",
            fontSize: "12px",
            fontWeight: "bold",
            backgroundColor: "green",
            color: "white",
            borderRadius: "10px",
            textAlign: "center",
          }}>
          {data.status}
        </TableCell>
      </TableRow>
    ));
  }, [bookings]);

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginTop: "2rem",
        marginLeft: "2rem",
      }}
      elevation={10}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography
          display="flex"
          alignItems="center"
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "14px", fontWeight: "bold" }}>
          Incoming Match
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            gap: "1rem",
          }}>
          <Box sx={{ maxWidth: "100%" }}>
            <TextField size="small" sx={{ width: "20rem" }} label="Search..." />
          </Box>

          <FilterAltIcon
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}
            style={{
              fontSize: "2rem",
              marginRight: "20px",
              cursor: "pointer",
            }}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}>
            {/*Content Filter Here*/}

            <FormControl
              sx={{
                width: "9rem",
                height: "9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <RadioGroup name="radio-buttons-group">
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="incoming"
                  control={<Radio />}
                  label="Incoming"
                />
                <FormControlLabel
                  value="done"
                  control={<Radio />}
                  label="Done"
                />
              </RadioGroup>
            </FormControl>
          </Popover>
        </div>
      </div>

      <Divider />

      <TableContainer style={{ height: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Facility</TableCell>
              <TableCell align="center">Court</TableCell>
              <TableCell align="center">Date </TableCell>
              <TableCell align="left">Start </TableCell>
              <TableCell align="left">End </TableCell>
              <TableCell align="left">Hour </TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBookings ? (
              listBookings
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No Incoming match</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
