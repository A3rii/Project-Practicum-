import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ProtectImage from "./../assets/protected.jpg";

export default function ProtectedPage() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${ProtectImage})`,  
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          gap: ".6rem",
        }}>
        <Typography
          sx={{
            color: "var(--white)",
            fontSize: "6rem",
            fontWeight: "bold",
          }}>
          403
        </Typography>
        <Typography
          sx={{
            color: "var(--white)",
            fontSize: "1rem",
          }}>
          You are not allowed to accepted this page
        </Typography>
        <Typography
          sx={{
            color: "var(--white)",
            fontSize: "2rem",
            fontWeight: "bold",
          }}>
          This route has been proteced.
        </Typography>
        <Button
          component={Link}
          to="/"
          sx={{ marginTop: "2rem" }}
          variant="contained"
          color="secondary">
          Go to Home
        </Button>
      </Box>
    </>
  );
}
