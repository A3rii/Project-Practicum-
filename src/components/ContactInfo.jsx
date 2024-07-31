import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "./../components/Loader";
import axios from "axios";

const fetchSportCenter = async (sportCenterId) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/lessor/auth/informations/${sportCenterId}`
    );
    const lessor = response.data.lessor;
    return lessor;
  } catch (err) {
    console.error("Error fetching sport center:", err.message);
  }
};

export default function ContactInfo() {
  const { sportCenterId } = useParams();

  const {
    data: contactLessor = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contactLessor", sportCenterId],
    queryFn: () => fetchSportCenter(sportCenterId),
  });

  if (isLoading) return <Loader />;
  if (error) return <p>Error Fetching</p>;

  return (
    <>
      <div></div>
      <div className="center-contactInfo">
        <button type="button" className="center-buttonContact  ">
          Contact Now
        </button>
        <div className="center-contactDetails">
          <span> {contactLessor.phone_number} </span>
          <span> Email: {contactLessor.email} </span>
        </div>
      </div>
      <div className="center-socialMedia">
        <i className="fa-brands fa-telegram"></i>
        <i className="fa-brands fa-facebook"></i>
      </div>
    </>
  );
}
