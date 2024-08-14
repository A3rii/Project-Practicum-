import { useState, useMemo } from "react";
import Loader from "../../../components/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Rating,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Popover,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Link, Navigate } from "react-router-dom";

function TimePickerField({ time }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker sx={{ maxWidth: "100%" }} label={time} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

function SelectionOption({ type, option1, option2, option3 }) {
  const [option, setOption] = useState("");

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  return (
    <Box sx={{ minWidth: "100%" }}>
      <FormControl fullWidth>
        <InputLabel>{type}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label={type}
          onChange={handleChange}>
          <MenuItem value={10}>{option1}</MenuItem>
          <MenuItem value={20}>{option2}</MenuItem>
          <MenuItem value={30}>{option3}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function FilterType() {
  const [checked, setChecked] = useState({
    All: false,
    Open: false,
    Close: false,
  });
  const handleChange = (event) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Card sx={{ minWidth: 275, mb: 4, borderRadius: ".7rem" }} elevation={7}>
      <CardContent>
        <Typography sx={{ fontSize: 16, p: 2 }} color="text.secondary">
          Filter By
        </Typography>
        <TextField
          label="Search"
          variant="filled"
          sx={{ m: 1.4 }}
          size="small"
        />
      </CardContent>

      <Divider />

      {/* Time Availability */}
      <CardContent sx={{ p: 3 }}>
        <Typography
          sx={{ fontSize: 16, mt: 1 }}
          color="text.secondary"
          component="div">
          Time Available
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.All}
                onChange={handleChange}
                name="All"
              />
            }
            label="All"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Open}
                onChange={handleChange}
                name="Open"
              />
            }
            label="Open"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Close}
                onChange={handleChange}
                name="Close"
              />
            }
            label="Close"
          />
        </FormGroup>
      </CardContent>

      <Divider />

      {/*Location */}

      <CardContent sx={{ p: 3 }}>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 16, mt: 1 }}
          component="div">
          Location
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.All}
                onChange={handleChange}
                name="All"
              />
            }
            label="All"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Open}
                onChange={handleChange}
                name="Nearest"
              />
            }
            label="Nearest"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Close}
                onChange={handleChange}
                name="Close"
              />
            }
            label="Close"
          />
        </FormGroup>
      </CardContent>

      <Divider />

      {/** Time Open  */}

      <CardContent sx={{ p: 3 }}>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 16, mt: 1 }}
          component="div">
          Time Open
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.All}
                onChange={handleChange}
                name="All"
              />
            }
            label="All"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Open}
                onChange={handleChange}
                name="Open"
              />
            }
            label="6am - 9pm"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Open}
                onChange={handleChange}
                name="Open"
              />
            }
            label="6am - 10pm"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Open}
                onChange={handleChange}
                name="Open"
              />
            }
            label="6am - 11pm"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.Close}
                onChange={handleChange}
                name="Close"
              />
            }
            label="6am - 12pm"
          />
        </FormGroup>
      </CardContent>
    </Card>
  );
}

function SportFieldCard() {
  const {
    data: sportCenter = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sportCenter"],
    queryFn: async () => {
      const getSportCenter = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/auth/informations`
      );
      const centers = getSportCenter.data.lessors;

      // Checking if the sport center is approved and they already have facility to booked
      const approvedCenter = centers.filter(
        (center) =>
          center.status === "approved" &&
          center.facilities &&
          center.facilities.length > 0
      );
      return approvedCenter;
    },
  });

  const listSportCenter = useMemo(() => {
    if (!sportCenter || sportCenter.length === 0)
      return <p>No sport centers available.</p>;

    return (
      sportCenter.length > 0 &&
      sportCenter.map((data, key) => (
        <Card
          key={key}
          sx={{
            width: { lg: 240, md: 210, xs: 200 },
            height: 380,
            marginBottom: "2rem",
          }}
          elevation={4}>
          <CardMedia sx={{ height: 190 }} loading="lazy" image={data?.logo} />

          <CardContent
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}>
            <Typography variant="h6" component="div" sx={{ fontSize: "1rem" }}>
              {data?.sportcenter_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.address?.street} {data?.address?.city}{" "}
              {data?.address?.state}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.operating_hours?.open} - {data?.operating_hours?.close}
            </Typography>
            <Box>
              <Rating name="read-only" value={2} readOnly />
            </Box>
          </CardContent>

          <CardActions>
            <Link className="booking-btn" to={`/sportcenter/${data?._id}`}>
              Book Now
            </Link>
          </CardActions>
        </Card>
      ))
    );
  }, [sportCenter]);
  if (isLoading) return <Loader />;
  if (error) return <Navigate to="/error" />;
  return <>{listSportCenter} </>;
}

export default function Booking() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div className="container booking-field">
        {/** Menu */}
        <div className="booking-filter-none">
          <TuneIcon
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}
            style={{
              fontSize: "2rem",
              cursor: "pointer",
            }}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            sx={{ mt: 2 }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}>
            <div className="booking-hover-filter">
              <CloseIcon
                sx={{ fontSize: "1.5rem", mt: 2, ml: 2, cursor: "pointer" }}
                onClick={handleClose}
              />
              <h4>Filter By</h4>
            </div>
            <FormControl
              sx={{
                width: "25rem",
                height: "20srem",
                display: "flex",
                justifyContent: "center",
                p: 2,
                gap: "1rem",
              }}>
              <SelectionOption
                type="Time Available"
                option1="All"
                option2="Openend"
                option3="Closed"
              />
              <SelectionOption
                type="Location"
                option1="All"
                option2="Nearest"
                option3="Closed"
              />
              <TimePickerField time="Open Till" />
              <button className="btn-filter-schedule">FIND</button>
            </FormControl>
          </Popover>
          <span className="">Menu</span>
        </div>
        {/** Menu */}

        <div className="booking-sportFieldCard">
          <div className="booking-filter">
            <FilterType />
          </div>

          <div className="booking-centerCard">
            <SportFieldCard />
          </div>
        </div>
      </div>
    </>
  );
}
