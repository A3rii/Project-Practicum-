import CountUp from "react-countup";

import { Paper, Typography, Box } from "@mui/material";

export const InfoCard = ({ title, value, icon: Icon, color, currency }) => (
  <Paper
    sx={{
      width: "100%",
      height: "9rem",
      overflow: "hidden",
      padding: "15px",
      backgroundColor: "#ffffff",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "5px",
    }}
    elevation={2}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
      }}>
      <Typography
        sx={{
          fontSize: ".9rem",
          fontWeight: "light",
          color: "#374151",
          marginLeft: ".5rem",
        }}>
        {title}
      </Typography>
      <Typography
        sx={{
          color: "#374151",
          padding: "12px",
          fontSize: "2rem",
          fontWeight: "bold",
        }}>
        {currency && (
          <CountUp
            start={0}
            end={Number(value)}
            duration={2.5}
            decimals={2}
            decimal="."
            prefix="$"
          />
        )}
        <CountUp start={0} end={parseInt(value)} duration={2.5} />
      </Typography>
    </Box>
    <Paper
      sx={{
        width: "4rem",
        height: "4rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        backgroundColor: color,
      }}>
      <Icon sx={{ fontSize: "2rem", color: "#ffffff" }} />
    </Paper>
  </Paper>
);
