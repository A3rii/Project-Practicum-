import axios from "axios";

// Bakong payment gateway
const getBakongQr = async ({
  price,
  currency,
  sportcCenterName,
  mobileNumber,
  bakongAccount,
  bakongAccountName,
}) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment/generate-khqr`,
      {
        price,
        currency,
        sportcCenterName,
        mobileNumber,
        bakongAccount,
        bakongAccountName,
      }
    );
    return data?.individual_qr?.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get payment token for payment verification
const getRenewTokeFromBakong = async ({ email }) => {
  try {
    const response = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/renew_token",
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data?.data?.token;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Verifying the payment whether it succeeded or not
const checkPayment = async ({ md5, paymentToken }) => {
  try {
    const { data } = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      {
        md5: md5,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${paymentToken}`,
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

// Insert payment detail to DB
const paymentDetail = async ({ user, lessor, booking, currency, amount }) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment`,
      {
        user,
        lessor,
        booking,
        currency,
        amount,
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export { getBakongQr, getRenewTokeFromBakong, checkPayment, paymentDetail };
