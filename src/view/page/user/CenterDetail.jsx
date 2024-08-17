import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import ContactInfo from "../../../components/ContactInfo";
import Loader from "../../../components/Loader";
import dayjs from "dayjs";
import currentUser from "./../../../utils/currentUser";
import BarRating from "./../../../components/BarRating";
import { ToastContainer } from "react-toastify";
import { notify, errorAlert } from "./../../../utils/toastAlert";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Rating,
  Typography,
  Paper,
  Box,
  FormControl,
  Input,
} from "@mui/material";

import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import authToken from "./../../../utils/authToken";
import BarRatings from "./../../../components/BarRating";

// Get all comments of a specific sport center
const fetchComments = async ({ pageParam = 1, sportCenterId }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/posts/public/comments`,
      {
        params: {
          sportCenterId: sportCenterId,
          page: pageParam,
          limit: 1,
        },
      }
    );

    const { comments, currentPage, hasNextPage } = response.data;

    // Filter only approved comments only
    const approvedComments =
      comments.length > 0
        ? comments.filter((comment) => comment.status === "approved")
        : [];

    return {
      comments: approvedComments,

      // To load more comments check the api does it provides the next page.
      // If it has , it means we can load more comments.
      nextCursor: hasNextPage ? currentPage + 1 : null,
    };
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to fetch comments. Please try again later.");
  }
};

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

//* Comment Section
function CommentsSection() {
  const { sportCenterId } = useParams();

  // Infinite scrolling
  const {
    data: commentPages = { page: [] },
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["userComments", sportCenterId],
    queryFn: ({ pageParam }) => fetchComments({ pageParam, sportCenterId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  // Checking if the center does not have comments.
  // In react query it return an array of comment object which if have to check only first array.
  // If it empty , all the array are empty
  const emptyComments = useMemo(() => {
    // Check if `commentPages.pages` is defined and is an array
    if (!commentPages.pages || !Array.isArray(commentPages.pages)) {
      return null;
    }

    // Check if every page's comments array is empty
    const allCommentsEmpty = commentPages.pages.every(
      (page) => !page.comments || page.comments.length === 0
    );

    return allCommentsEmpty ? (
      <Box
        sx={{
          width: "100%",
          padding: "1rem",
          outline: "1px solid #000",
          borderRadius: "5px",
        }}
        elevation={3}>
        No Comment
      </Box>
    ) : null;
  }, [commentPages.pages]);

  if (status === "pending") return <Loader />;
  if (error) return <p>Error loading comments</p>;

  return (
    <>
      {emptyComments}
      {commentPages.pages.map((page, pageIndex) => (
        <Box sx={{ width: "100%" }} key={pageIndex}>
          {page.comments.map((data, key) => (
            <Card
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
              square={false}
              elevation={4}
              variant="outlined">
              <CardHeader
                sx={{ width: "75%" }}
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }}>
                    {data?.postBy?.name[0]}
                  </Avatar>
                }
                title={data?.postBy?.name}
                subheader={dayjs(data.commentedAt).format("MMMM, DD YYYY")}
              />
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "end",
                  flexDirection: "column",
                  width: "100%",
                }}>
                <Typography color="text.secondary">{data?.comment}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: ".5rem",
                  }}>
                  <Rating
                    name="read-only"
                    precision={0.5}
                    value={data?.ratingValue || 0}
                    readOnly
                  />
                  <Typography
                    sx={{
                      fontWeight: "light",
                      fontSize: ".8rem",
                      color: "#595959",
                    }}>
                    ({data.ratingValue})
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}

      {/* Load More Button */}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          sx={{ background: "#dedede", color: "#000" }}
          fullWidth>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </>
  );
}

//* Facility Card
function CenterCard({ image, type, time, price, facilityId, sportCenterId }) {
  return (
    <Card
      sx={{
        width: { lg: 250, md: 210, xs: 200 },
        height: { lg: 410, md: 360, xs: 350 },
      }}>
      <CardMedia
        sx={{ height: { lg: 250, md: 210, xs: 200 } }}
        loading="lazy"
        image={image}
        title="Sport Category"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ fontSize: "1rem" }}>
          {type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <i
            className="fa-regular fa-calendar-check"
            style={{ marginRight: "12px" }}></i>
          {time}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <i
            className="fa-solid fa-calendar-days"
            style={{ marginRight: "12px" }}></i>
          {price}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/facility/${facilityId}/sport-center/${sportCenterId}`}>
          <Button variant="outlined" color="error">
            Explore more
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

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

  console.log(overviewRating);
  // Handle comment submission
  const handleSubmit = (e) => {
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
  };

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

      <div className="center-map">
        <div className="center-googleMap">
          <h2>View the location</h2>
          <span>You can find the sport center by viewing through this map</span>
          <button type="button" className="center-buttonView">
            View Map
          </button>
        </div>
      </div>

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
          sx={{ display: "flex", flexDirection: "column", width: "75%" }}
          elevation={5}>
          <Typography
            sx={{
              padding: "2rem",
              fontWeight: "bold",
              fontSize: "1.5rem",
              textAlign: "center",
            }}>
            Reviews and ratings
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
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
                onChange={(newValue) => {
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
            <CommentsSection />
          </Box>
        </Paper>
      </Box>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
