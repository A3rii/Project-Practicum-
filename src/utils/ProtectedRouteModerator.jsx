import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import authToken from "./authToken";
import Loader from "./../components/Loader";

export default function ProtectedRouteModerator() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModeratorProfile = async () => {
      const token = authToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/moderator/profile`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const moderatorProfile = response.data.moderator;
        setRole(moderatorProfile.role);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModeratorProfile();
  }, []);
  if (loading) {
    return <Loader />;
  }

  if (role === "moderator") {
    console.log("You are moderator");
    return <Outlet />;
  } else {
    console.log("You are not moderator");
    return <Navigate to="/protected" replace />;
  }
}
