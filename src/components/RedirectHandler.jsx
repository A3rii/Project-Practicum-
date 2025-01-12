import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// Accessing super admin routes
export default function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/super-admin") {
      navigate("/signin-moderator");
    }
  }, [location, navigate]);

  return null;
}
