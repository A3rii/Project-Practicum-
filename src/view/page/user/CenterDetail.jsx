import ContactInfo from "../../../components/ContactInfo";
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
import { Link, useParams, Navigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";
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
    <Card sx={{ width: 250 }}>
      <CardMedia
        sx={{ height: 250 }}
        loading="lazy"
        image={image}
        title="Sport Category"
      />
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

  const {
    data: sportCenter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sportCenter", sportCenterId],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/lessor/auth/informations/${sportCenterId}`
      );
      return response.data.lessor;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) return <Navigate to="/error" />;

  return (
    <>
      <div className="center-header">
        <div className="center-banner">
          <h2>Welcome to {sportCenter?.sportcenter_name}</h2>
          <span>{sportCenter?.sportcenter_description}</span>
          <div className="center-location">
            <i className="fa-solid fa-location-dot"></i>
            <span className="center-address">
              <p>{sportCenter?.address?.street}</p>
              <p>{sportCenter?.address?.city}</p>
              <p>{sportCenter?.address?.state}</p>
            </span>
          </div>
        </div>
      </div>
      <div className="center-sport">
        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Our Sport Services
        </Typography>
        <div className="center-card">
          {sportCenter?.facilities && sportCenter.facilities.length > 0 ? (
            sportCenter.facilities.map((data) => (
              <CenterCard
                key={data._id}
                image={data.image}
                type={data.name}
                time={`Available: ${sportCenter?.operating_hours.open}-${sportCenter?.operating_hours.close}`}
                price={`$${data.price} per 90 minutes`}
                facilityId={data._id}
                sportCenterId={sportCenter?._id}
              />
            ))
          ) : (
            <p>No facilities available.</p>
          )}
        </div>
      </div>

      <div className="center-map">
        <div className="center-googleMap">
          <h2>View the location</h2>
          <span>You can find the sport center by viewing through this map</span>
          <button type="button" className="center-buttonView">
            View Map
          </button>
        </div>
      </div>

      <div className="center-rating">
        <h3>Client Review</h3>
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
