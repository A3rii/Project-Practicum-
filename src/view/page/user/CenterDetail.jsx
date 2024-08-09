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
import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authToken from "./../../../utils/authToken";

// Get all comments of a specific sport center
const fetchComments = async (sportCenterId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/posts/public/comments`,
      {
        params: {
          sportCenterId: sportCenterId,
        },
      }
    );
    const comments = response.data.comments;
    const approvedComments = comments.filter(
      (comment) => comment.status === "approved"
    );
    return approvedComments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to fetch comments. Please try again later.");
  }
};

// Post comment by user
const postComment = async (userId, sportCenterId, comment) => {
  const token = authToken();
  const information = {
    postBy: userId,
    postTo: sportCenterId,
    comment: comment,
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

//* Comment Section
function CommentsSection() {
  const value = 2;
  const { sportCenterId } = useParams();

  const {
    data: userComments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userComments", sportCenterId],
    queryFn: () => fetchComments(sportCenterId),
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading comments</p>;

  return (
    <>
      {userComments.length > 0 ? (
        userComments.map((data, key) => (
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
              <Rating name="read-only" value={value} readOnly />
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography color="text.secondary">No comments</Typography>
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

// Top banner
export default function CenterDetail() {
  const user = currentUser();
  const { sportCenterId } = useParams();
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: () => postComment(user?._id, sportCenterId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["userComments", sportCenterId]);
      notify("Comment posted successfully");
      setComment("");
    },
    onError: () => {
      errorAlert("Error posting comment");
    },
  });

  // Handle comment submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Guest mode
    if (!user) {
      setComment("");
      return errorAlert("You need to login to comment.");
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
        }}>
        <Paper sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Typography
            sx={{ padding: "1.5rem", fontWeight: "bold" }}
            variant="h5">
            Comments
          </Typography>
          <Box
            sx={{
              width: "95%",
              padding: "1rem",
              margin: "1rem",
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              flexDirection: "column",
              gap: ".8rem",
              transition: "outline 0.1s ease-in-out",
              "&:focus": {
                outline: "2px solid #3b9ebf",
                borderRadius: ".9rem",
              },
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
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={mutation.isLoading}>
              {mutation.isLoading ? "Submitting..." : "Submit"}
            </Button>
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
              gap: ".8rem",
            }}
            tabIndex={0}>
            <CommentsSection />
            <Button sx={{ background: "#dedede", color: "#000" }} fullWidth>
              Load More
            </Button>
          </Box>
        </Paper>
      </Box>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
