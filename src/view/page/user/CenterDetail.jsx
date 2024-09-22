import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import ContactInfo from "../../../components/ContactInfo";
import Loader from "../../../components/Loader";
import CenterCard from "../../../components/User/CenterCard";
import currentUser from "./../../../utils/currentUser";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import UserCurrentLocation from "../../../components/map/UserCurrentLocation";
import {
  Button,
  Avatar,
  Rating,
  Typography,
  Paper,
  Box,
  FormControl,
  Input,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authToken from "./../../../utils/authToken";
import BarRatings from "./../../../components/BarRating";
import CommentsSection from "../../../components/User/Comment";

// Handle Posting comment by user
const postComment = async (userId, sportCenterId, comment, ratingValue) => {
  const token = authToken();

  // Data that we need to post to api
  const information = {
    postBy: userId,
    postTo: sportCenterId,
    comment: comment,
    ratingValue: ratingValue,
  };
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/user/posts/comments`,
      information,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Error posting comment:", err);
    throw new Error("Failed to post comment. Please try again later.");
  }
};

// Request to get average rating
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
    return rating.data.count;
  } catch (err) {
    throw new Error(err);
  }
};

export default function CenterDetail() {
  const user = currentUser();
  const queryClient = useQueryClient();
  const { sportCenterId } = useParams();
  const [comment, setComment] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  const {
    data: sportCenter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sportCenter", sportCenterId],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/lessor/auth/informations/${sportCenterId}`
      );
      return response.data.lessor;
    },
  });

  // Handling the comment post of user and update the data immediately after
  const mutation = useMutation({
    mutationFn: () =>
      postComment(user?._id, sportCenterId, comment, ratingValue),
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

  // Average Rating
  const { data: rating } = useQuery({
    queryKey: ["rating", sportCenterId],
    queryFn: () => averageRating(sportCenterId),
    enable: !!sportCenterId,
  });

  // Rating Overview

  const { data: overviewRating } = useQuery({
    queryKey: ["overviewRating", sportCenterId],
    queryFn: () => ratingOverview(sportCenterId),
    enable: !!sportCenterId,
  });

  // Handle comment submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Guest mode if not logged in, can't comment
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) return <Navigate to="/error" />;

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
      <div className="center-header">
        <div className="center-banner">
          <h2>Welcome to {sportCenter?.sportcenter_name}</h2>
          <span>{sportCenter?.sportcenter_description}</span>
          <div className="center-location">
            <i className="fa-solid fa-location-dot"></i>
            <span className="center-address">
              <p>{sportCenter?.address?.street}</p>
              <p>{sportCenter?.address?.city}</p>
              <p>{sportCenter?.address?.state}</p>
            </span>
          </div>
        </div>
      </div>
      <div className="center-sport">
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { lg: "1.5rem", md: "1.2rem", xs: "1rem" },
          }}>
          Our Sport Services
        </Typography>
        <div className="center-card">
          {sportCenter?.facilities && sportCenter.facilities.length > 0 ? (
            sportCenter.facilities.map((data) => (
              <CenterCard
                key={data._id}
                image={data.image}
                type={data.name}
                time={`Available: ${sportCenter?.operating_hours.open}-${sportCenter?.operating_hours.close}`}
                price={`$${data.price} per 90 minutes`}
                facilityId={data._id}
                sportCenterId={sportCenter?._id}
              />
            ))
          ) : (
            <p>No facilities available.</p>
          )}
        </div>
      </div>

      {/*  Review and rating */}

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
            borderRadius: "1.5rem",
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
                outline: "2px solid #3b9ebf",
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
                    width: "100%", // Ensure proper width
                    padding: "0.5rem", // Adequate padding for the placeholder to be visible
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
        <Box
          sx={{
            width: "75%",
            marginTop: "2rem",
            borderRadius: ".5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
          elevation={3}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}>
            Our Location
          </Typography>
          <UserCurrentLocation
            user
            latitude={sportCenter?.location?.coordinates[1]}
            longitude={sportCenter?.location?.coordinates[0]}
            name={sportCenter?.sportcenter_name}
          />
        </Box>
      </Box>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
