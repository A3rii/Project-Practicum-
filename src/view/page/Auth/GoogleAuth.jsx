import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function GoogleAuth() {
  const navigate = useNavigate();

  // Fetching link for retreving information from google account and store the JWT token
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/auth/google/callback${
          window.location.search
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const access_token = response.data.accesToken;
        Cookies.set("token", access_token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate]);
}

export default GoogleAuth;
