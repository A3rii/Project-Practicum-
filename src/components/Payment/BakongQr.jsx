/* eslint-disable react-hooks/exhaustive-deps */
import "react-toastify/dist/ReactToastify.css";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify, errorAlert } from "../../utils/toastAlert";
import { ToastContainer } from "react-toastify";
import { paymentAPI } from "../../api/user";
import Loader from "./../Loader";
import BakongLogo from "./../../assets/bakong.png";
import RielIcon from "./../../assets/riel.png";
import DollarIcon from "./../../assets/dollar.png";
import {
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Typography,
  Box,
  FormControl,
  Chip,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import currentUser from "../../utils/currentUser";
import axios from "axios";
import authToken from "../../utils/authToken";
import { currencyChange, totalHourPrice } from "./../../utils/currency";
const useApiMutation = (mutationFn, onSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      onSuccessCallback(data);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("API Error:", error.message);
    },
  });
};

const BakongQr = () => {
  const navigate = useNavigate();
  const user = currentUser();
  const token = authToken();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [currency, setCurrency] = useState("khr");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [qrCode, setQrCode] = useState(null);
  const [md5, setMD5] = useState(null);
  const [paymentToken, setPaymentToken] = useState(null);

  const changingCurrency = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
  };

  console.log(paymentToken);

  //TODO: This URL must be protected
  const bookingDetails = {
    bookingDate: dayjs(queryParams.get("bookingDate")).format("YYYY-MM-DD"),
    timeStart: queryParams.get("timeStart"),
    timeEnd: queryParams.get("timeEnd"),
    userPhonenumber: queryParams.get("userPhonenumber"),
    court: queryParams.get("court"),
    price: parseFloat(queryParams.get("price")),
    duration: queryParams.get("duration"),
    facility: queryParams.get("facility"),
    sportCenterId: queryParams.get("sportCenterId"),
  };

  const generateQrMutation = useApiMutation(paymentAPI.getBakongQr, (data) => {
    setQrCode(data?.qr);
    setMD5(data?.md5);
  });

  //TODO : Changing Information Later base bakong verified email
  /*
   * @ mobileNumber , bakongAccount , bakongAccountName has to be changed according to each lessor
   */
  useEffect(() => {
    if (bookingDetails.price) {
      generateQrMutation.mutate({
        price: totalHourPrice(
          bookingDetails.timeStart,
          bookingDetails.timeEnd,
          currencyChange(currency, bookingDetails.price)
        ),
        currency: currency,
        sportcCenterName: "Example Sport Center",
        mobileNumber: "10253374",
        bakongAccount: "nam_kimly@aclb",
        bakongAccountName: "Kimly Nam",
      });
    }
  }, [currency]);

  const fetchTokenMutation = useApiMutation(
    paymentAPI.getRenewTokeFromBakong,
    setPaymentToken
  );

  // verifying the payment for user

  const verifyPaymentMutation = useApiMutation(
    paymentAPI.checkPayment,
    async (data) => {
      // If payment is already complete or processing, don't continue
      if (isPaymentComplete) return;

      if (data.responseMessage === "Success") {
        // Immediately set payment as complete to prevent further processing
        setIsPaymentComplete(true);
        notify("Payment Success! You have been booked");

        if (!user?.phone_number) {
          errorAlert(
            "Please add a phone number to your profile before proceeding."
          );
          return;
        }

        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          // Create booking first
          const bookingPayload = {
            user: user._id,
            lessor: bookingDetails.sportCenterId,
            facility: bookingDetails.facility,
            court: bookingDetails.court,
            date: bookingDetails.bookingDate,
            startTime: bookingDetails.timeStart,
            endTime: bookingDetails.timeEnd,
          };

          const bookingResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/books/sport-center`,
            bookingPayload,
            config
          );

          if (!bookingResponse?.data?.booking?._id) {
            throw new Error("Booking creation failed - no booking ID received");
          }

          // Create payment with booking reference
          const paymentPayload = {
            user: user._id,
            lessor: bookingDetails.sportCenterId,
            currency: currency,
            amount: totalHourPrice(
              bookingDetails.timeStart,
              bookingDetails.timeEnd,
              currencyChange(currency, bookingDetails.price)
            ),
            status: "paid",
            booking: bookingResponse?.data?.booking?._id,
          };

          const paymentResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/payment`,
            paymentPayload,
            config
          );

          if (paymentResponse.status === 200) {
            notify("Payment success!");
          }
          setTimeout(() => navigate("/"), 2000);
        } catch (err) {
          console.error("Error in booking/payment process:", err);
          errorAlert(
            err.response?.data?.message ||
              "Failed to process booking and payment"
          );
          // Reset payment complete flag in case of error
          setIsPaymentComplete(false);
          return;
        }
      }
    }
  );

  // Modified interval effect
  useEffect(() => {
    let intervalId;

    if (!isPaymentComplete && md5 && paymentToken) {
      intervalId = setInterval(() => {
        verifyPaymentMutation.mutate({ md5, paymentToken });
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  //TODO : Using Lessor email
  useEffect(() => {
    fetchTokenMutation.mutate({ email: "namkimly37@gmail.com" });
  }, []);

  // Checking api refreshment every 5sec
  useEffect(() => {
    const intervalId = setInterval(() => {
      verifyPaymentMutation.mutate({ md5, paymentToken });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [md5, paymentToken]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "2rem",
        }}>
        <Paper
          sx={{
            width: "25rem",
            maxWidth: "100%",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: ".6rem ",
          }}>
          <Typography
            variant="h2"
            sx={{ fontSize: "1rem", fontWeight: "bold" }}>
            Scan Qr Code
          </Typography>
          <Typography variant="h5" sx={{ fontSize: ".8rem" }}>
            Scan this code to pay your booking
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}>
            <Typography variant="h5" sx={{ fontSize: ".8rem" }}>
              Price:
            </Typography>
            <Typography sx={{ fontSize: ".8rem", fontWeight: "bold" }}>
              {totalHourPrice(
                bookingDetails.timeStart,
                bookingDetails.timeEnd,
                currencyChange(currency, bookingDetails.price)
              )}
            </Typography>

            {/* Checking the current currency*/}
            {currency === "khr" ? (
              <Typography sx={{ fontSize: ".8rem", fontWeight: "bold" }}>
                រ
              </Typography>
            ) : (
              <Typography sx={{ fontSize: ".8rem", fontWeight: "bold" }}>
                $
              </Typography>
            )}
          </Box>
          <Paper
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              position: "relative",
            }}>
            <img
              src={BakongLogo}
              alt="bakong_logo"
              loading="lazy"
              width={25}
              height={25}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50% , -50%)",
              }}
            />
            {generateQrMutation.isLoading ? (
              <Loader />
            ) : qrCode ? (
              <QRCodeCanvas value={qrCode} />
            ) : (
              <p>No QR Code generated yet.</p>
            )}
          </Paper>

          {/* Detail  */}
          <Divider>
            <Chip
              label="Booking Details"
              size="small"
              sx={{
                fontWeight: "500",
                marginTop: "1rem",
              }}
            />
          </Divider>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              gap: "4px",
              marginTop: "0.5rem",
              flexDirection: "column",
            }}>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Date: {bookingDetails.bookingDate} {""}
              {bookingDetails.timeStart}- {bookingDetails.timeEnd}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Facility: {bookingDetails.facility} {""} Court:
              {bookingDetails.court}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: ".8rem" }}>
              Duration: {bookingDetails.duration}
            </Typography>
          </Box>

          <Chip
            label="Choose Your Currency"
            size="small"
            sx={{
              backgroundColor: "#e0f7fa",
              color: "#00796b",
              fontWeight: "500",
              marginTop: "1rem",
            }}
          />
          <FormControl sx={{ width: "50%", marginTop: ".7rem" }}>
            <InputLabel>Currency</InputLabel>
            <Select
              label="Currency"
              defaultValue={currency}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onChange={changingCurrency}>
              <MenuItem
                value={"khr"}
                sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <img
                  src={RielIcon}
                  alt="riel_icon"
                  loading="lazy"
                  style={{ width: "16px", height: "16px" }}
                />
                <Typography sx={{ fontSize: ".8rem" }}>KHR</Typography>
              </MenuItem>
              <MenuItem
                value={"usd"}
                sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <img
                  src={DollarIcon}
                  alt="dollar_icon"
                  loading="lazy"
                  style={{ width: "16px", height: "16px" }}
                />
                <Typography sx={{ fontSize: ".8rem" }}>USD</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>
    </>
  );
};

export default BakongQr;
