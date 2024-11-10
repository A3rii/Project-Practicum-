import axios from "axios";

//* Fetching all comments from sport centers
const fetchComments = async (token, sportCenterId, status) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/posts/comments`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          sportCenterId,
          status,
        },
      }
    );

    return response.data.comments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw new Error("Failed to fetch comments. Please try again later.");
  }
};

//* Update status for comment to sport center
const updateCommentStatus = async ({ token, status, commentId }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/posts/comments/${commentId}`,
      { status },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating comment status:", err);
    throw new Error("Failed to update comment status. Please try again later.");
  }
};

export { fetchComments, updateCommentStatus };
