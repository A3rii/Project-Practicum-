import { Doughnut } from "react-chartjs-2";
import { Paper, Typography, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useCurrentLessor from "./../../../utils/useCurrentLessor";
import Loader from "../../Loader";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Average ratings
const averageRating = async (sportCenterId) => {
  try {
    const rating = await axios.get(
      `${import.meta.env.VITE_API_URL}/rating/average/reviews/${sportCenterId}`
    );
    return rating.data || [];
  } catch (err) {
    throw new Error(err);
  }
};

// Rating Overview
const ratingOverview = async (sportCenterId) => {
  try {
    const rating = await axios.get(
      `${import.meta.env.VITE_API_URL}/rating/overviews/${sportCenterId}`
    );
    return rating?.data?.count || 0;
  } catch (err) {
    throw new Error(err);
  }
};

export default function RatingChart() {
  const lessor = useCurrentLessor();
  const {
    data: rating,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rating", lessor?._id],
    queryFn: () => ratingOverview(lessor?._id),
  });

  const { data: averageStars } = useQuery({
    queryKey: ["averageRating", lessor?._id],
    queryFn: () => averageRating(lessor?._id),
  });

  console.log(averageStars);

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading data.</p>;

  // Prepare data for the Pie chart
  const chartData = {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [
      {
        label: "Ratings Distribution",
        data: [
          rating?.countRating_1 || 0,
          rating?.countRating_2 || 0,
          rating?.countRating_3 || 0,
          rating?.countRating_4 || 0,
          rating?.countRating_5 || 0,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const allZero = chartData.datasets[0].data.every((value) => value === 0);
  return (
    <Paper
      sx={{
        padding: "1.5rem",
        textAlign: "center",
        marginTop: "1rem",
        borderRadius: "5px",
        width: { xs: "100%", md: "75%", lg: "100%" },
        height: { xs: "250px", md: "350px", lg: "450px" },
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          width: "100%",
          maxWidth: "100%",
          height: { xs: "350px", md: "300px", lg: "350px" },
        }}>
        {allZero ? (
          <Typography sx={{ marginTop: "2rem" }}>No ratings review</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              flexDirection: "column",
              width: "100%",
              height: { xs: "250px", md: "300px", lg: "350px" },
            }}>
            <Typography
              sx={{
                fontWeight: "600",
                marginBottom: "1rem",
              }}>
              Rating Overview : {parseInt(averageStars?.averageStars) || "0.0"}
            </Typography>
            <Doughnut data={chartData} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
