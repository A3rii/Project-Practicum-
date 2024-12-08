import axios from "axios";
import authToken from "./../../utils/authToken";

// Fetch lessor for moderators
const fetchLessors = async (token, lessorId) => {
  try {
    const token = authToken();
    const getLessors = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/find/lessors`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        // If there is no id provided , it will display all the lessors
        params: {
          lessorId,
        },
      }
    );
    const lessors = getLessors.data.lessors;
    const approvedLessor = lessors.filter(
      (lessor) => lessor.status === "pending"
    );
    return approvedLessor;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateLessorStatus = async ({ token, lessorId, status }) => {
  try {
    const lessorUpdate = await axios.put(
      `${import.meta.env.VITE_API_URL}/moderator/update/lessors/${lessorId}`,
      { status },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return lessorUpdate.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export { fetchLessors, updateLessorStatus };
