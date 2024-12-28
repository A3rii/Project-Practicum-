import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Rating,
  FormControl,
  Input,
} from "@mui/material";
import BarRatings from "./../../components/BarRating";
import CommentsSection from "./../../components/User/Comment";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify, errorAlert } from "./../../utils/toastAlert";
import { ratingAPI } from "./../../api/user/index";
import currentUser from "./../../utils/currentUser";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function RatingReview({ sportCenterId }) {
  const user = currentUser();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  const mutation = useMutation({
    mutationFn: () =>
      ratingAPI.postComment(user?._id, sportCenterId, comment, ratingValue),
    onSuccess: () => {
      queryClient.invalidateQueries(["userComments", sportCenterId]);
      notify("Comment posted successfully");
      setComment("");
      setRatingValue(0);
    },
    onError: () => {
      errorAlert("Error posting comment");
    },
  });

  const { data: rating } = useQuery({
    queryKey: ["rating", sportCenterId],
    queryFn: () => ratingAPI.averageRating(sportCenterId),
    enable: !!sportCenterId,
  });

  const { data: overviewRating } = useQuery({
    queryKey: ["overviewRating", sportCenterId],
    queryFn: () => ratingAPI.ratingOverview(sportCenterId),
    enable: !!sportCenterId,
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!user) {
        setComment("");
        return errorAlert("You need to login to comment.");
      }

      if (!comment || !ratingValue) {
        errorAlert("You are missing the fields.");
        return;
      }

      mutation.mutate();
    },
    [comment, ratingValue, user, mutation]
  );

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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "3rem",
          padding: "1rem",
        }}>
        <Paper
          sx={{
            display: "flex",
            width: "75%",
            flexDirection: "column",
          }}
          elevation={3}>
          <Typography
            sx={{
              padding: "2rem",
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
            }}>
            Reviews and ratings
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}>
            <Box
              sx={{
                width: "95%",
                padding: "2rem",
                margin: "2rem",
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                flexDirection: "column",
                gap: ".8rem",
                outline: "1px solid var(--primary)",
                borderRadius: ".9rem",
              }}
              tabIndex={0}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "1rem",
                }}>
                <Avatar
                  alt={user?.name}
                  src={
                    user?.avatarUrl ||
                    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"
                  }
                />
                <Typography sx={{ fontWeight: "bold" }}>
                  {user?.name || "Guest User"}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <Input
                  placeholder="Write your thought here!"
                  value={comment}
                  sx={{
                    width: "100%",
                    padding: "0.5rem",
                  }}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FormControl>
              <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={mutation.isLoading}>
                {mutation.isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Box>

            {/* Star Rating */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
                padding: "1rem",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}>
                  {rating?.averageStars} / 5
                </Typography>
                <Rating
                  name="read-only"
                  precision={0.5}
                  sx={{ fontSize: "2rem" }}
                  value={rating?.averageStars || 0}
                  readOnly
                />
                <Typography
                  sx={{
                    padding: ".4rem",
                    fontWeight: "light",
                    fontSize: ".8rem",
                    color: "#7b7b7b",
                  }}>
                  Based on {rating?.userRates} ratings
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  zIndex: 2,
                }}>
                <BarRatings star={5} userRate={overviewRating?.countRating_5} />
                <BarRatings star={4} userRate={overviewRating?.countRating_4} />
                <BarRatings star={3} userRate={overviewRating?.countRating_3} />
                <BarRatings star={2} userRate={overviewRating?.countRating_2} />
                <BarRatings star={1} userRate={overviewRating?.countRating_1} />
              </Box>
            </Box>
          </Box>

          {/* Comment Box */}
          <Box
            sx={{
              width: "95%",
              padding: "1rem",
              margin: "1rem",
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
              gap: "1rem",
            }}
            tabIndex={0}>
            <CommentsSection sportCenterId={sportCenterId} />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
