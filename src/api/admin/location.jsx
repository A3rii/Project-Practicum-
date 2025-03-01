import axios from "axios";
import authToken from "./../../utils/authToken";

const setLocation = async (coordinates) => {
  const token = authToken();
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/location/update/coordinate`,
      coordinates,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data.message;
  } catch (err) {
    throw new Error(err);
  }
};

export { setLocation };
