import { styled } from "@mui/material/styles";
import { Switch, FormControlLabel, Tooltip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorAlert } from "./../../../utils/toastAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import { useState, useEffect } from "react";

// API call to update lessor's information
const updateLessor = async (updatedData) => {
  const token = authToken();
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/lessor/update`,
      updatedData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Update failed");
  }
};

// Custom-styled Switch component
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function GreenSwitch({ timeAvailability }) {
  const queryClient = useQueryClient();
  const [isAvailable, setIsAvailable] = useState(timeAvailability);

  // Sync local state with prop if it changes
  useEffect(() => {
    setIsAvailable(timeAvailability);
  }, [timeAvailability]);

  const updateTimeAvailability = useMutation({
    mutationFn: (updateData) => updateLessor(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries("currentLessor");
    },
    onError: () => {
      errorAlert("Failed to update time availability");
    },
  });

  const handleChangingTime = (e) => {
    const newAvailability = e.target.checked; // Get the checked state of the switch
    setIsAvailable(newAvailability); // Update the local state immediately for a responsive UI
    updateTimeAvailability.mutate({ time_availability: newAvailability });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Tooltip
        title={isAvailable ? "Sport Center is open" : "Sport Center is closed"}>
        <FormControlLabel
          control={
            <IOSSwitch checked={isAvailable} onChange={handleChangingTime} />
          }
        />
      </Tooltip>
    </>
  );
}
