import axios from "axios";
import authToken from "./../../utils/authToken";

const getPayments = async () => {
  const token = authToken();
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/payment`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data.payments || [];
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
