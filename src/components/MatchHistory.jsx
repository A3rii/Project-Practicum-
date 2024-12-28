import Loader from "./../components/Loader";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "./../utils/timeCalculation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CardMedia,
} from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { historyAPI } from "./../api/user/index";

const MatchHistory = ({ token, filter }) => {
  const {
    data: incomingMatch = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incomingMatch", token, filter],
    queryFn: () => historyAPI.fetchBookings(token, filter),
    refetchOnWindowFocus: true,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "#ffa500";
      case "rejected":
        return "error";
      default:
        return "grey";
    }
  };

  if (isLoading) return <Loader />;

  if (error) return <Navigate to="/error" />;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: { lg: "start", xs: "center" },
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem",
      }}>
      {incomingMatch.length > 0 ? (
        incomingMatch.map((match, key) => (
          <Card
            key={key}
            sx={{
              maxWidth: 500,
              width: { lg: 250, md: 210, xs: 200 },
              height: { xs: 370 },
              border: "1px solid #dedede",
            }}>
            <CardMedia
              sx={{ height: 180 }}
              image={match?.lessor?.logo}
              title={match?.lessor?.sportcenter_name}
            />
            <CardContent>
              <Typography
                sx={{ fontWeight: "bold" }}
                gutterBottom
                component="div">
                {match?.lessor?.sportcenter_name}
              </Typography>
              <Typography sx={{ fontSize: ".8rem" }} color="text.secondary">
                Date: {formatDate(match?.date)}
              </Typography>
              <Typography sx={{ fontSize: ".8rem" }} color="text.secondary">
                Sport: {match?.facility}
              </Typography>
              <Typography sx={{ fontSize: ".8rem" }} color="text.secondary">
                Court: {match?.court}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color={getStatusColor(match?.status)}>
                {match?.status}
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Box
          sx={{
            width: "100%",
            mx: "10rem",
            border: "1px solid #000",
            borderRadius: "5px",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}>
          <EventBusyIcon />
          <Typography sx={{ fontSize: "1rem" }}>
            There is no incoming match for you
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MatchHistory;
