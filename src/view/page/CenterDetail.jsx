/* eslint-disable react/prop-types */
import ContactInfo from "../../components/ContactInfo";
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
import axios from "axios";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, useParams } from "react-router-dom";
import { red } from "@mui/material/colors";
import { useState, useEffect } from "react";

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

function CenterCard({ image, type, time, price, facilityId, sportCenterId }) {
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
        <Link to={`/facility/${facilityId}/sport-center/${sportCenterId}`}>
          <Button variant="outlined" color="error">
            Explore more
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
export default function CenterDetail() {
  const { sportCenterId } = useParams();
  const [sportCenter, setSportCenter] = useState(null);

  useEffect(() => {
    const fetchSportCenter = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/lessor/auth/users/${sportCenterId}`
        );
        setSportCenter(response.data.lessor);
      } catch (err) {
        console.error("Error fetching sport center:", err.message);
        setSportCenter(null);
      }
    };

    fetchSportCenter();
  }, [sportCenterId]);

  if (!sportCenter) {
    return <p>Loading...</p>;
  }
  console.log(sportCenter);

  return (
    <>
      <div className="center-header">
        <div className="center-banner">
          <h2> Welcome to {sportCenter.sportcenter_name}</h2>
          <span>{sportCenter.sportcenter_description}</span>
          <div className="center-location">
            <i className="fa-solid fa-location-dot"></i>
            <span className="center-address">
              <p> {sportCenter.address.street} </p>
              <p> {sportCenter.address.city} </p>
              <p> {sportCenter.address.state} </p>
            </span>
          </div>
        </div>
      </div>

      {sportCenter.facilities.map((data, key) => (
        <div key={key} className="center-category">
          <h2> Our Sport Services </h2>
          <div className="center-cardSport">
            <CenterCard
              image={data.image}
              type={data.name}
              time={`Available: ${sportCenter.operating_hours.open}-${sportCenter.operating_hours.close}`}
              price={` ${data.price} per 90 minutes`}
              facilityId={data._id}
              sportCenterId={sportCenter._id}
            />
          </div>
        </div>
      ))}

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
        </div>
      </div>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
