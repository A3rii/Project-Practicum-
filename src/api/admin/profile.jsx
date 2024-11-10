import axios from "axios";

// Fetching profile of lessor
const fetchLessor = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/lessor/auth/profile`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.lessor; // return all the data
};

// Update API for lessor's information
const updateLessor = async (updatedData, token) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/lessor/update`,
    updatedData,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export { fetchLessor, updateLessor };
