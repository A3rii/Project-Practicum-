import axios from "axios";

const fetchSportCentersLocation = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/location/sportcenters/destination`
    );
    return data.coordinates;
  } catch (err) {
    throw new Error(err);
  }
};

export { fetchSportCentersLocation };
