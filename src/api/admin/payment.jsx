import axios from "axios";
import authToken from "./../../utils/authToken";

const getPayments = async (page) => {
  const token = authToken();
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/payment`,
      {
        params: { page, limit: 5 },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data || [];
  } catch (err) {
    throw new Error(err);
  }
};

const totalIncome = async () => {
  const token = authToken();
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/payment/income`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data.data;
  } catch (err) {
    throw new Error(err);
  }
};

export { getPayments, totalIncome };
