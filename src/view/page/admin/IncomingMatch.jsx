import { useState, useMemo } from "react";
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
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Stack,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import useCurrentLessor from "./../../../utils/useCurrentLessor";
import { useQuery } from "@tanstack/react-query";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import {
  Replay as ReplayIcon,
  FilterList as FilterListIcon,
  IosShare as IosShareIcon,
} from "@mui/icons-material";
import authToken from "./../../../utils/authToken";
import { exportToExcel } from "./../../../utils/excel";
import { incomingBookingAPI } from "./../../../api/admin/index";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function IncomingMatch() {
  const token = authToken();
  const lessor = useCurrentLessor();
  const [facility, setFacility] = useState("");
  const [court, setCourt] = useState("");
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("approved");
  const [anchorEl, setAnchorEl] = useState(null);

  const resetFilter = () => {
    setFacility("");
    setCourt("");
    setUserName("");
    setDate(null);
  };

  const handleChangeFacility = (event) => {
    setFacility(event.target.value);
  };
  const handleChangeCourt = (event) => {
    setCourt(event.target.value);
  };

  // Fetch facilities
  const { data: facilities = [] } = useQuery({
    queryKey: ["facilities", lessor?._id],
    queryFn: () => incomingBookingAPI.fetchSportCenter(lessor?._id),
    keepPreviousData: true,
  });

  // Fetch all bookings
  const { data: allBookings = [], error } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => incomingBookingAPI.fetchBookings(token),
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // Fetching court details
  const { data: courts = [] } = useQuery({
    queryKey: ["court", facility],
    queryFn: () => {
      const selectedFacility = facilities.find((fac) => fac.name === facility);
      return selectedFacility
        ? incomingBookingAPI.fetchCourt(selectedFacility._id)
        : [];
    },
    enabled: !!facility,
  });

  // Filter bookings by facility and status (approved/rejected)
  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const matchesFacility = facility ? booking.facility === facility : true;
      const matchesCourt = court ? booking.court === court : true;
      const user = booking.user || booking.outside_user;
      const filterUserName =
        user.name.toLowerCase().includes(userName.toLowerCase()) ||
        user.phone_number.toLowerCase().includes(userName.toLowerCase());
      const matchesStatus = booking.status === selectedFilter;
      const filterDate = date
        ? formatDate(booking.date) === formatDate(date)
        : true;
      return (
        matchesCourt &&
        matchesFacility &&
        matchesStatus &&
        filterUserName &&
        filterDate
      );
    });
  }, [allBookings, facility, selectedFilter, court, userName, date]);

  // Generate the list of bookings
  const listBookings = useMemo(() => {
    if (filteredBookings.length === 0) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={9}>
            No matches found
          </TableCell>
        </TableRow>
      );
    }

    return filteredBookings.map((data, index) => (
      <TableRow key={data._id}>
        <TableCell>{index + 1} </TableCell>
        <TableCell align="left">
          {data?.user?.name || data?.outside_user?.name || "N/A"}
        </TableCell>
        <TableCell align="left">
          {data?.user?.phone_number ||
            data?.outside_user?.phone_number ||
            "N/A"}
        </TableCell>
        <TableCell align="center">{data.facility || "N/A"}</TableCell>
        <TableCell align="center">{data.court || "N/A"}</TableCell>
        <TableCell align="center">{formatDate(data.date) || "N/A"}</TableCell>
        <TableCell align="center">
          {data.startTime || "N/A"} - {data.endTime || "N/A"}
        </TableCell>
        <TableCell align="left">
          {totalHour(data.startTime, data.endTime) || "N/A"}
        </TableCell>
        <TableCell align="center">
          <Chip
            label={data.status}
            color={data.status === "approved" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        </TableCell>
      </TableRow>
    ));
  }, [filteredBookings]);

  // Download The Report
  const downloadDataReport = (listBookings) => {
    if (listBookings.length === 0) {
      return;
    }
    exportToExcel(listBookings, "bookings");
  };

  // If there was an error while fetching data
  if (error) return <div>Error loading bookings</div>;

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        padding: "15px",
        marginLeft: "2rem",
        border: 0,
        borderTop: 0,
        borderRadius: 0,
      }}
      elevation={0}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
          }}>
          <ReplayIcon sx={{ cursor: "pointer" }} onClick={resetFilter} />

          <TextField
            size="small"
            value={userName}
            label="Search"
            onChange={(e) => setUserName(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ width: 150 }}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={handleClick}>
            <FilterListIcon />
            <Typography>Filter</Typography>
          </Stack>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}>
            <Box
              sx={{
                padding: "1rem",
                maxWidth: "100%",
                width: "15rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Facility</InputLabel>
                <Select
                  label="facility"
                  value={facility}
                  onChange={handleChangeFacility}>
                  <MenuItem value="">All</MenuItem>
                  {facilities.map((facility, key) => (
                    <MenuItem value={facility.name} key={key}>
                      {facility.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Court</InputLabel>
                <Select
                  label="court"
                  value={court}
                  onChange={handleChangeCourt}>
                  <MenuItem value="">All</MenuItem>
                  {courts.map((court, key) => (
                    <MenuItem value={court.name} key={key}>
                      {court.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControl
              onChange={handleFilterChange}
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                padding: "1rem",
              }}>
              <RadioGroup name="radio-buttons-group" value={selectedFilter}>
                <FormControlLabel
                  value="approved"
                  control={<Radio />}
                  label="Accepted"
                />
                <FormControlLabel
                  value="rejected"
                  control={<Radio />}
                  label="Rejected"
                />
              </RadioGroup>
            </FormControl>
          </Popover>
        </div>
        <Tooltip title={"Export report"}>
          <Button
            variant="contained"
            onClick={() => downloadDataReport(filteredBookings)}
            startIcon={<IosShareIcon />}>
            Export
          </Button>
        </Tooltip>
      </div>

      <Divider />

      <TableContainer style={{ height: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="center">Facility</TableCell>
              <TableCell align="center">Court</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="left">Hour</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listBookings}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
