import { Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export default function BarRatings({ star, userRate }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography sx={{ width: "3rem", fontSize: ".8rem" }}>
        {star} Stars
      </Typography>
      <LinearProgress
        variant="determinate"
        value={userRate}
        sx={{
          width: "8rem",
          height: "0.5rem",
          borderRadius: "5px",
          backgroundColor: "#e0e0e0",
          ml: 1,
        }}
      />
      <Typography sx={{ ml: 2, fontSize: ".8rem" }}>{userRate}</Typography>
    </Box>
  );
}
