import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FacebookAuth() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/auth/facebook/callback${
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
        setLoading(false);
        setData(response.data);
        const token = response.data.access_token;
        const expire_token = response.data.expires_in;
        console.log(token);
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expires_in", expire_token);
        navigate("/", { state: { userData: response.data.user } });
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [navigate]);

  function fetchUserData() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + data.access_token,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (loading) {
    return <>Loading</>;
  } else {
    if (user != null) {
      return <DisplayData data={user} />;
    } else {
      return (
        <div>
          <DisplayData data={data} />
          <div style={{ marginTop: 10 }}>
            <button onClick={fetchUserData}>Fetch User</button>
          </div>
        </div>
      );
    }
  }
}

function DisplayData(data) {
  return (
    <div>
      <samp>{JSON.stringify(data.data, null, 2)}</samp>
    </div>
  );
}

export default FacebookAuth;
