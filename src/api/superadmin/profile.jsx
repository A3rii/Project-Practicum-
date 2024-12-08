import authToken from "./../../utils/authToken";
import axios from "axios";

const moderatorProfile = async () => {
  const token = authToken();
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/moderator/profile`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.moderator;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateModerator = async (updateInformation) => {
  const token = authToken();
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/auth/moderator/update`,
      updateInformation,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export { moderatorProfile, updateModerator };
