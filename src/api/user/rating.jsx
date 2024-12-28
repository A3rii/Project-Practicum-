import authToken from "./../../utils/authToken";
import axios from "axios";

const postComment = async (userId, sportCenterId, comment, ratingValue) => {
  const token = authToken();

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

export { postComment, averageRating, ratingOverview };
