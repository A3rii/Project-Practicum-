import { Link } from "react-router-dom";
import currentUser from "../../../utils/currentUser";

function Banner() {
  return (
    <div className="home-banner">
      <h2>Welcome to Sport Renting Site</h2>
      <span>
        This is a site where you can all book your sport field with ease and
        quick services.
      </span>
      <Link to="/booking">
        <button type="button" className="home-bookBtn">
          Book Now
        </button>
      </Link>
    </div>
  );
}

function MapSection() {
  return (
    <div className="home-googleMap">
      <h2>View Sport Centers Around You</h2>
      <span>You can find the sport center by viewing through this map</span>

      <Link to={"/all-sportcenters-location"}>
        <button type="button" className="home-viewmap">
          View Map
        </button>
      </Link>
    </div>
  );
}

function ProcessSection() {
  return (
    <div className="home-process">
      <h2>How does it work?</h2>
      <div className="home-processes">
        <div className="home-mapping">
          <i className="fa-solid fa-map-location-dot"></i>
          <span>Find a sport field that is suitable for you</span>
        </div>
        <div className="home-schedule">
          <i className="fa-solid fa-clock"></i>
          <span>Select an available schedule</span>
        </div>
        <div className="home-booking">
          <i className="fa-solid fa-book-bookmark"></i>
          <span>Confirm your booking with the renter</span>
        </div>
      </div>
    </div>
  );
}

function RentalSection() {
  return (
    <div className="home-rental">
      <h1>Lessor</h1>
      <div className="home-lessorBtn">
        <Link to="/lessor">
          <button className="home-rentalButton">Become A Lessor</button>
        </Link>
        <Link to="/contact">Contact Us Now</Link>
      </div>
      <span className="home-description">
        Advertising your sport center on this site, offering online rental
        places, making your sport center noticeable
      </span>
      <div className="home-verify">
        <div className="home-checked">
          <i className="fa-solid fa-circle-check"></i>
          <span>Build Trust</span>
        </div>
        <div className="home-popularity">
          <i className="fa-solid fa-circle-check"></i>
          <span>Gain popularity</span>
        </div>
        <div className="home-offer">
          <i className="fa-solid fa-circle-check"></i>
          <span>Best offer between customers</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const user = currentUser();
  console.log(user);
  return (
    <>
      <div className="home-header">
        <Banner />
      </div>
      <div className="home-map">
        <MapSection />
      </div>
      <div className="home-processing">
        <ProcessSection />
      </div>
      <RentalSection />
    </>
  );
}
