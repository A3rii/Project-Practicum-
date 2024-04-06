import * as React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ContactInfo from "./../../../components/Contact/ContactInfo";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Rating,
  Typography,
} from "@mui/material";
import FootBall from "./../../../assets/BookingImags/pic7.jpg";
import Basketball from "./../../../assets/BookingImags/pic9.jpg";
import Badminton from "./../../../assets/BookingImags/pic10.jpg";
import { red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

//  Dynamically
function RatingSkeletons() {
  const value = 2;
  return (
    <>
      <Card
        sx={{
          width: "55rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.3rem",
        }}
        square={false}
        elevation={4}
        variant="outlined">
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
          title="Sim Sen Chamroung"
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography sx={{ marginTop: "1rem" }} color="text.secondary">
            Dont come to this place it is dirty
          </Typography>
          <Rating name="read-only" value={value} readOnly />
        </CardContent>
      </Card>
    </>
  );
}

// eslint-disable-next-line react/prop-types
function CenterCard({ image, type, time, price }) {
  return (
    <Card sx={{ width: 300 }}>
      <CardMedia sx={{ height: 250 }} image={image} title="Sport Category" />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontSize: "1rem" }}>
          {type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <i
            className="fa-regular fa-calendar-check"
            style={{ marginRight: "12px" }}></i>
          {time}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <i
            className="fa-solid fa-calendar-days"
            style={{ marginRight: "12px" }}></i>
          {price}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to="/sportfield">
          <Button variant="outlined" color="error">
            Explore more
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
export default function CenterDetail() {
  const [value, setValue] = React.useState(2);
  return (
    <>
      <div className="center-header">
        <Header />
        <div className="center-banner">
          <h2> Welcome to Phnom Penh Sport Center</h2>
          <span>
            This is a site where you can all book your sport field with ease and
            quick services.
          </span>
          <div className="center-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>Toul Kork, Phnom Penh </span>
          </div>
        </div>
      </div>

      <div className="center-category">
        <h2> Our Sport Services </h2>
        <div className="center-cardSport">
          <CenterCard
            image={FootBall}
            type="FOOTBALL"
            time="Available: 7AM - 9PM"
            price="20$ per 90 minutes"
          />

          <CenterCard
            image={Basketball}
            type="BASKETBALL"
            time="Available: 7AM - 9PM"
            price="10$ per 60 minutes"
          />

          <CenterCard
            image={Badminton}
            type="BADMINTON"
            time="Available: 7AM - 9PM"
            price="20$ per 90 minutes"
          />
        </div>
      </div>

      <div className="center-map">
        <div className="center-googleMap">
          <h2> View the location </h2>
          <span>You can find the sport center by viewing through this map</span>
          <button type="button" className="center-buttonView">
            View Map
          </button>
        </div>
      </div>

      <div className="center-rating">
        <h3> Client Review</h3>
        <div className="center-comment">
          <RatingSkeletons />
          <RatingSkeletons />
          <RatingSkeletons />
          <RatingSkeletons />
        </div>
      </div>
      {/* <div className="center-client-comments">
        <h2>Your FeedBack </h2>
        <input
          type="text"
          className="client-feedback"
          placeholder="Feedback...."
        />
        <div className="center-client-rating">
          <span>Rating </span>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <button type="submit" className="center-buttonSubmit">
          Submit
        </button>
      </div> */}
      <div className="center-contact">
        <ContactInfo />
      </div>
      <Footer />
    </>
  );
}
