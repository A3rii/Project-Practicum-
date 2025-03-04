import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import authToken from "./authToken";
import Loader from "./../components/Loader"; // Assuming you have a Loader component

export default function UserProtectedRoute() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = authToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userProfile = response.data.user;
        setUserRole(userProfile.role);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (userRole === "user") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
}
