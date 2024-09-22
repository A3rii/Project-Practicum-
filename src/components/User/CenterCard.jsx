import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
//* Facility Card
const CenterCard = ({
  image,
  type,
  time,
  price,
  facilityId,
  sportCenterId,
}) => {
  return (
    <Card
      sx={{
        width: { lg: 250, md: 210, xs: 200 },
        height: { lg: 410, md: 360, xs: 350 },
      }}>
      <CardMedia
        sx={{ height: { lg: 250, md: 210, xs: 200 } }}
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
};
export default CenterCard;
