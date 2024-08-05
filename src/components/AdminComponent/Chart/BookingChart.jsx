import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import authToken from "./../../../utils/authToken";
import Loader from "../../Loader";
import { Navigate } from "react-router-dom";

Chart.register(...registerables);

const fetchMonthBookings = async () => {
  const token = authToken();
  try {
    const bookingByMonth = await axios.get(
      `${import.meta.env.VITE_API_URL}/period/bookings/months`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return bookingByMonth.data.month_booking;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export default function BookingChart() {
  const [chartData, setChartData] = useState(null);
  const [year, setYear] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["monthBookings"],
    queryFn: fetchMonthBookings,
  });

  useEffect(() => {
    if (data) {
      const months = [
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

      const bookingCounts = new Array(12).fill(0); // Initialize an array of 12 zeros
      let bookingYear = null;

      // Update the booking counts based on the fetched data
      data.forEach((booking) => {
        bookingCounts[booking._id.month - 1] = booking.count;
        bookingYear = booking._id.year;
      });
      setChartData({
        labels: months,
        datasets: [
          {
            label: `Total Bookings (month)`,
            data: bookingCounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1,
          },
        ],
      });
      setYear(bookingYear);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) return <Navigate to="/error" />;

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "40%",
        height: "350px",
        border: "1px solid #000",
        padding: "1rem",
        gap: "1rem",
      }}>
      <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Total Bookings in ({year})
      </Typography>
      {chartData && <Bar data={chartData} />}
    </Paper>
  );
}
