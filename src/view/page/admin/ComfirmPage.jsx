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
  TextField,
  Box,
  Stack,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Pagination,
  Checkbox,
  PaginationItem,
  Chip,
  Select,
  MenuItem,
  Snackbar,
  InputLabel,
  Button,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import { formatDate, totalHour } from "./../../../utils/timeCalculation";
import useCurrentLessor from "./../../../utils/useCurrentLessor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchBookings,
  fetchAndProcessExpiredBookings,
  updateBookingStatus,
  fetchSportCenter,
  fetchCourt,
  updateMultipleBookingStatus,
} from "./../../../utils/bookingUtil";

const ConfirmPage = () => {
  const queryClient = useQueryClient();
  const lessor = useCurrentLessor();
  const [isOpenSnackBar, setIsOpenSnackBar] = useState(false);
  const [countBookings, setCountBookings] = useState(0);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(null);
  const [facility, setFacility] = useState("");
  const [court, setCourt] = useState("");
  const [pageTotal, setPageTotal] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const resetFilter = () => {
    setSearch("");
    setFacility("");
    setCourt("");
    setDate(null);
  };
  const handleOpenSnackBar = () => setIsOpenSnackBar(true);
  const handleCloseSnackBar = () => setIsOpenSnackBar(false);

  const handleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSelectAll = (data) => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      handleOpenSnackBar();
      setCountBookings(data.length);
      setSelected(data);
    }
  };

  const bulkMutation = useMutation({
    mutationFn: updateMultipleBookingStatus,
    onSuccess: () => {
      notify("Bulk booking statuses updated");
      queryClient.invalidateQueries("bookings");
    },
    onError: () => errorAlert("Error updating booking statuses"),
  });

  const handleBulkAction = (status) => {
    const bookingIds = selected.map((booking) => booking._id);
    bulkMutation.mutate({ status, bookingIds });
  };

  const handleAccept = (status, bookingId) => {
    mutation.mutate({ status, bookingId });
  };

  const handleFilterChange = (event) => setSelectedFilter(event.target.value);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handlePageChange = (_, value) => setPageTotal(value);

  const { data: facilities } = useQuery({
    queryKey: ["facilities", lessor?._id],
    queryFn: () => fetchSportCenter(lessor?._id),
    keepPreviousData: true,
  });

  const { data: courts = [] } = useQuery({
    queryKey: ["court", facility],
    queryFn: () => {
      const selectedFacility = facilities.find((fac) => fac.name === facility);
      return selectedFacility ? fetchCourt(selectedFacility._id) : [];
    },
    enabled: !!facility,
  });

  const { data: pendingBookings, error } = useQuery({
    queryKey: ["bookings", pageTotal, facility, court, date],
    queryFn: () => fetchBookings(pageTotal, facility, court, date),
    keepPreviousData: true,
  });

  const expiredBookingsQuery = useQuery({
    queryKey: ["expiredBookings"],
    queryFn: fetchAndProcessExpiredBookings,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (expiredBookingsQuery.data) {
      expiredBookingsQuery.refetch();
    }
  }, [expiredBookingsQuery]);

  const mutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      notify("Booking status updated");
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("expiredBookings");
    },
    onError: () => {
      errorAlert("Error updating booking status");
    },
  });

  const filteredBookings = pendingBookings?.filter((booking) => {
    if (selectedFilter === "today") {
      return formatDate(booking.date) === dayjs().format("MMMM DD, YYYY");
    }
    return true;
  });

  const searchFilteredBookings = filteredBookings?.filter((booking) => {
    const user = booking.user || booking.outside_user;
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(search.toLowerCase())
    );
  });

  const listBookings = searchFilteredBookings?.map((data, key) => (
    <TableRow key={key}>
      <TableCell>
        <Checkbox
          checked={selected.includes(data)}
          onChange={() => handleSelect(data)}
        />
      </TableCell>
      <TableCell align="left">
        {data?.user?.name || data?.outside_user?.name}
      </TableCell>
      <TableCell align="center">
        {data?.user?.phone_number || data?.outside_user?.phone_number}
      </TableCell>
      <TableCell align="center">{data.facility}</TableCell>
      <TableCell align="center">{data.court}</TableCell>
      <TableCell align="center">{formatDate(data.date)}</TableCell>
      <TableCell align="center">
        {data.startTime || "N/A"} - {data.endTime || "N/A"}
      </TableCell>
      <TableCell align="center">
        {totalHour(data.startTime, data.endTime)}
      </TableCell>
      <TableCell align="center">
        <Chip
          label={data.status}
          color="warning"
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <CheckCircleIcon
            onClick={() => handleAccept("approved", data._id)}
            sx={{ cursor: "pointer" }}
            color="success"
          />
          <CancelIcon
            sx={{ cursor: "pointer" }}
            onClick={() => handleAccept("rejected", data._id)}
            color="error"
          />
        </Stack>
      </TableCell>
    </TableRow>
  ));

  if (error) return <p>Error loading lessor information</p>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <Snackbar
        open={isOpenSnackBar}
        onClose={handleCloseSnackBar}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <Typography sx={{ color: "var(--dark)", fontSize: "1em" }}>
              ({countBookings}) booking selected
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => handleBulkAction("approved")}
                startIcon={<CheckCircleIcon />}>
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleBulkAction("rejected")}
                startIcon={<DeleteIcon />}>
                Reject
              </Button>
            </Stack>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseSnackBar}>
              <CloseIcon sx={{ color: "var(--dark)" }} fontSize="small" />
            </IconButton>
          </Box>
        }
        ContentProps={{
          sx: {
            width: "100%",
            color: "var (--dark)",
            backgroundColor: "var(--white)",
            "& .MuiSnackbarContent-message": { color: "var(--dark)" },
          },
        }}
      />
      <Paper
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          borderRadius: 0,
          padding: "15px",
          marginLeft: "2rem",
        }}
        elevation={0}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            padding: ".8rem",
          }}>
          <Box display="flex" gap={2} alignItems="center">
            <ReplayIcon sx={{ cursor: "pointer" }} onClick={resetFilter} />
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          </Box>

          <Popover
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
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
              <FormControl fullWidth>
                <InputLabel>Facility</InputLabel>
                <Select
                  value={facility}
                  label="Facility"
                  onChange={(e) => setFacility(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {facilities?.map((fac, key) => (
                    <MenuItem key={key} value={fac.name}>
                      {fac.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Court</InputLabel>
                <Select
                  value={court}
                  label="Court"
                  onChange={(e) => setCourt(e.target.value)}>
                  <MenuItem value="">All</MenuItem>

                  {courts?.map((court, key) => (
                    <MenuItem key={key} value={court.name}>
                      {court.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <RadioGroup
                  value={selectedFilter}
                  onChange={handleFilterChange}>
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="All Bookings"
                  />
                  <FormControlLabel
                    value="today"
                    control={<Radio />}
                    label="Today Bookings"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Popover>
        </Box>
        <Divider />
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selected.length === pendingBookings?.length}
                    onChange={() => handleSelectAll(pendingBookings)}
                  />
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell align="center">Contact</TableCell>
                <TableCell align="center">Facility</TableCell>
                <TableCell align="center">Court</TableCell>
                <TableCell align="center">Booking Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listBookings?.length > 0 ? (
                listBookings
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={10}>
                    No Booking
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Pagination
          count={pageTotal}
          page={pageTotal}
          onChange={handlePageChange}
          sx={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "2rem",
          }}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Paper>
    </>
  );
};

export default ConfirmPage;
