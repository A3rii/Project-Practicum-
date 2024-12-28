import { Paper, Typography, Box } from "@mui/material";

export const MatchBox = ({ name, icon: Icon, color, number }) => {
  return (
    <>
      <Paper
        sx={{
          width: "15rem",
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
          <Typography sx={{ fontSize: ".9rem" }}> {name} </Typography>
          <Typography sx={{ fontSize: ".8rem", fontWeight: "bold" }}>
            {number || 0}
          </Typography>
        </Box>
      </Paper>
    </>
  );
};
