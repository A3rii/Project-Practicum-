import authToken from "./../../utils/authToken";
import axios from "axios";

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${authToken()}`,
  "Content-Type": "application/json",
};

const moderatorProfile = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/moderator/profile`,
      { headers }
    );
    return data.moderator;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateModerator = async (updateInformation) => {
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/auth/moderator/update`,
      updateInformation,
      { headers }
    );
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export { moderatorProfile, updateModerator };
