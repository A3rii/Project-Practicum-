import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function MatchHistory() {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "2rem",
          color: "var(--dark)",
        }}>
        <Typography sx={{ p: 2, fontSize: "1.5rem", fontWeight: "bold" }}>
          Your Matches
        </Typography>
        <Tabs
          sx={{
            color: "var(--dark)",
            "& .MuiTab-root": {
              color: "var(--dark)",
            },
          }}
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          centered>
          <Tab
            component={Link}
            to="/match-history/all-match"
            value={"1"}
            label="All"
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
