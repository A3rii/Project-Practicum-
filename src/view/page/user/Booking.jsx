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
  Tooltip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { Link, Navigate } from "react-router-dom";

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

// Average Rating of sport center
const RatingStars = ({ sportCenterId }) => {
  const {
    data: ratings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ratings", sportCenterId],
    queryFn: async () => {
      try {
        const rating = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/rating/average/reviews/${sportCenterId}`
        );
        return rating.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    enabled: !!sportCenterId,
  });
  const averageStars = ratings?.averageStars;
  if (isLoading) return <Loader />;
  if (error) return <p>Error Fetching</p>;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: ".6rem",
      }}>
      <Rating name="read-only" value={averageStars} precision={0.5} readOnly />
      <Tooltip title={`User Rating ${ratings?.userRate}`}>
        <Typography
          sx={{ fontWeight: "light", fontSize: ".8rem", color: "#595959" }}>
          ({ratings?.userRates})
        </Typography>
      </Tooltip>
    </Box>
  );
};

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
              <RatingStars sportCenterId={data?._id} />
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
