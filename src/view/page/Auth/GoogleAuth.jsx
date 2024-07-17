import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function GoogleAuth() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetching link for retreving information from google account and store the JWT token
  useEffect(() => {
    axios
      .get(
        `https://test1.rd-lab.work/api/auth/google/callback${window.location.search}`,
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
        const user = response.data;
        const access_token = response.data.access_token;
        const expire_token = response.data.expires_in;
        console.log(user);
        localStorage.setItem("token", JSON.stringify(access_token));
        localStorage.setItem("expires_in", expire_token);
        navigate("/", { state: { userData: response.data.user } });
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [navigate]);

  // Just for viewing user
  function fetchUserData() {
    axios
      .get(`https://test1.rd-lab.work/api/user`, {
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

export default GoogleAuth;
