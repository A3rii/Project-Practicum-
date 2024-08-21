import { useMemo } from "react";
import Loader from "../../../components/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Rating,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tooltip,
} from "@mui/material";

import { Link, Navigate } from "react-router-dom";

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
      <Rating
        sx={{ fontSize: "1.2rem" }}
        value={averageStars}
        precision={0.5}
        readOnly
      />
      <Tooltip title={`User Rating ${ratings?.userRates}`}>
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
          center.time_availability &&
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
              gap: ".2rem",
            }}>
            <Typography variant="h6" component="div" sx={{ fontSize: "1rem" }}>
              {data?.sportcenter_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.address?.street},{data?.address?.city},
              {data?.address?.state}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: "3px", fontSize: "0.7rem" }}>
              {data?.operating_hours?.open} - {data?.operating_hours?.close}
            </Typography>

            <Box
              sx={{
                display: "inline-block",
                width: "25%",
                padding: "2px 2px",
                fontSize: "10px",
                fontWeight: "bold",
                backgroundColor: "#7CFC00",
                borderRadius: "8px",
                textAlign: "center",
              }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.6rem", // Smaller font size for text
                  color: "#fff",
                  fontWeight: "bold",
                }}>
                {data?.time_availability && "Open"}
              </Typography>
            </Box>

            <RatingStars sportCenterId={data?._id} />
          </CardContent>
          <Button
            component={Link}
            to={`/sportcenter/${data?._id}`}
            size="small"
            sx={{ marginLeft: "1rem" }}
            variant="contained"
            color="error">
            Book Now
          </Button>
        </Card>
      ))
    );
  }, [sportCenter]);
  if (isLoading) return <Loader />;
  if (error) return <Navigate to="/error" />;
  return <>{listSportCenter} </>;
}

export default function Booking() {
  return (
    <Box sx={{ margin: "2rem", display: "flex", gap: "4rem" }}>
      <SportFieldCard />
    </Box>
  );
}
