import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import Loader from "../Loader";
import authToken from "../../utils/authToken";

Chart.register(...registerables);

const fetchMonthUsers = async () => {
  const token = authToken();
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/users/statistic`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.month_users;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export default function UserChart() {
  const {
    data: monthUsers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monthUsers"],
    queryFn: fetchMonthUsers,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Typography>Error loading data.</Typography>;
  }

  // Define the full list of months
  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Map the fetched data to this format, filling in missing months with 0
  const processedData = fullMonths.map((month, index) => {
    // Find the data for the current month (index + 1 because months are 1-based in the data)
    const monthData = monthUsers.find((entry) => entry._id.month === index + 1);
    return monthData ? monthData.count : 0; // If no data, set to 0
  });

  const chartData = {
    labels: fullMonths,
    datasets: [
      {
        label: "Users",
        data: processedData,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "User Count",
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: { xs: "300px", md: "350px", lg: "450px" }, // Responsive height for medium size
        padding: "2rem",
        gap: "1rem",
        borderRadius: "1.2rem",
      }}
      elevation={3}>
      <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}></Typography>

      {chartData && <Line data={chartData} options={options} />}
    </Paper>
  );
}
