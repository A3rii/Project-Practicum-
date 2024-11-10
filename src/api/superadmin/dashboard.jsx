import axios from "axios";
import authToken from "./../../utils/authToken";
// API fetcher functions
const fetchLessors = async () => {
  const token = authToken();
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/moderator/find/lessors`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data.lessors;
};

const fetchUsers = async () => {
  const token = authToken();
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/moderator/list/users`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { fetchLessors, fetchUsers };
