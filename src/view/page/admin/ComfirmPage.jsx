import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Paper,
  Box,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Divider,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Pagination,
  PaginationItem,
  Checkbox,
  Chip,
  Select,
  MenuItem,
  Snackbar,
  InputLabel,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
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

import { notify, errorAlert } from "../../../utils/toastAlert";
import { formatDate, totalHour } from "../../../utils/timeCalculation";
import { bookingAPI } from "../../../api/admin";
import useCurrentLessor from "../../../utils/useCurrentLessor";

const BookingTableHeader = ({ selected, handleSelectAll, pendingBookings }) => (
  <TableHead>
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected.length === pendingBookings?.length}
          onChange={() => handleSelectAll(pendingBookings)}
        />
      </TableCell>
      {[
        "User",
        "Contact",
        "Facility",
        "Court",
        "Booking Date",
        "Time",
        "Duration",
        "Paid",
        "Status",
        "Action",
      ].map((header) => (
        <TableCell key={header} align={header === "User" ? "left" : "center"}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const FilterPopover = ({
  open,
  anchorEl,
  onClose,
  filters,
  setFilters,
  facilities,
  courts,
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
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
          value={filters.facility}
          label="Facility"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              facility: e.target.value,
              court: "", // Reset court when facility changes
            }))
          }>
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
          value={filters.court}
          label="Court"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              court: e.target.value,
            }))
          }
          disabled={!filters.facility}>
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
          value={filters.selectedFilter}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              selectedFilter: e.target.value,
            }))
          }>
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
);

const BookingRow = ({ data, selected, handleSelect, handleAccept }) => {
  const user = data.user || data.outside_user;

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected.includes(data)}
          onChange={() => handleSelect(data)}
        />
      </TableCell>
      <TableCell align="left">{user.name}</TableCell>
      <TableCell align="center">{user.phone_number}</TableCell>
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
          label={data.user ? "paid" : "unpaid"}
          color={data.user ? "success" : "error"}
          size="small"
          variant="outlined"
        />
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
            onClick={() => handleAccept("rejected", data._id)}
            sx={{ cursor: "pointer" }}
            color="error"
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};

const ConfirmPage = () => {
  const queryClient = useQueryClient();
  const lessor = useCurrentLessor();
  const [filters, setFilters] = useState({
    search: "",
    date: null,
    facility: "",
    court: "",
    selectedFilter: "all",
    pageTotal: 1,
  });
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenSnackBar, setIsOpenSnackBar] = useState(false);

  const resetFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      facility: "",
      court: "",
      date: null,
    }));
  }, []);

  const handleSelect = useCallback((item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }, []);

  const handleSelectAll = useCallback((data) => {
    setSelected((prev) => (prev.length === data?.length ? [] : data || []));
    setIsOpenSnackBar(true);
  }, []);

  const { data: facilities } = useQuery({
    queryKey: ["facilities", lessor?._id],
    queryFn: () => bookingAPI.fetchSportCenter(lessor?._id),
    keepPreviousData: true,
  });

  const { data: courts = [] } = useQuery({
    queryKey: ["court", filters.facility],
    queryFn: () => {
      const selectedFacility = facilities?.find(
        (fac) => fac.name === filters.facility
      );
      return selectedFacility
        ? bookingAPI.fetchCourt(selectedFacility._id)
        : [];
    },
    enabled: !!filters.facility,
  });

  const { data: pendingBookings = [], error } = useQuery({
    queryKey: [
      "bookings",
      filters.pageTotal,
      filters.facility,
      filters.court,
      filters.date,
    ],
    queryFn: () =>
      bookingAPI.fetchBookings(
        filters.pageTotal,
        filters.facility,
        filters.court,
        filters.date
      ),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: bookingAPI.updateBookingStatus,
    onSuccess: () => {
      notify("Booking status updated");
      queryClient.invalidateQueries("bookings");
    },
    onError: () => errorAlert("Error updating booking status"),
  });

  const bulkMutation = useMutation({
    mutationFn: bookingAPI.updateMultipleBookingStatus,
    onSuccess: () => {
      notify("Bulk booking statuses updated");
      queryClient.invalidateQueries("bookings");
    },
    onError: () => errorAlert("Error updating booking statuses"),
  });

  const filteredBookings = useMemo(() => {
    return pendingBookings
      ?.filter((booking) => {
        if (filters.selectedFilter === "today") {
          return formatDate(booking.date) === dayjs().format("MMMM DD, YYYY");
        }
        return true;
      })
      .filter((booking) => {
        const user = booking.user || booking.outside_user;
        return (
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.phone_number.toLowerCase().includes(filters.search.toLowerCase())
        );
      });
  }, [pendingBookings, filters.selectedFilter, filters.search]);

  if (error)
    return (
      <Typography color="error">Error loading lessor information</Typography>
    );

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <Snackbar
        open={isOpenSnackBar}
        onClose={() => setIsOpenSnackBar(false)}
        ContentProps={{
          sx: {
            width: "100%",
            color: "var (--dark)",
            backgroundColor: "var(--white)",
            "& .MuiSnackbarContent-message": { color: "var(--dark)" },
          },
        }}
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: ".6rem",
            }}>
            <Typography sx={{ color: "var(--dark)", fontSize: "1em" }}>
              ({selected.length}) booking selected
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() =>
                  bulkMutation.mutate({
                    status: "approved",
                    bookingIds: selected.map((booking) => booking._id),
                  })
                }
                startIcon={<CheckCircleIcon />}>
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() =>
                  bulkMutation.mutate({
                    status: "rejected",
                    bookingIds: selected.map((booking) => booking._id),
                  })
                }
                startIcon={<DeleteIcon />}>
                Reject
              </Button>
            </Stack>
            <IconButton size="small" onClick={() => setIsOpenSnackBar(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
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
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={filters.date}
                onChange={(newValue) =>
                  setFilters((prev) => ({ ...prev, date: newValue }))
                }
                sx={{ width: 150 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              <FilterListIcon />
              <Typography>Filter</Typography>
            </Stack>
          </Box>
          <FilterPopover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            filters={filters}
            setFilters={setFilters}
            facilities={facilities}
            courts={courts}
          />
        </Box>
        <Divider />
        <TableContainer>
          <Table stickyHeader>
            <BookingTableHeader
              selected={selected}
              handleSelectAll={handleSelectAll}
              pendingBookings={pendingBookings}
            />
            <TableBody>
              {filteredBookings?.length > 0 ? (
                filteredBookings.map((data, key) => (
                  <BookingRow
                    key={key}
                    data={data}
                    selected={selected}
                    handleSelect={handleSelect}
                    handleAccept={(status, bookingId) =>
                      mutation.mutate({ status, bookingId })
                    }
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={11}>
                    No Bookings
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Pagination
          count={filters.pageTotal}
          page={filters.pageTotal}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, pageTotal: value }))
          }
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
