import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import authToken from "./authToken";
import Loader from "./../components/Loader";

export default function UserProtectedRoute() {
  const [lessorRole, setLessorRole] = useState(null);
  const [lessorStatus, setLessorStatus] = useState(null);
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
          `${import.meta.env.VITE_API_URL}/lessor/auth/profile`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userProfile = response.data.lessor;
        setLessorRole(userProfile.role);
        setLessorStatus(userProfile.status);
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

  // The route can only access by admin, and they've been approved by moderator
  if (lessorRole === "admin" && lessorStatus === "approved") {
    return <Outlet />;
  } else {
    return <Navigate to="/protected" replace />;
  }
}
