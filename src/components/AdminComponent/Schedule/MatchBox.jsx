import { Paper, Typography, Box } from "@mui/material";
import CountUp from "react-countup";

export const MatchBox = ({ name, icon: Icon, color, number }) => {
  return (
    <>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}>
        <Box sx={{ margin: 0, padding: "1rem", backgroundColor: color }}>
          <Icon sx={{ fontSize: 20, color: "#ffffff" }} />
        </Box>
        <Box
          sx={{
            marginLeft: ".5rem",
            display: "flex",
            gap: ".1rem",
            justifyContent: "start",
            flexDirection: "column",
            alignItems: "start",
          }}>
          <Typography sx={{ fontSize: ".9rem", color: "#374151" }}>
            {name}
          </Typography>
          <Typography
            sx={{ fontSize: ".8rem", color: "#374151", fontWeight: "bold" }}>
            <CountUp start={0} end={parseInt(number)} duration={2.5} />
          </Typography>
        </Box>
      </Paper>
    </>
  );
};
