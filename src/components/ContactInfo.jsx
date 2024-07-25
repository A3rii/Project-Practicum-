import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
export default function ContactInfo() {
  const { sportCenterId } = useParams();
  const [sportInformation, setSportInformation] = useState([]);

  // Get Lessor information
  useEffect(() => {
    const fetchSportCenter = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/lessor/auth/users/${sportCenterId}`
        );
        const lessor = response.data.lessor;
        setSportInformation(lessor);
      } catch (err) {
        console.error("Error fetching sport center:", err.message);
        setSportInformation([]);
      }
    };

    fetchSportCenter();
  }, [sportCenterId]);

  return (
    <>
      <div></div>
      <div className="center-contactInfo">
        <button type="button" className="center-buttonContact  ">
          Contact Now
        </button>
        <div className="center-contactDetails">
          <span> {sportInformation.phone_number} </span>
          <span> Email: {sportInformation.email} </span>
        </div>
      </div>
      <div className="center-socialMedia">
        <i className="fa-brands fa-telegram"></i>
        <i className="fa-brands fa-facebook"></i>
      </div>
    </>
  );
}
