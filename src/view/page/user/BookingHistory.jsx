import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function MatchHistory() {
  const [value, setValue] = useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          flexDirection: "column",
          padding: "2rem",
        }}>
        <Typography sx={{ p: 2, fontWeight: "bold", fontSize: "1.5rem" }}>
          Match History
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          centered>
          <Tab
            component={Link}
            to="/match-history/incoming-user-match"
            label="Incoming"
          />
          <Tab
            component={Link}
            to="/match-history/accepted-match"
            label="Accepted"
          />
          <Tab
            component={Link}
            to="/match-history/rejected-match"
            label="Rejected"
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          margin: "2.5rem",
        }}>
        <Outlet />
      </Box>
    </>
  );
}
