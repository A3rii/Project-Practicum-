import { formatDate } from "./../../utils/timeCalculation";
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
export default function HistoryCard({ data }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: { lg: "start", xs: "center" },
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem",
      }}>
      {data.length > 0 ? (
        data.map((match, key) => (
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
              <Button size="small" variant="contained">
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
}
