import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import NotFound from "./../assets/notFound.jpg";
export default function PageNotFound() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${NotFound})`,
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
          404
        </Typography>
        <Typography
          sx={{
            color: "var(--white)",
            fontSize: "1rem",
          }}>
          Sorry, we couldn't find this page.
        </Typography>
        <Typography
          sx={{
            color: "var(--white)",
            fontSize: "2rem",
            fontWeight: "bold",
          }}>
          Page Not Found
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
