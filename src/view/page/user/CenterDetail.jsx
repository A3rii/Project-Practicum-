import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ContactInfo from "../../../components/ContactInfo";
import UserCurrentLocation from "./../../../components/map/UserCurrentLocation";
import { Box, Typography } from "@mui/material";
import CenterCard from "./../../../components/User/CenterCard";
import { useParams, Navigate } from "react-router-dom";
import RatingReview from "../../../components/User/RatingReview";
export default function CenterDetail() {
  const { sportCenterId } = useParams();

  const {
    data: sportCenter,

    error,
  } = useQuery({
    queryKey: ["sportCenter", sportCenterId],
    queryFn: async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/lessor/auth/informations/${sportCenterId}`
      );
      return response.data.lessor;
    },
  });

  if (error) return <Navigate to="/error" />;

  return (
    <>
      <div className="center-header">
        <div className="center-banner">
          <h2>Welcome to {sportCenter?.sportcenter_name}</h2>
          <span>{sportCenter?.sportcenter_description}</span>
          <div className="center-location">
            <p>{sportCenter?.address?.street},</p>
            <p>{sportCenter?.address?.state}</p>
            <p>{sportCenter?.address?.city},</p>
          </div>
        </div>
      </div>
      <div className="center-sport">
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { lg: "1.8rem", md: "1.2rem", xs: "1rem" },
            color: "var(--primary)",
          }}>
          Our Sport Services
        </Typography>
        <div className="center-card">
          {sportCenter?.facilities && sportCenter.facilities.length > 0 ? (
            sportCenter.facilities.map((data) => (
              <CenterCard
                key={data._id}
                image={data.image}
                type={data.name}
                time={`Available: ${sportCenter?.operating_hours.open}-${sportCenter?.operating_hours.close}`}
                price={`$${data.price} per 60 minutes`}
                facilityId={data._id}
                sportCenterId={sportCenter?._id}
              />
            ))
          ) : (
            <p>No facilities available.</p>
          )}
        </div>
      </div>

      {/* Move Review and Ratings to separate file */}
      <RatingReview sportCenterId={sportCenterId} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "3rem",
          padding: "1.5rem",
          background: "var(--soft-grey)",
        }}>
        <Box
          sx={{
            width: "75%",
            borderRadius: ".5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
          elevation={3}>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "var(--primary)",
            }}>
            Our Location
          </Typography>
          <UserCurrentLocation
            user
            latitude={sportCenter?.location?.coordinates[1]}
            longitude={sportCenter?.location?.coordinates[0]}
            name={sportCenter?.sportcenter_name}
          />
        </Box>
      </Box>

      <div className="center-contact">
        <ContactInfo />
      </div>
    </>
  );
}
