import { Box, Typography, Paper } from "@mui/material";
import NoDataImage from "./../../assets/no_data.jpg";

export default function NoData() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mx: "15rem",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}>
        <img src={NoDataImage} alt="#" width={550} height={450} />
        <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          No Results Found
        </Typography>
      </Box>
    </Box>
  );
}
