import axios from "axios";

const resetPassword = async (token, id, credential) => {
  try {
    const { data } = await axios.put(
      `${
        import.meta.env.VITE_API_URL
      }/auth/moderator/reset-password/lessor/${id}`,
      credential,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.lessor;
  } catch (err) {
    throw new Error(err);
  }
};

const fetchLessors = async (token) => {
  try {
    const getLessors = await axios.get(
      `${import.meta.env.VITE_API_URL}/moderator/find/lessors/ratings`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return getLessors.data.lessor;
  } catch (err) {
    throw new Error(err.message);
  }
};

export { resetPassword, fetchLessors };
