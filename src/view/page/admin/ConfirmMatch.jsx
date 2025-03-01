import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

export default function ComfirmMatch() {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box
        sx={{
          background: "var(--white)",
          width: "20rem",
          maxWidth: "100%",
          marginLeft: "2rem",
          borderRadius: "3px 3px 0",
        }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            component={Link}
            to={"/admin/confirm_match/confirm"}
            value="1"
            label="Comfirm Match"
            sx={{
              fontSize: "0.85rem",
              boxShadow:
                value === "1"
                  ? "rgb(204, 219, 232) 3px 3px 6px 0px inset"
                  : "none",
            }}
          />
          <Tab
            component={Link}
            to={"/admin/confirm_match/incoming"}
            value="2"
            label="Match Acception"
            sx={{
              fontSize: "0.85rem",
              boxShadow:
                value === "2"
                  ? "rgb(204, 219, 232) 3px 3px 6px 0px inset"
                  : "none",
            }}
          />
        </Tabs>
      </Box>

      <Outlet />
    </>
  );
}
