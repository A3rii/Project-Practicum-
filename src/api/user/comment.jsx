import axios from "axios";

/**
 * @param sportCenterId
 * @param fetchComment (Func)
 * @returns
 */

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

export { fetchComments };
